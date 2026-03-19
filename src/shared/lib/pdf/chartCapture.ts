/**
 * PDF Chart Capture Pipeline
 * Captures Chart.js canvases or HTML elements as PNG data URLs for PDF embedding
 */

export interface ChartCaptureResult {
  imageDataUrl: string | null
  error: string | null
}

/**
 * Capture a Chart.js canvas element as PNG data URL
 */
export function captureChartCanvas(canvas: HTMLCanvasElement | null): ChartCaptureResult {
  if (!canvas) {
    return { imageDataUrl: null, error: 'Canvas element not found' }
  }
  try {
    const dataUrl = canvas.toDataURL('image/png', 0.92)
    if (!dataUrl || dataUrl === 'data:,') {
      return { imageDataUrl: null, error: 'Canvas produced empty image' }
    }
    return { imageDataUrl: dataUrl, error: null }
  } catch (e) {
    return { imageDataUrl: null, error: e instanceof Error ? e.message : 'Canvas capture failed' }
  }
}

/**
 * Capture an HTML element via html2canvas as fallback
 */
export async function captureElementAsImage(element: HTMLElement | null): Promise<ChartCaptureResult> {
  if (!element) {
    return { imageDataUrl: null, error: 'Element not found' }
  }
  try {
    const html2canvasModule = await import('html2canvas')
    const html2canvas = html2canvasModule.default
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    })
    const dataUrl = canvas.toDataURL('image/png', 0.85)
    return { imageDataUrl: dataUrl, error: null }
  } catch (e) {
    return { imageDataUrl: null, error: e instanceof Error ? e.message : 'html2canvas capture failed' }
  }
}

/**
 * Try Chart.js canvas first, fallback to html2canvas on container
 */
export async function captureChart(
  canvasOrElement: HTMLCanvasElement | HTMLElement | null
): Promise<ChartCaptureResult> {
  if (!canvasOrElement) {
    return { imageDataUrl: null, error: 'No element provided' }
  }

  // If it's a canvas, try direct capture
  if (canvasOrElement instanceof HTMLCanvasElement) {
    const result = captureChartCanvas(canvasOrElement)
    if (result.imageDataUrl) return result
  }

  // Fallback: try to find a canvas child
  const childCanvas = canvasOrElement.querySelector('canvas')
  if (childCanvas) {
    const result = captureChartCanvas(childCanvas)
    if (result.imageDataUrl) return result
  }

  // Final fallback: html2canvas on the whole element
  return captureElementAsImage(canvasOrElement)
}

/**
 * Find chart containers by data attribute or ID pattern
 */
export function findChartElements(containerSelector: string = '[data-pdf-chart]'): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(containerSelector))
}

/**
 * Capture all charts in a page/component for PDF embedding
 */
export async function captureAllCharts(
  containerSelector: string = '[data-pdf-chart]'
): Promise<Array<{ id: string; title: string; result: ChartCaptureResult }>> {
  const elements = findChartElements(containerSelector)
  const results: Array<{ id: string; title: string; result: ChartCaptureResult }> = []

  for (const el of elements) {
    const id = el.getAttribute('data-pdf-chart') || el.id || 'unknown'
    const title = el.getAttribute('data-pdf-chart-title') || id
    const result = await captureChart(el)
    results.push({ id, title, result })
  }

  return results
}
