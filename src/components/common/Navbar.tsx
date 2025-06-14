'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../app/auth/context';

const navLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
    badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>
    ),
    mobileBadge: (
      <span className="ml-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>
    ),
  },
  {
    href: '/reports',
    label: 'Raporlar',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
       badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>
  ),},
  {
    href: '/guidelist',
    label: 'Rehberler',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
   badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>
      ),},
  {
    href: '/SanalHat',
    label: 'SanalHat',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
       badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ), },
    {
    href: '/battery-test',
    label: 'Simülasyon',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
       badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ), },
      {
    href: '/anomal',
    label: 'Cycle',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
       badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ), },
  {
    href: '/Depo',
    label: 'Depo',
   className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
       badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ), },
  {
    href: '/technology-news',
    label: 'Haberler',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
        badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ),},
  {
    href: '/squad',
    label: 'Ekip',
className:
      'group relative px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg transition-all',
        badge: (
      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
        NEW
      </span>

  ),},
];

function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Trap focus in mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();
  }, [menuOpen]);

  return (
    <nav className="bg-gradient-to-r from-gray-950 via-gray-900 to-blue-950 shadow-2xl sticky top-0 z-50 font-sans backdrop-blur-lg border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 shadow-xl border-2 border-blue-400">
            <svg
              className="w-8 h-8 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0a2 2 0 01-2-2V7m6 11v-6m0 0l2 2m-2-2l-2 2" />
            </svg>
          </span>
          <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-300 via-blue-400 to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
            R&D
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5">
          {navLinks.map(({ href, label, className, badge }) => (
            <Link
              key={href}
              href={href}
              className={classNames(
                className,
                'relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300',
                'hover:scale-105',
                'after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:w-0 after:h-1 after:bg-white/70 after:rounded-full group-hover:after:w-3/4 group-hover:after:transition-all group-hover:after:duration-300'
              )}
              tabIndex={0}
            >
              {label}
              {badge}
            </Link>
          ))}
          {user ? (
            <>
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-medium shadow-inner">
                Hoşgeldin, <span className="font-bold">{user.name}</span>{' '}
                <span className="text-blue-400">({user.role})</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-gray-800 hover:from-red-700 hover:to-gray-900 text-white font-semibold shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Çıkış Yap"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/auth/Login"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 via-lime-500 to-green-700 hover:from-green-500 hover:to-lime-600 shadow-xl hover:scale-110 transition-all focus:outline-none focus:ring-4 focus:ring-lime-400/60 border-2 border-white/10"
              tabIndex={0}
              aria-label="Giriş"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="#bbf7d0"
                  className="transition-colors"
                />
                <path
                  d="M12 7v5"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 10a4 4 0 1 0 5 0"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden bg-gradient-to-r from-gray-950 via-gray-900 to-blue-950 px-4 pb-4 space-y-2 animate-fade-in rounded-b-2xl shadow-2xl border-t border-blue-900/30"
        >
          {navLinks.map(({ href, label, className, mobileBadge }) => (
            <Link
              key={href}
              href={href}
              className={classNames(
                'block w-full text-left',
                className.replace('px-4', 'block px-4'),
                'focus:outline-none focus:ring-2 focus:ring-blue-300'
              )}
              tabIndex={0}
              onClick={() => setMenuOpen(false)}
            >
              {label}
              {mobileBadge}
            </Link>
          ))}
          {user ? (
            <>
              <span className="block px-3 py-1 rounded-xl bg-white/10 text-white font-medium shadow-inner">
                Hoşgeldin, <span className="font-bold">{user.name}</span>{' '}
                <span className="text-blue-400">({user.role})</span>
              </span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-gray-800 hover:from-red-700 hover:to-gray-900 text-white font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Çıkış Yap"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/auth/Login"
              className="block px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
              tabIndex={0}
              onClick={() => setMenuOpen(false)}
            >
              Giriş
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
