import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// vitest runs with the repo root as cwd
const cli = resolve('bin/sigil.mjs')

const run = (args: string[], cwd: string) =>
  execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' })

const fixture = (css = '') => {
  const dir = mkdtempSync(join(tmpdir(), 'sigil-cli-'))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({
      name: 'fixture',
      dependencies: { svelte: '^5.0.0', 'sigil-ui': '0.0.0' }
    })
  )
  mkdirSync(join(dir, 'src'))
  writeFileSync(join(dir, 'src', 'main.css'), css)
  return dir
}

describe('sigil css init', () => {
  it('scaffolds sigil.config.mjs and refuses to overwrite', () => {
    const dir = fixture()
    const out = run(['css', '--init'], dir)
    expect(out).toContain('wrote sigil.config.mjs')
    expect(readFileSync(join(dir, 'sigil.config.mjs'), 'utf8')).toContain('defineConfig')
    try {
      run(['css', '--init'], dir)
      expect.unreachable('second init should fail')
    } catch (e) {
      expect(String((e as { stderr: string }).stderr)).toContain('already exists')
    }
  })
})

describe('sigil doctor --contrast', () => {
  it('passes a fixture with no token overrides', () => {
    const out = run(['doctor', '--contrast'], fixture())
    expect(out).toContain('sigil-ui doctor for fixture')
    expect(out).not.toContain('WCAG')
  })

  it('fails on token pairs below WCAG AA', () => {
    const dir = fixture(':root { --sig-danger-fg: #ffffff; --sig-danger: #f9f9f9; }')
    try {
      run(['doctor', '--contrast'], dir)
      expect.unreachable('should exit nonzero')
    } catch (e) {
      const err = e as { stdout: string; status: number }
      expect(err.status).toBe(1)
      expect(err.stdout).toContain('--sig-danger-fg on --sig-danger')
      expect(err.stdout).toContain('WCAG')
    }
  })

  it('notes pairs below the 4.5 small-text line without failing', () => {
    const dir = fixture(':root { --sig-muted: #888888; }')
    const out = run(['doctor', '--contrast'], dir)
    expect(out).toContain('note')
    expect(out).toContain('--sig-muted')
  })
})
