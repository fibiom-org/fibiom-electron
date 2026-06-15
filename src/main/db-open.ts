import { readFileSync } from 'fs'
import Database from 'better-sqlite3-multiple-ciphers'
import * as argon2 from 'argon2'
import { runMigrations } from './schema'

const ARGON2_OPTS = {
  type: argon2.argon2id,
  hashLength: 32,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
} as const

const deriveKey = async (masterKey: string, salt: Buffer): Promise<string> => {
  const raw = await argon2.hash(masterKey, { ...ARGON2_OPTS, salt, raw: true })
  return raw.toString('hex')
}

export const openDatabaseFile = async (
  masterKey: string,
  filePath: string,
  metaPath: string
): Promise<Database.Database> => {
  if (!masterKey) throw new Error('Master key is required')
  const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as { salt: string }
  const hexKey = await deriveKey(masterKey, Buffer.from(meta.salt, 'hex'))
  const conn = new Database(filePath)
  conn.pragma(`key="x'${hexKey}'"`)
  conn.pragma('foreign_keys = ON')
  conn.prepare('SELECT count(*) FROM sqlite_master').get()
  runMigrations(conn)
  return conn
}
