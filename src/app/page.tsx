import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.glowBlob1}></div>
          <div className={styles.glowBlob2}></div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Sparkles size={16} className={styles.badgeIcon} />
              <span>AI-Powered Election Assistant</span>
            </div>

            <h1 className={styles.title}>
              Navigate Your <span className="text-gradient">Voting Journey</span> With Confidence
            </h1>

            <p className={styles.subtitle}>
              Your personalized guide to the election process. Get custom timelines, find your
              polling place, and ask our AI any questions you have about voting.
            </p>

            <div className={styles.ctaGroup}>
              <Link href="/timeline" className={styles.primaryBtn}>
                Start Your Timeline
                <ArrowRight size={18} />
              </Link>
              <Link href="/polling-place" className={styles.secondaryBtn}>
                Find Polling Place
              </Link>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <Image
              src="/hero.png"
              alt="3D Illustration of a glass ballot box with glowing Vote button"
              width={600}
              height={600}
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>
              Everything you need to be <span className="text-gradient">election-ready</span>
            </h2>
            <p>We simplify the complex voting process into manageable, interactive steps.</p>
          </div>

          <div className={styles.featureGrid}>
            <div className={`${styles.featureCard} glass-panel`}>
              <div className={styles.iconWrapper}>
                <Calendar size={24} aria-hidden="true" />
              </div>
              <h3>Personalized Timeline</h3>
              <p>
                Never miss a deadline. We create a custom timeline based on your state&apos;s
                specific registration and voting dates.
              </p>
              <Link
                href="/timeline"
                className={styles.featureLink}
                aria-label="View your personalized timeline"
              >
                View Timeline <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className={`${styles.featureCard} glass-panel`}>
              <div className={styles.iconWrapper}>
                <MapPin size={24} aria-hidden="true" />
              </div>
              <h3>Polling Place Locator</h3>
              <p>
                Powered by Google Maps, find exactly where you need to go to cast your ballot,
                including early voting locations.
              </p>
              <Link
                href="/polling-place"
                className={styles.featureLink}
                aria-label="Find your polling place location"
              >
                Find Location <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className={`${styles.featureCard} glass-panel`}>
              <div className={styles.iconWrapper}>
                <ShieldCheck size={24} aria-hidden="true" />
              </div>
              <h3>Verified Information</h3>
              <p>
                All data is sourced directly from the Google Civic Information API, ensuring you get
                accurate, official details.
              </p>
              <Link
                href="/about"
                className={styles.featureLink}
                aria-label="Learn more about our verified data sources"
              >
                Learn More <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className={styles.aiBanner}>
        <div className="container">
          <div className={`${styles.bannerCard} glass-panel`}>
            <div className={styles.bannerContent}>
              <h2>Have questions about the process?</h2>
              <p>
                Our Gemini-powered AI Assistant is ready to help 24/7 with any questions about voter
                ID laws, absentee ballots, or the election process.
              </p>
              <Link href="/assistant" className={styles.primaryBtn}>
                Chat with AI Assistant
                <Sparkles size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
