import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AntdProvider from '@/providers/AntdProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Next.js Boilerplate',
  description:
    'A comprehensive Next.js boilerplate with React Query, Ant Design, and Axios'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <AntdProvider>{children}</AntdProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
