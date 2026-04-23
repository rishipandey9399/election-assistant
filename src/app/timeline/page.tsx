'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, Clock, Bell, BellOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, trackEvent, untrackEvent, UserTimeline } from '@/lib/firestore';
import styles from './page.module.css';

export default function TimelinePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserTimeline | null>(null);

  // Mock data for the timeline
  const events = [
    {
      id: 'reg-deadline',
      title: 'Voter Registration Deadline',
      date: 'October 7, 2024',
      description:
        'Last day to register to vote in the upcoming general election. You can register online, by mail, or in person.',
      status: 'past',
    },
    {
      id: 'mail-request',
      title: 'Mail-in Ballot Request Deadline',
      date: 'October 25, 2024',
      description:
        'Final day to request a mail-in ballot. It is recommended to request it as early as possible.',
      status: 'action-needed',
    },
    {
      id: 'early-voting',
      title: 'Early Voting Begins',
      date: 'October 28, 2024',
      description: 'Early voting locations open across the state. Beat the lines and vote early!',
      status: 'upcoming',
    },
    {
      id: 'election-day',
      title: 'Election Day',
      date: 'November 5, 2024',
      description: 'General Election Day. Polling places are open from 7:00 AM to 8:00 PM.',
      status: 'upcoming',
    },
  ];

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
    };
    loadData();
  }, [fetchProfile]);

  const handleToggleTrack = async (eventId: string) => {
    if (!user) return;

    const isTracked = userProfile?.trackedEvents?.includes(eventId);

    try {
      if (isTracked) {
        await untrackEvent(user.uid, eventId);
      } else {
        await trackEvent(user.uid, eventId);
      }
      // Refresh local state
      fetchProfile();
    } catch (error) {
      console.error('Error toggling track status:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="text-gradient">Your Election Timeline</h1>
          <p>Key dates and deadlines to ensure your vote is counted.</p>
        </div>

        <div className={styles.timelineWrapper}>
          {events.map((event, index) => {
            const isTracked = userProfile?.trackedEvents?.includes(event.id);

            return (
              <div key={event.id} className={styles.timelineItem}>
                <div className={styles.timelineConnector}>
                  <div className={`${styles.timelineDot} ${styles[event.status]}`}>
                    {event.status === 'past' && <CheckCircle2 size={16} aria-hidden="true" />}
                    {event.status === 'upcoming' && <Calendar size={16} aria-hidden="true" />}
                    {event.status === 'action-needed' && <Clock size={16} aria-hidden="true" />}
                  </div>
                  {index !== events.length - 1 && <div className={styles.timelineLine}></div>}
                </div>

                <div className={`${styles.timelineContent} glass-panel`}>
                  <div className={styles.eventHeader}>
                    <div className={styles.badgeGroup}>
                      <span className={`${styles.badge} ${styles[`badge-${event.status}`]}`}>
                        {event.status === 'action-needed'
                          ? 'Action Needed'
                          : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      {user && (
                        <button
                          className={`${styles.trackBtn} ${isTracked ? styles.tracked : ''}`}
                          onClick={() => handleToggleTrack(event.id)}
                          aria-label={isTracked ? `Untrack ${event.title}` : `Track ${event.title}`}
                        >
                          {isTracked ? <BellOff size={14} /> : <Bell size={14} />}
                          <span>{isTracked ? 'Tracked' : 'Track'}</span>
                        </button>
                      )}
                    </div>
                    <span className={styles.eventDate}>{event.date}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>

                  {event.status === 'action-needed' && (
                    <button className={styles.actionBtn}>Take Action Now</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
