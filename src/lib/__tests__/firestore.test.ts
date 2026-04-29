/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * @jest-environment node
 */

// Mock Firebase before importing firestore helpers
jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn().mockReturnValue({ id: 'mock-ref' }),
  setDoc: jest.fn().mockResolvedValue(undefined),
  getDoc: jest.fn(),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  arrayUnion: jest.fn((v: string) => ({ _type: 'union', value: v })),
  arrayRemove: jest.fn((v: string) => ({ _type: 'remove', value: v })),
}));

import { getDoc } from 'firebase/firestore';

import {
  syncUserProfile,
  getUserProfile,
  trackEvent,
  untrackEvent,
  completeEvent,
  UserTimeline,
} from '../firestore';

const MOCK_PROFILE: UserTimeline = {
  uid: 'user-1',
  trackedEvents: [],
  completedEvents: [],
  state: 'CA',
};

describe('Firestore helpers', () => {
  afterEach(() => jest.clearAllMocks());

  describe('syncUserProfile', () => {
    it('calls setDoc with merged data', async () => {
      const { setDoc } = require('firebase/firestore');
      await syncUserProfile('user-1', { state: 'CA' });
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { uid: 'user-1', state: 'CA' },
        { merge: true }
      );
    });

    it('re-throws if setDoc rejects', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockRejectedValueOnce(new Error('Firestore down'));
      await expect(syncUserProfile('user-1', {})).rejects.toThrow('Firestore down');
    });
  });

  describe('getUserProfile', () => {
    it('returns profile data when document exists', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => MOCK_PROFILE,
      });

      const result = await getUserProfile('user-1');
      expect(result).toEqual(MOCK_PROFILE);
    });

    it('returns null when document does not exist', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
      });

      const result = await getUserProfile('user-1');
      expect(result).toBeNull();
    });
  });

  describe('trackEvent', () => {
    it('calls updateDoc with arrayUnion', async () => {
      const { updateDoc, arrayUnion } = require('firebase/firestore');
      await trackEvent('user-1', 'evt-42');
      expect(updateDoc).toHaveBeenCalled();
      expect(arrayUnion).toHaveBeenCalledWith('evt-42');
    });
  });

  describe('untrackEvent', () => {
    it('calls updateDoc with arrayRemove', async () => {
      const { updateDoc, arrayRemove } = require('firebase/firestore');
      await untrackEvent('user-1', 'evt-42');
      expect(updateDoc).toHaveBeenCalled();
      expect(arrayRemove).toHaveBeenCalledWith('evt-42');
    });
  });

  describe('completeEvent', () => {
    it('calls updateDoc with arrayUnion on completedEvents', async () => {
      const { updateDoc } = require('firebase/firestore');
      await completeEvent('user-1', 'evt-99');
      expect(updateDoc).toHaveBeenCalled();
    });
  });
});
