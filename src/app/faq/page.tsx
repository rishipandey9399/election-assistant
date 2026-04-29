import { HelpCircle } from 'lucide-react';

import styles from './faq.module.css';

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I know if I'm registered to vote?",
      a: "You can check your registration status through our AI Assistant or by visiting your state's official Secretary of State website. We provide direct links to these portals in our Timeline section.",
    },
    {
      q: 'Is the polling place information accurate?',
      a: 'Yes, we use the Google Civic Information API which pulls official data directly from government election offices. However, we always recommend verifying with your local office for last-minute changes.',
    },
    {
      q: 'What should I bring with me on Election Day?',
      a: 'Requirements vary by state. Some states require a photo ID, while others do not. Our AI Assistant can provide specific details for your state.',
    },
    {
      q: 'Can I vote by mail?',
      a: 'Most states allow some form of mail-in or absentee voting. Deadlines for requesting these ballots are tracked in our Timeline feature.',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.iconCircle}>
            <HelpCircle size={32} />
          </div>
          <h1 className="text-gradient">Frequently Asked Questions</h1>
          <p>Everything you need to know about using VoteAssist and the voting process.</p>
        </header>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <details key={index} className={`${styles.faqItem} glass-panel`}>
              <summary className={styles.question}>{faq.q}</summary>
              <div className={styles.answer}>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
