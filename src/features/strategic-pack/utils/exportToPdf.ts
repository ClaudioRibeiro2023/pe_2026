/**
 * Export Markdown content to PDF
 * Uses browser's print functionality as a lightweight solution
 * For a more robust solution, consider using libraries like:
 * - jspdf + html2canvas
 * - @react-pdf/renderer
 * - puppeteer (server-side)
 */

export async function exportToPdf(markdown: string, filename: string): Promise<void> {
  // Convert markdown to styled HTML
  const html = markdownToHtml(markdown)
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Não foi possível abrir janela de impressão. Verifique se pop-ups estão permitidos.')
  }

  // Write HTML content with print styles
  printWindow.document.write(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      font-size: 24px;
      color: #111;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 8px;
      margin-top: 0;
    }
    
    h2 {
      font-size: 18px;
      color: #333;
      margin-top: 24px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
    }
    
    h3 {
      font-size: 14px;
      color: #444;
      margin-top: 16px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 11px;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    blockquote {
      margin: 12px 0;
      padding: 8px 16px;
      background-color: #f0f9ff;
      border-left: 4px solid #2563eb;
      font-size: 11px;
    }
    
    code {
      background-color: #f3f4f6;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 11px;
    }
    
    pre {
      background-color: #f3f4f6;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 16px 0;
    }
    
    ul, ol {
      padding-left: 24px;
    }
    
    li {
      margin: 4px 0;
    }
    
    strong {
      font-weight: 600;
    }
    
    .emoji {
      font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
    }
    
    @page {
      margin: 1cm;
    }
  </style>
</head>
<body>
  ${html}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 250);
    };
  </script>
</body>
</html>
  `)
  
  printWindow.document.close()
}

/**
 * Simple markdown to HTML converter
 * For production use, consider using a library like marked or remark
 */
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML entities (except for our own tags)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>')
  html = html.replace(/^\*\*\*$/gm, '<hr>')
  
  // Tables
  html = convertTables(html)
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
  
  // Line breaks and paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<table)/g, '$1')
  html = html.replace(/(<\/table>)<\/p>/g, '$1')
  html = html.replace(/<p>(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
  
  return html
}

function convertTables(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  let inTable = false
  let isHeader = true
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if line is a table row
    if (line.startsWith('|') && line.endsWith('|')) {
      // Check if it's the separator row (|---|---|)
      if (/^\|[\s-:|]+\|$/.test(line)) {
        continue // Skip separator row
      }
      
      if (!inTable) {
        result.push('<table>')
        inTable = true
        isHeader = true
      }
      
      const cells = line
        .slice(1, -1) // Remove leading and trailing |
        .split('|')
        .map(cell => cell.trim())
      
      const tag = isHeader ? 'th' : 'td'
      const row = `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`
      result.push(row)
      
      // After first data row, no longer header
      if (isHeader && i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1])) {
        isHeader = false
      } else if (isHeader) {
        isHeader = false
      }
    } else {
      if (inTable) {
        result.push('</table>')
        inTable = false
      }
      result.push(line)
    }
  }
  
  if (inTable) {
    result.push('</table>')
  }
  
  return result.join('\n')
}
