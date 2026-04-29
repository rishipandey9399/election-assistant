'use client';
import { Home, Calendar, MapPin, MessageSquare, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';

import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Timeline', href: '/timeline', icon: Calendar },
    { name: 'Polling Place', href: '/polling-place', icon: MapPin },
    { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  ];

  const mobileMenuRef = useFocusTrap(isOpen);

  return (
    <nav className={styles.nav} aria-label="Main Navigation">
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="VoteAssist Home">
          <span className="text-gradient">VoteAssist</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList} role="list">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.authActions}>
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.displayName?.split(' ')[0]}</span>
                <button className={styles.logoutBtn} onClick={logout}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={signInWithGoogle}>
                <User size={18} aria-hidden="true" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef as React.RefObject<HTMLDivElement>}
        className={styles.mobileNav}
        style={{ display: isOpen ? 'flex' : 'none' }}
        aria-hidden={!isOpen}
      >
        <ul className={styles.mobileNavList} role="list">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {user ? (
          <div className={styles.mobileUserActions}>
            <span>Signed in as {user.displayName}</span>
            <button
              className={styles.mobileLogoutBtn}
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className={styles.mobileLoginBtn}
            onClick={() => {
              signInWithGoogle();
              setIsOpen(false);
            }}
          >
            <User size={20} aria-hidden="true" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
