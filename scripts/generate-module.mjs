#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
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

const toTitleCase = (value) =>
  toWords(value)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');

const toCamelCase = (value) => {
  const pascal = toPascalCase(value);
  return `${pascal.charAt(0).toLowerCase()}${pascal.slice(1)}`;
};

const toKebabCase = (value) => toWords(value).join('-');

const validateSegment = (name, value) => {
  if (typeof value !== 'string' || !/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(value)) {
    throw new Error(
      `${name} must start with a letter and contain only letters, numbers, "-" or "_".`,
    );
  }
};

const render = (content, tokens) =>
  Object.entries(tokens).reduce(
    (next, [token, value]) => next.replaceAll(token, value),
    content,
  );

const escapeLocaleValue = (value) =>
  value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");

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
  const titleEn = String(args['title-en'] ?? toTitleCase(name));
  const force = Boolean(args.force);
  const dryRun = Boolean(args['dry-run']);

  if (!name || !group || !title) {
    throw new Error(
      'Usage: npm run gen:module -- --name organization --group system --title 组织管理 [--title-en Organization]',
    );
  }

  validateSegment('name', name);
  validateSegment('group', group);

  const moduleName = toKebabCase(name);
  const modulePascalName = toPascalCase(name);
  const moduleCamelName = toCamelCase(name);
  const groupName = toKebabCase(group);
  const targetDir = join(rootDir, 'src/pages', groupName, moduleName);

  if (existsSync(targetDir) && !force) {
    throw new Error(
      `${relative(rootDir, targetDir)} already exists. Use --force to overwrite generated files.`,
    );
  }

  const tokens = {
    __ModuleName__: modulePascalName,
    __moduleName__: moduleCamelName,
    __moduleTitle__: title,
    __moduleTitleEn__: titleEn,
    __groupName__: groupName,
    __modulePath__: moduleName,
  };
  const i18nPrefix = `pages.${groupName}.${moduleName}`;
  const localeEntries = [
    ['title', titleEn, title],
    ['action.create', 'New', '新增'],
    ['action.view', 'View', '详情'],
    ['action.edit', 'Edit', '编辑'],
    ['action.delete', 'Delete', '删除'],
    ['field.keyword', 'Keyword', '关键字'],
    ['field.name', 'Name', '名称'],
    ['field.code', 'Code', '编码'],
    ['field.status', 'Status', '状态'],
    ['field.owner', 'Owner', '负责人'],
    ['field.description', 'Description', '描述'],
    ['field.createdAt', 'Created At', '创建时间'],
    ['field.updatedAt', 'Updated At', '更新时间'],
    ['field.action', 'Action', '操作'],
    ['placeholder.keyword', 'Name / Code / Owner', '名称 / 编码 / 负责人'],
    ['placeholder.name', 'Please enter name', '请输入名称'],
    ['placeholder.code', 'Please enter code', '请输入编码'],
    ['placeholder.status', 'Please select status', '请选择状态'],
    ['placeholder.owner', 'Please enter owner', '请输入负责人'],
    ['placeholder.description', 'Please enter description', '请输入描述'],
    ['status.enabled', 'Enabled', '启用'],
    ['status.disabled', 'Disabled', '禁用'],
    ['form.createTitle', `Create ${titleEn}`, `新增${title}`],
    ['form.editTitle', `Edit ${titleEn}`, `编辑${title}`],
    ['detail.title', `${titleEn} Details`, `${title}详情`],
    ['delete.title', 'Delete this record?', '确认删除该数据？'],
    [
      'delete.description',
      'This only affects the local scaffold example data.',
      '删除后仅影响当前本地示例数据。',
    ],
    ['validation.nameRequired', 'Please enter name', '请输入名称'],
    ['validation.codeRequired', 'Please enter code', '请输入编码'],
    ['validation.statusRequired', 'Please select status', '请选择状态'],
    ['validation.ownerRequired', 'Please enter owner', '请输入负责人'],
    ['message.created', `${titleEn} created`, `${title}已新增`],
    ['message.updated', `${titleEn} updated`, `${title}已更新`],
    ['message.deleted', `${titleEn} deleted`, `${title}已删除`],
  ];

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
  console.log(
    `{ path: '/${groupName}/${moduleName}', name: '${groupName}.${moduleName}', component: './${groupName}/${moduleName}' }`,
  );
  console.log('');
  console.log('Add this menu locale key to src/locales/en-US/menu.ts:');
  console.log(
    `'menu.${groupName}.${moduleName}': '${escapeLocaleValue(titleEn)}',`,
  );
  console.log('');
  console.log('Add this menu locale key to src/locales/zh-CN/menu.ts:');
  console.log(
    `'menu.${groupName}.${moduleName}': '${escapeLocaleValue(title)}',`,
  );
  console.log('');
  console.log('Add these locale keys to src/locales/en-US/pages.ts:');
  for (const [key, enValue] of localeEntries) {
    console.log(`'${i18nPrefix}.${key}': '${escapeLocaleValue(enValue)}',`);
  }
  console.log('');
  console.log('Add these locale keys to src/locales/zh-CN/pages.ts:');
  for (const [key, , zhValue] of localeEntries) {
    console.log(`'${i18nPrefix}.${key}': '${escapeLocaleValue(zhValue)}',`);
  }
  console.log('');
  console.log('After generation checklist:');
  console.log('- Review config/routes.ts and add the route manually.');
  console.log('- Add all printed en-US and zh-CN locale keys.');
  console.log('- Review permissionCode values before connecting real RBAC.');
  console.log('- Run npm run lint, npx antd lint ./src --format json, and npm run test.');
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
