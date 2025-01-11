'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Users, History, User } from 'lucide-react'

const navItems = [
  { href: '/d', icon: Home, label: 'Accueil' },
  { href: '/d/plans', icon: TrendingUp, label: 'Plan' },
  { href: '/d/referral', icon: Users, label: 'Equipe' },
  { href: '/d/history', icon: History, label: 'Transaction' },
  { href: '/d/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex flex-col items-center p-2 transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600 transform scale-110' 
                    : 'text-gray-600 hover:text-blue-400'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'stroke-current' : ''}`} />
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

