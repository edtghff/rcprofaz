'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navData, contactPhone, contactPhoneRaw } from '@/data/navData'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title)
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center group transition-opacity hover:opacity-80">
            <div className="h-28 w-auto flex items-center">
              <Image
                src="/rcprof-logo.png"
                alt="RC PROF Logo"
                width={560}
                height={280}
                className="h-28 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-0">
            {navData.map((item) => (
              <div key={item.title} className="relative group">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      className="nav-link flex items-center justify-center space-x-1"
                      onMouseEnter={() => setActiveDropdown(item.title)}
                    >
                      <span>{item.title}</span>
                      <svg
                        className="w-3 h-3 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      {pathname.startsWith(item.href) && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                      )}
                    </button>
                    {activeDropdown === item.title && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-white shadow-lg py-2 z-50 border border-gray-200"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm"
                          >
                            {dropdownItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link ${pathname === item.href ? 'nav-link-active' : ''}`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Contact Button & Phone */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
              href={`tel:${contactPhoneRaw}`}
              className="text-gray-700 hover:text-gray-900 font-medium text-base transition-colors whitespace-nowrap"
            >
              {contactPhone}
            </a>
            <Link href="/elaqe" className="btn-primary text-base px-8 py-3">
              ƏLAQƏ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2">
            <nav className="flex flex-col space-y-1 pt-4">
              {navData.map((item) => (
                <div key={item.title}>
                  {item.dropdown ? (
                    <div>
                      <button
                        className="w-full text-left px-4 py-3 text-gray-700 font-medium text-sm flex items-center justify-between hover:bg-gray-50"
                        onClick={() => toggleDropdown(item.title)}
                      >
                        <span>{item.title}</span>
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            activeDropdown === item.title ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {activeDropdown === item.title && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-colors"
                            >
                              {dropdownItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 text-gray-700 font-medium text-sm transition-colors ${
                        pathname === item.href ? 'text-gray-900 bg-gray-50 border-l-2 border-gray-900' : 'hover:bg-gray-50'
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <a
                  href={`tel:${contactPhoneRaw}`}
                  className="block px-4 py-3 text-gray-700 font-medium text-sm mb-2"
                >
                  {contactPhone}
                </a>
                <Link href="/elaqe" className="block px-4 py-2.5 btn-primary text-center">
                  ƏLAQƏ
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

