import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const runGenerator = (args: string[]) => {
  const result = spawnSync(
    process.execPath,
    [join(process.cwd(), 'scripts/generate-module.mjs'), ...args],
    {
      cwd: process.cwd(),
      encoding: 'utf-8',
    },
  );

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

describe('generate-module script', () => {
  it('prints route, locale keys, and checklist in dry-run mode', () => {
    const result = runGenerator([
      '--name',
      'audit-log',
      '--group',
      'system',
      '--title',
      '审计日志',
      '--title-en',
      'Audit Log',
      '--dry-run',
    ]);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain(
      'Dry run passed for src/pages/system/audit-log',
    );
    expect(result.stdout).toContain(
      "{ path: '/system/audit-log', name: 'system.audit-log', component: './system/audit-log' }",
    );
    expect(result.stdout).toContain("'menu.system.audit-log': 'Audit Log',");
    expect(result.stdout).toContain("'menu.system.audit-log': '审计日志',");
    expect(result.stdout).toContain(
      "'pages.system.audit-log.title': 'Audit Log',",
    );
    expect(result.stdout).toContain(
      "'pages.system.audit-log.title': '审计日志',",
    );
    expect(result.stdout).toContain('After generation checklist:');
    expect(result.stdout).toContain('Review permissionCode values');
  });

  it('fails fast when required arguments are missing', () => {
    const result = runGenerator(['--name', 'audit-log', '--dry-run']);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Usage: npm run gen:module -- --name organization',
    );
  });
});
