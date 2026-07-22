import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import Navbar from '@/components/shared/Navbar'


const inter = Inter({ subsets: ['latin'],  display: 'swap', })

export const metadata: Metadata = {
  title: {
    default :'EliteCommerce',
    template:'%s | EliteCommerce',
  },
  description: 'Modern e-commerce platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider> 
          <Navbar/>
         <main> {children}</main> 
        </QueryProvider>
        
        </body>
    </html>
  )
}

