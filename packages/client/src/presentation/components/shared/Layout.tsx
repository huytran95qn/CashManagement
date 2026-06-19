import { Link } from 'react-router'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  backTo?: string
  backLabel?: string
}

export function Layout({ children, title, backTo, backLabel }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold text-slate-800">Cash Management</span>
            </Link>
            {backTo && (
              <>
                <span className="text-slate-300">/</span>
                <Link to={backTo} className="text-sm text-slate-500 hover:text-slate-700">
                  {backLabel ?? 'Back'}
                </Link>
              </>
            )}
            {title && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-medium text-slate-700">{title}</span>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
