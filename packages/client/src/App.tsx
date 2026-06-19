import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotionRepositoryProvider } from './presentation/providers/notion.provider'
import { HomePage } from './presentation/pages/HomePage'
import { DatabasePage } from './presentation/pages/DatabasePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotionRepositoryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/databases/:id" element={<DatabasePage />} />
          </Routes>
        </BrowserRouter>
      </NotionRepositoryProvider>
    </QueryClientProvider>
  )
}
