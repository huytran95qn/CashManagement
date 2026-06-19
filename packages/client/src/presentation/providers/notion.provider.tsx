import { createContext, useContext, type ReactNode } from 'react'
import type { INotionRepository } from '../../domain/notion/repositories/notion.repository.interface'
import { NotionHttpRepository } from '../../infrastructure/notion/repositories/notion-http.repository'

const NotionRepositoryContext = createContext<INotionRepository | null>(null)

const defaultRepository = new NotionHttpRepository()

export function NotionRepositoryProvider({ children }: { children: ReactNode }) {
  return (
    <NotionRepositoryContext.Provider value={defaultRepository}>
      {children}
    </NotionRepositoryContext.Provider>
  )
}

export function useNotionRepository(): INotionRepository {
  const repo = useContext(NotionRepositoryContext)
  if (!repo) throw new Error('useNotionRepository must be used within NotionRepositoryProvider')
  return repo
}
