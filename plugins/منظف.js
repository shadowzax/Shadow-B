import fs from 'fs'
import path from 'path'

const SESSIONS_DIR = path.resolve('./jadibts')
const INTERVAL_MS = 30 * 1000

function cleanOnce() {
  if (!fs.existsSync(SESSIONS_DIR)) return
  const sessions = fs.readdirSync(SESSIONS_DIR)

  for (const session of sessions) {
    const sessionPath = path.join(SESSIONS_DIR, session)
    if (!fs.statSync(sessionPath).isDirectory()) continue

    const files = fs.readdirSync(sessionPath)
    const hasCreds = files.includes('creds.json')

    if (!hasCreds) {
      try {
        fs.rmSync(sessionPath, { recursive: true, force: true })
        console.log(`[clean-sessions] removed entire folder: ${sessionPath}`)
      } catch (err) {
        console.error(`[clean-sessions] failed to remove folder ${sessionPath}:`, err.message)
      }
      continue
    }

    for (const file of files) {
      const filePath = path.join(sessionPath, file)
      if (file === 'creds.json') continue
      try {
        fs.rmSync(filePath, { recursive: true, force: true })
        console.log(`[clean-sessions] removed: ${filePath}`)
      } catch (err) {
        console.error(`[clean-sessions] failed to remove ${filePath}:`, err.message)
      }
    }
  }
}

console.log(`[clean-sessions] monitoring "${SESSIONS_DIR}" every ${INTERVAL_MS / 1000}s`)
cleanOnce()
setInterval(cleanOnce, INTERVAL_MS)
