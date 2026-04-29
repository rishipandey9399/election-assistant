import { Shield } from 'lucide-react';

import styles from './privacy.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={`${styles.contentWrapper} glass-panel`}>
          <header className={styles.header}>
            <Shield size={48} className={styles.icon} />
            <h1 className="text-gradient">Privacy Policy</h1>
            <p>Last updated: April 24, 2024</p>
          </header>

          <section className={styles.section}>
            <h2>Our Commitment</h2>
            <p>
              Your privacy is fundamental to our mission. VoteAssist is built on the principle of
              minimal data collection. We do not sell your personal information, and we only use it
              to provide you with the services you request.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Data Collection</h2>
            <p>
              When you use our Polling Place locator, we process your address to fetch official
              election data. This information is cached temporarily to improve performance but is
              not permanently stored with your personal identity.
            </p>
          </section>

          <section className={styles.section}>
            <h2>AI Assistant</h2>
            <p>
              Interactions with our AI Assistant are logged for analytical purposes to improve the
              quality of responses. These logs are stored securely in Google BigQuery and do not
              contain personally identifiable information unless provided by the user in the chat.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Third-Party Services</h2>
            <p>
              We use Google Services (Maps, Civic Info, Gemini, BigQuery) to provide our platform.
              These services may collect data according to Google&apos;s Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
