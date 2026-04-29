'use client';

import { Calendar, CheckCircle2, Clock, Bell, BellOff } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '@/context/AuthContext';
import { getUserProfile, trackEvent, untrackEvent, UserTimeline } from '@/lib/firestore';

import styles from './page.module.css';

export default function TimelinePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserTimeline | null>(null);

  // Dynamic data state
  const [events, setEvents] = useState<
    Array<{
      id: string;
      title: string;
      date: string;
      description: string;
      status: 'past' | 'upcoming' | 'action-needed';
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  const fetchElections = useCallback(async () => {
    try {
      const res = await fetch('/api/elections');
      if (!res.ok) throw new Error('Failed to fetch elections');
      const data = await res.json();

      const today = new Date();
      // Map API data to our timeline format
      const mappedEvents = data.elections.map(
        (election: { id: string; name: string; electionDay: string; ocdDivisionId: string }) => {
          const eventDate = new Date(election.electionDay);
          // Basic status logic based on date
          let status: 'past' | 'upcoming' | 'action-needed' = 'upcoming';
          const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

          if (eventDate < today) status = 'past';
          else if (diffDays <= 14) status = 'action-needed';

          return {
            id: election.id,
            title: election.name,
            date: eventDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            description: `Division: ${election.ocdDivisionId.split('/').pop()?.toUpperCase() || 'General'}`,
            status,
          };
        }
      );

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching elections:', error);
      // Fallback data if API fails
      setEvents([
        {
          id: 'fallback',
          title: 'General Election Day',
          date: 'November 5, 2024',
          description: 'Polling places are open from 7:00 AM to 8:00 PM.',
          status: 'upcoming',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchElections();
      await fetchProfile();
    };
    loadData();
  }, [fetchProfile, fetchElections]);

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
          {isLoading ? (
            <div className={styles.timelineItem} style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading timeline events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className={styles.timelineItem} style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No upcoming events found.</p>
            </div>
          ) : (
            events.map((event, index) => {
              const isTracked = userProfile?.trackedEvents?.includes(event.id);

              return (
                <div key={event.id} className={styles.timelineItem}>
                  <div className={styles.timelineConnector}>
                    <div className={`${styles.timelineDot} ${styles[event.status]}`}>
                      {event.status === 'past' && <CheckCircle2 size={16} aria-hidden="true" />}
                      {event.status === 'upcoming' && <Calendar size={16} aria-hidden="true" />}
                      {event.status === 'action-needed' && <Clock size={16} aria-hidden="true" />}
                    </div>
                    {index !== events.length - 1 && <div className={styles.timelineLine} />}
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
                            aria-label={
                              isTracked ? `Untrack ${event.title}` : `Track ${event.title}`
                            }
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
