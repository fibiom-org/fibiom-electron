import { ipcMain } from 'electron'
import { addDocument, deleteDocument, listDocuments } from './documents'

export const registerDocumentHandlers = (): void => {
  ipcMain.handle('documents:list', (_event, projectId?: number) => listDocuments(projectId))

  ipcMain.handle('documents:add', (_event, filename: string, text: string, projectId?: number) =>
    addDocument(filename, text, projectId)
  )

  ipcMain.handle('documents:delete', (_event, documentId: number, projectId?: number) =>
    deleteDocument(documentId, projectId)
  )
}
