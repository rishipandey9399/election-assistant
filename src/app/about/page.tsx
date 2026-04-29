import { Info, Target, ShieldCheck, Sparkles } from 'lucide-react';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.badge}>
            <Info size={16} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-gradient">About VoteAssist</h1>
          <p className={styles.lead}>
            Empowering every voter with the information they need to participate in democracy with
            confidence.
          </p>
        </header>

        <div className={styles.contentGrid}>
          <section className={`${styles.card} glass-panel`}>
            <div className={styles.iconWrapper}>
              <Target size={24} />
            </div>
            <h2>Why We Exist</h2>
            <p>
              The election process can be complex and overwhelming. Deadlines vary by state, polling
              places change, and misinformation is rampant. VoteAssist was built to simplify this
              journey, providing a single, verified source of truth for your voting needs.
            </p>
          </section>

          <section className={`${styles.card} glass-panel`}>
            <div className={styles.iconWrapper}>
              <ShieldCheck size={24} />
            </div>
            <h2>Verified Data</h2>
            <p>
              We don&apos;t make up our own data. We pull directly from the Google Civic Information
              API, which aggregates official election data from government sources. When you see a
              polling place on our map, it&apos;s coming from an official election office.
            </p>
          </section>

          <section className={`${styles.card} glass-panel`}>
            <div className={styles.iconWrapper}>
              <Sparkles size={24} />
            </div>
            <h2>AI Assistance</h2>
            <p>
              Our AI Assistant uses Google&apos;s Gemini Pro model to help explain complex voting
              laws in plain language. Whether you&apos;re curious about voter ID requirements or
              absentee ballot procedures, we&apos;re here to help 24/7.
            </p>
          </section>
        </div>

        <section className={`${styles.contactSection} glass-panel`}>
          <h2>Join Our Mission</h2>
          <p>
            VoteAssist is an open-source initiative dedicated to increasing civic engagement. We
            believe that a better-informed electorate leads to a stronger democracy.
          </p>
        </section>
      </div>
    </div>
  );
}
