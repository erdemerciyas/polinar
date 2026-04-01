import fs from 'fs'
import path from 'path'

const mapPath = path.resolve('scripts/cloudinary-static-map.json')
const mapping: Record<string, string> = JSON.parse(fs.readFileSync(mapPath, 'utf-8'))

const filesToProcess = [
  'src/data/injection-moulds/en.ts',
  'src/data/injection-moulds/tr.ts',
  'src/data/injection-moulds/ar.ts',
  'src/data/injection-moulds/de.ts',
  'src/data/plastic-test-equipment/en.ts',
  'src/data/plastic-test-equipment/tr.ts',
  'src/data/plastic-test-equipment/ar.ts',
  'src/data/plastic-test-equipment/de.ts',
  'src/data/machinery/tr.ts',
  'src/data/machinery/en.ts',
  'src/data/machinery/ar.ts',
  'src/data/machinery/de.ts',
  'src/app/(frontend)/[locale]/page.tsx',
  'src/app/(frontend)/[locale]/our-business/page.tsx',
  'src/components/InjectionMouldsPage.tsx',
  'src/components/MachineryPage.tsx',
  'src/components/PlasticTestEquipmentPage.tsx',
  'src/components/layout/MegaMenu.tsx',
]

let totalReplacements = 0

for (const relFile of filesToProcess) {
  const absPath = path.resolve(relFile)
  if (!fs.existsSync(absPath)) {
    console.log(`  SKIP (not found): ${relFile}`)
    continue
  }

  let content = fs.readFileSync(absPath, 'utf-8')
  let fileReplacements = 0

  for (const [localPath, cloudinaryUrl] of Object.entries(mapping)) {
    const escaped = localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, cloudinaryUrl)
      fileReplacements += matches.length
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(absPath, content, 'utf-8')
    totalReplacements += fileReplacements
    console.log(`  ${relFile}: ${fileReplacements} replacements`)
  } else {
    console.log(`  ${relFile}: no matches`)
  }
}

console.log(`\nTotal: ${totalReplacements} URLs replaced.`)
