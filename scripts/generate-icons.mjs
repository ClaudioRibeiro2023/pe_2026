import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const buildDir = join(rootDir, 'build');

// Criar diretório build se não existir
if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true });
}

// SVG do logo Estratégico Aero
const logoSvg = `<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0052A3"/>
      <stop offset="100%" stop-color="#0066CC"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="url(#logoGradient)"/>
  <path d="M50 180 L100 130 L150 90" stroke="white" stroke-width="16" stroke-linecap="round" fill="none"/>
  <g transform="translate(135, 60) rotate(-35)">
    <path d="M0 32 L80 32 L100 20 L80 8 L0 8 Z" fill="white"/>
    <path d="M20 8 L32 -14 L44 8" fill="white"/>
    <path d="M56 32 L72 52 L88 32" fill="white"/>
  </g>
</svg>`;

async function generateIcons() {
  console.log('🎨 Gerando ícones do Estratégico Aero...\n');

  try {
    // Gerar PNG 256x256
    const pngBuffer = await sharp(Buffer.from(logoSvg))
      .resize(256, 256)
      .png()
      .toBuffer();
    
    const pngPath = join(buildDir, 'icon.png');
    writeFileSync(pngPath, pngBuffer);
    console.log('✓ icon.png (256x256) criado');

    // Gerar múltiplos tamanhos para ICO
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = await Promise.all(
      sizes.map(size => 
        sharp(Buffer.from(logoSvg))
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    // Converter para ICO
    const icoBuffer = await pngToIco(pngBuffers);
    const icoPath = join(buildDir, 'icon.ico');
    writeFileSync(icoPath, icoBuffer);
    console.log('✓ icon.ico (multi-size) criado');

    console.log('\n✅ Ícones gerados com sucesso em:', buildDir);
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();
