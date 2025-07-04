import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

async function buildLibrary() {
  try {
    console.log('Building library...')
    
    // Build the library
    await build({
      configFile: resolve(__dirname, '../vite.config.ts')
    })
    
    // Copy type definitions
    const typeDefs = fs.readFileSync(
      resolve(__dirname, '../src/vue3-jag-location-picker.d.ts'),
      'utf8'
    )
    
    fs.writeFileSync(
      resolve(__dirname, '../dist/index.d.ts'),
      typeDefs
    )
    
    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildLibrary() 