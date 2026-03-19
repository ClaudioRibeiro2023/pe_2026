/**
 * XLSX Generator - Zero Dependencies
 * Uses only Node.js built-in modules (fs, zlib, stream)
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const csvPath = path.join(__dirname, 'RH_PLAN_ACTIONS_2026_v1.csv');
const xlsxPath = path.join(__dirname, 'RH_PLAN_ACTIONS_2026_v1.xlsx');

// Read CSV
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(';');
const rows = lines.slice(1).map(line => line.split(';'));

// Dictionaries data
const dictionaries = {
  program_key: ['conecta', 'desenvolve', 'reconhece', 'inova'],
  objective_key: ['O1', 'O2', 'O3', 'O4', 'O5'],
  type: ['ROTINA', 'IMPLANTACAO', 'PROJETO'],
  priority: ['P0', 'P1', 'P2'],
  weight: ['PESADA', 'LEVE'],
  status: ['PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA', 'AGUARDANDO_EVIDENCIA', 'EM_VALIDACAO', 'CONCLUIDA', 'CANCELADA']
};

// Helper to escape XML
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Column letter helper (A, B, ..., Z, AA, AB, ...)
function colLetter(idx) {
  let s = '';
  idx++;
  while (idx > 0) {
    idx--;
    s = String.fromCharCode(65 + (idx % 26)) + s;
    idx = Math.floor(idx / 26);
  }
  return s;
}

// Generate sheet XML for PlanActions
function generatePlanActionsSheet() {
  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  xml += '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n';
  xml += '<sheetData>\n';
  
  // Header row
  xml += '<row r="1">\n';
  headers.forEach((h, i) => {
    xml += `<c r="${colLetter(i)}1" t="inlineStr"><is><t>${escapeXml(h)}</t></is></c>\n`;
  });
  xml += '</row>\n';
  
  // Data rows
  rows.forEach((row, rowIdx) => {
    xml += `<row r="${rowIdx + 2}">\n`;
    row.forEach((cell, colIdx) => {
      xml += `<c r="${colLetter(colIdx)}${rowIdx + 2}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>\n`;
    });
    xml += '</row>\n';
  });
  
  xml += '</sheetData>\n';
  xml += '</worksheet>';
  return xml;
}

// Generate sheet XML for Dictionaries
function generateDictionariesSheet() {
  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  xml += '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n';
  xml += '<sheetData>\n';
  
  const keys = Object.keys(dictionaries);
  const maxRows = Math.max(...keys.map(k => dictionaries[k].length));
  
  // Header row
  xml += '<row r="1">\n';
  keys.forEach((k, i) => {
    xml += `<c r="${colLetter(i)}1" t="inlineStr"><is><t>${escapeXml(k)}</t></is></c>\n`;
  });
  xml += '</row>\n';
  
  // Data rows
  for (let r = 0; r < maxRows; r++) {
    xml += `<row r="${r + 2}">\n`;
    keys.forEach((k, i) => {
      const val = dictionaries[k][r] || '';
      if (val) {
        xml += `<c r="${colLetter(i)}${r + 2}" t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>\n`;
      }
    });
    xml += '</row>\n';
  }
  
  xml += '</sheetData>\n';
  xml += '</worksheet>';
  return xml;
}

// ============================================================
// Simple ZIP creator (no external dependencies)
// ============================================================
function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createZip(files) {
  const entries = [];
  let offset = 0;
  
  // Local file headers + data
  const localParts = [];
  for (const [name, content] of Object.entries(files)) {
    const nameBuf = Buffer.from(name, 'utf-8');
    const dataBuf = Buffer.from(content, 'utf-8');
    const compressed = zlib.deflateRawSync(dataBuf);
    const crc = crc32(dataBuf);
    
    // Local file header
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0); // signature
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(8, 8); // compression (deflate)
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0, 12); // mod date
    local.writeUInt32LE(crc, 14); // crc32
    local.writeUInt32LE(compressed.length, 18); // compressed size
    local.writeUInt32LE(dataBuf.length, 22); // uncompressed size
    local.writeUInt16LE(nameBuf.length, 26); // filename length
    local.writeUInt16LE(0, 28); // extra field length
    nameBuf.copy(local, 30);
    
    entries.push({
      name: nameBuf,
      crc,
      compressedSize: compressed.length,
      uncompressedSize: dataBuf.length,
      offset
    });
    
    localParts.push(local, compressed);
    offset += local.length + compressed.length;
  }
  
  // Central directory
  const cdParts = [];
  for (const e of entries) {
    const cd = Buffer.alloc(46 + e.name.length);
    cd.writeUInt32LE(0x02014b50, 0); // signature
    cd.writeUInt16LE(20, 4); // version made by
    cd.writeUInt16LE(20, 6); // version needed
    cd.writeUInt16LE(0, 8); // flags
    cd.writeUInt16LE(8, 10); // compression
    cd.writeUInt16LE(0, 12); // mod time
    cd.writeUInt16LE(0, 14); // mod date
    cd.writeUInt32LE(e.crc, 16);
    cd.writeUInt32LE(e.compressedSize, 20);
    cd.writeUInt32LE(e.uncompressedSize, 24);
    cd.writeUInt16LE(e.name.length, 28);
    cd.writeUInt16LE(0, 30); // extra field length
    cd.writeUInt16LE(0, 32); // comment length
    cd.writeUInt16LE(0, 34); // disk number start
    cd.writeUInt16LE(0, 36); // internal attrs
    cd.writeUInt32LE(0, 38); // external attrs
    cd.writeUInt32LE(e.offset, 42);
    e.name.copy(cd, 46);
    cdParts.push(cd);
  }
  
  const cdSize = cdParts.reduce((a, b) => a + b.length, 0);
  
  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with CD
  eocd.writeUInt16LE(entries.length, 8); // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(cdSize, 12); // CD size
  eocd.writeUInt32LE(offset, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // comment length
  
  return Buffer.concat([...localParts, ...cdParts, eocd]);
}

// ============================================================
// Generate XLSX
// ============================================================
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>`;

const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
<sheet name="PlanActions" sheetId="1" r:id="rId1"/>
<sheet name="Dictionaries" sheetId="2" r:id="rId2"/>
</sheets>
</workbook>`;

const files = {
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rels,
  'xl/_rels/workbook.xml.rels': workbookRels,
  'xl/workbook.xml': workbook,
  'xl/worksheets/sheet1.xml': generatePlanActionsSheet(),
  'xl/worksheets/sheet2.xml': generateDictionariesSheet()
};

const zipBuffer = createZip(files);
fs.writeFileSync(xlsxPath, zipBuffer);

// Get file sizes
const csvStats = fs.statSync(csvPath);
const xlsxStats = fs.statSync(xlsxPath);

console.log('');
console.log('='.repeat(50));
console.log('RH_SEED_FILES_DONE');
console.log('='.repeat(50));
console.log('');
console.log('Arquivos criados:');
console.log('  - specs/seed/RH_PLAN_ACTIONS_2026_v1.csv');
console.log('  - specs/seed/RH_PLAN_ACTIONS_2026_v1.xlsx');
console.log('');
console.log('Tamanhos:');
console.log(`  CSV:  ${csvStats.size.toLocaleString()} bytes`);
console.log(`  XLSX: ${xlsxStats.size.toLocaleString()} bytes`);
console.log('');
console.log('Sheets no XLSX:');
console.log('  1. PlanActions (42 ações + header)');
console.log('  2. Dictionaries (enums: program_key, objective_key, type, priority, weight, status)');
console.log('');
console.log('='.repeat(50));
