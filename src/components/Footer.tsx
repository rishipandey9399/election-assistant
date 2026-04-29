import { Code, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className="text-gradient">VoteAssist</span>
          </div>
          <p className={styles.tagline}>
            Demystifying the election process with clear timelines, localized info, and AI-powered
            assistance.
          </p>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkGroup}>
            <h2>Resources</h2>
            <Link href="/about">About Us</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>

          <div className={styles.linkGroup}>
            <h2>Connect</h2>
            <div className={styles.social}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <MessageCircle size={20} aria-hidden="true" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Github">
                <Code size={20} aria-hidden="true" />
              </a>
              <a href="mailto:hello@voteassist.com" aria-label="Email">
                <Mail size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} VoteAssist. Built with Google Services.</p>
        </div>
      </div>
    </footer>
  );
}
