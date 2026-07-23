'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/store'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/featured', label: 'Featured' },
]

export default function Navbar() {
  const pathname = usePathname()
  const cart = useStore((state) => state.cart)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const toggleCart = useStore((state) => state.toggleCart)

  // Hide navbar on auth pages
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-slate-900">
          Elite<span className="text-brand-600">Commerce</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? 'text-brand-600 font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Cart button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCart}
          className="relative"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>

      </div>
    </header>
  )
}