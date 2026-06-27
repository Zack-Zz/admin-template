#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const templateDir = join(rootDir, 'templates/module');

const parseArgs = (argv) => {
  const result = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }

    result[key] = next;
    index += 1;
  }

  return result;
};

const toWords = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());

const toPascalCase = (value) =>
  toWords(value)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join('');

const toCamelCase = (value) => {
  const pascal = toPascalCase(value);
  return `${pascal.charAt(0).toLowerCase()}${pascal.slice(1)}`;
};

const toKebabCase = (value) => toWords(value).join('-');

const validateSegment = (name, value) => {
  if (typeof value !== 'string' || !/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(value)) {
    throw new Error(`${name} must start with a letter and contain only letters, numbers, "-" or "_".`);
  }
};

const render = (content, tokens) =>
  Object.entries(tokens).reduce(
    (next, [token, value]) => next.replaceAll(token, value),
    content,
  );

const writeTemplate = (sourceDir, targetDir, tokens) => {
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const renderedName = render(entry.name, tokens).replace(/\.tmpl$/, '');
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, renderedName);

    if (entry.isDirectory()) {
      mkdirSync(targetPath, { recursive: true });
      writeTemplate(sourcePath, targetPath, tokens);
      continue;
    }

    const content = readFileSync(sourcePath, 'utf-8');
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, render(content, tokens));
  }
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const name = String(args.name ?? '');
  const group = String(args.group ?? '');
  const title = String(args.title ?? '');
  const force = Boolean(args.force);
  const dryRun = Boolean(args['dry-run']);

  if (!name || !group || !title) {
    throw new Error('Usage: npm run gen:module -- --name organization --group system --title 组织管理');
  }

  validateSegment('name', name);
  validateSegment('group', group);

  const moduleName = toKebabCase(name);
  const modulePascalName = toPascalCase(name);
  const moduleCamelName = toCamelCase(name);
  const groupName = toKebabCase(group);
  const targetDir = join(rootDir, 'src/pages', groupName, moduleName);

  if (existsSync(targetDir) && !force) {
    throw new Error(`${relative(rootDir, targetDir)} already exists. Use --force to overwrite generated files.`);
  }

  const tokens = {
    __ModuleName__: modulePascalName,
    __moduleName__: moduleCamelName,
    __moduleTitle__: title,
    __groupName__: groupName,
    __modulePath__: moduleName,
  };

  if (!dryRun) {
    mkdirSync(targetDir, { recursive: true });
    writeTemplate(templateDir, targetDir, tokens);
  }

  console.log(
    dryRun
      ? `Dry run passed for ${relative(rootDir, targetDir)}`
      : `Generated ${relative(rootDir, targetDir)}`,
  );
  console.log('');
  console.log('Add this route manually after checking config/routes.ts:');
  console.log(`{ path: '/${groupName}/${moduleName}', name: '${title}', component: './${groupName}/${moduleName}' }`);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
