import fs from 'fs'
import archiver from 'archiver'

const output = fs.createWriteStream('./cardiomax-release.zip')
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => console.log('zip created:', archive.pointer(), 'bytes'))
archive.pipe(output)
archive.glob('**/*', { ignore: ['node_modules/**', '.next/**', 'cardiomax-release.zip'] })
archive.finalize()
