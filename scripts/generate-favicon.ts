import fs from 'fs'
import sharp from 'sharp'

const logoPath = 'public/brand_assets/logo.png'

async function main() {
  const meta = await sharp(logoPath).metadata()
  if (!meta.width || !meta.height) throw new Error('Could not read logo dimensions')

  console.log(`Logo: ${meta.width}x${meta.height}`)

  const cropSize = Math.round(meta.height * 0.72)
  const left = Math.round(meta.width * 0.075)
  const top = Math.round((meta.height - cropSize) / 2)
  const bg = { r: 0, g: 0, b: 0, alpha: 1 as const }

  async function makeIcon(outPath: string, size: number) {
    await sharp(logoPath)
      .extract({ left, top, width: cropSize, height: cropSize })
      .flatten({ background: bg })
      .resize(size, size, { fit: 'contain', background: bg })
      .png()
      .toFile(outPath)
    console.log(`Wrote ${outPath}`)
  }

  fs.mkdirSync('src/app', { recursive: true })
  await makeIcon('src/app/icon.png', 512)
  await makeIcon('src/app/apple-icon.png', 180)

  const favicon32 = await sharp(logoPath)
    .extract({ left, top, width: cropSize, height: cropSize })
    .flatten({ background: bg })
    .resize(32, 32, { fit: 'contain', background: bg })
    .png()
    .toBuffer()

  await sharp(favicon32).toFile('src/app/favicon.ico')
  console.log('Wrote src/app/favicon.ico')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
