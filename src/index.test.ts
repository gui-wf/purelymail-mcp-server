import { describe, it, expect, beforeAll } from 'vitest'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { createToolsFromSpec } from './tools/openapi-fetch-generator.js'
import { MockApiClient } from './mocks/mock-client.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json') as { version: string }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('OpenAPI tool surface (mock)', () => {
  it('builds one tool per operation and list_domains executes', async () => {
    const tools = await createToolsFromSpec(new MockApiClient())
    const names = tools.map((t: any) => t.name)
    expect(names).toContain('list_domains')
    expect(names).toContain('create_user')
    expect(names).toContain('check_account_credit')
    expect(tools.length).toBe(19)

    const list = tools.find((t: any) => t.name === 'list_domains')
    const result = await list.execute({})
    expect(result).toBeTruthy()
  })
})

describe('stdio server smoke', () => {
  beforeAll(() => {
    if (!fs.existsSync(path.join(root, 'dist/index.js'))) {
      throw new Error('dist/index.js missing; run npm run build first')
    }
  })

  it('initializes and lists tools when cwd is not the package root', async () => {
    const tmp = fs.mkdtempSync(path.join(root, '.tmp-mcp-'))
    const entry = path.join(root, 'dist/index.js')
    const child = spawn(process.execPath, [entry], {
      cwd: tmp,
      env: { ...process.env, MOCK_MODE: 'true' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => { out += d.toString() })
    child.stderr.on('data', (d) => { err += d.toString() })

    const send = (msg: object) => child.stdin.write(JSON.stringify(msg) + '\n')
    send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'vitest', version: '0' },
      },
    })
    send({ jsonrpc: '2.0', method: 'notifications/initialized' })
    send({ jsonrpc: '2.0', id: 2, method: 'tools/list' })

    const lines = await new Promise<any[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        child.kill('SIGTERM')
        reject(new Error(`timeout; stderr=${err}; stdout=${out}`))
      }, 10000)
      const tryParse = () => {
        const parsed = out
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            try { return JSON.parse(l) } catch { return null }
          })
          .filter(Boolean)
        if (parsed.some((m: any) => m.id === 2)) {
          clearTimeout(timer)
          child.stdin.end()
          child.kill('SIGTERM')
          resolve(parsed)
        }
      }
      child.stdout.on('data', tryParse)
      child.on('error', reject)
    })

    try {
      expect(err).not.toMatch(/ENOENT/)
      const init = lines.find((l: any) => l.id === 1)
      expect(init?.result?.serverInfo?.version).toBe(pkg.version)
      const listed = lines.find((l: any) => l.id === 2)
      expect(listed?.result?.tools?.length).toBe(19)
      const names = listed.result.tools.map((t: any) => t.name)
      expect(names).toContain('list_domains')
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })
})
