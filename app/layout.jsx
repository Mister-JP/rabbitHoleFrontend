'use client';
import './globals.css'
import Header from "./components/Header"
import { Analytics } from '@vercel/analytics/react';

// export const metadata = {
//   title: 'RabbitHole',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} >
        <Header/>
        <main>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  )
}
