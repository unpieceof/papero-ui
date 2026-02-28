import type { Metadata } from 'next'
import '@/styles/globals.css'
import dynamic from 'next/dynamic'

const Nav = dynamic(() => import('@/components/nav/Nav'), { ssr: false })

export const metadata: Metadata = {
  title: 'PAPERSTAMP — 논문 리뷰',
  description: '둘이서 읽고, 각자의 도장을 찍는 논문 리뷰 공간',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Sans+KR:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
