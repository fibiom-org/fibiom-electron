import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

const RENDER_SCALE = 2

export const isPdf = (file: File): boolean =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

const loadPdf = (data: Uint8Array) => pdfjs.getDocument({ data })

const renderPdfFirstPage = async (file: File): Promise<Blob> => {
  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = loadPdf(data)
  try {
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: RENDER_SCALE })
    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not get a canvas context')

    await page.render({ canvas, canvasContext: context, viewport }).promise

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Could not rasterize the PDF page')
    return blob
  } finally {
    await loadingTask.destroy()
  }
}

export const toImageBlob = async (file: File): Promise<{ blob: Blob; ext: string }> => {
  if (isPdf(file)) {
    return { blob: await renderPdfFirstPage(file), ext: 'png' }
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  return { blob: file, ext }
}

export const extractPdfText = async (file: File): Promise<string> => {
  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = loadPdf(data)
  try {
    const pdf = await loadingTask.promise
    const pages: string[] = []
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const content = await page.getTextContent()
      const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
      pages.push(text)
    }
    return pages
      .join('\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()
  } finally {
    await loadingTask.destroy()
  }
}
