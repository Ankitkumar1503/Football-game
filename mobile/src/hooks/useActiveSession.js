import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from './useLiveQuery';
import { db } from '../lib/db';

/**
 * Custom hook to manage the active session
 * Automatically creates a new session if none exists
 * Subscribes to database changes using useLiveQuery schema
 */
export function useActiveSession() {
  const [sessionId, setSessionId] = useState(null);

  // Get or create active session
  useEffect(() => {
    async function initializeSession() {
      try {
        // Try to get the most recent session from today
        const today = new Date().toISOString().split('T')[0];
        
        // Custom where-equals-first implementation from our adapter
        const existingSession = await db.sessions
          .where('date')
          .equals(today)
          .first();

        if (existingSession) {
          setSessionId(existingSession.id);
        } else {
          // Create a new session for today
          // First, check if there's ANY previous session to copy profile data from
          const lastSession = await db.sessions.orderBy('createdAt').last();

          const newSessionId = await db.sessions.add({
            date: today,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            playerName: lastSession?.playerName || '',
            position: lastSession?.position || '',
            club: lastSession?.club || '',
            team: lastSession?.team || '',
            age: lastSession?.age || '',
            level: lastSession?.level || '',
            gameNumber: null,
            totalYearsPlaying: lastSession?.totalYearsPlaying || '',
            totalHoursTrained: lastSession?.totalHoursTrained || '',
            createdAt: Date.now()
          });
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    }

    initializeSession();
  }, []);

  // Subscribe to session changes
  const session = useLiveQuery(
    async () => {
      if (!sessionId) return undefined;
      return await db.sessions.get(sessionId);
    },
    [sessionId]
  );

  // Subscribe to touches for this session
  const touches = useLiveQuery(
    async () => {
      if (!sessionId) return [];
      return await db.touches.where('sessionId').equals(sessionId).toArray();
    },
    [sessionId]
  );

  // Subscribe to reflection for this session
  const reflection = useLiveQuery(
    async () => {
      if (!sessionId) return null;
      return await db.reflections.where('sessionId').equals(sessionId).first();
    },
    [sessionId]
  );

  // Calculate stats from touches (computed from touches array)
  const stats = useMemo(() => {
    const initialStats = {
      total: 0, good: 0, bad: 0,
      Pass: 0, Dribble: 0, 'Corner Kick': 0, Header: 0, Tackle: 0,
      Goal: 0, Shot: 0, 'Free Kick': 0, 'Penalty Kick': 0, Cross: 0,
      'Yellow Card': 0, 'Red Card': 0, 'Goal Kick': 0
      // Add other actions here if they appear in the wheel
    };

    if (!touches || touches.length === 0) {
      return initialStats;
    }

    return touches.reduce((acc, touch) => {
      acc.total++;
      if (touch.quality === 'Positive') acc.good++;
      if (touch.quality === 'Negative') acc.bad++;

      // Increment action count if it exists in our map, otherwise ignore or init
      if (touch.actionType) {
        acc[touch.actionType] = (acc[touch.actionType] || 0) + 1;
      }
      return acc;
    }, initialStats);
  }, [touches]);

  // Update session function
  const updateSession = async (updates) => {
    if (!sessionId) return;
    try {
      await db.sessions.update(sessionId, updates);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  // Add touch function
  const addTouch = async (actionType, quality) => {
    if (!sessionId) return;
    try {
      await db.touches.add({
        sessionId,
        actionType,
        quality,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error adding touch:', error);
    }
  };

  // Update reflection function
  const updateReflection = async (updates) => {
    if (!sessionId) return;
    try {
      const existing = await db.reflections.where('sessionId').equals(sessionId).first();

      if (existing) {
        await db.reflections.update(existing.id, updates);
      } else {
        await db.reflections.add({
          sessionId,
          ...updates
        });
      }
    } catch (error) {
      console.error('Error updating reflection:', error);
    }
  };

  return {
    sessionId,
    session: session || {},
    touches: touches || [],
    reflection: reflection || {},
    stats: stats || { total: 0, good: 0, bad: 0 },
    updateSession,
    addTouch,
    updateReflection
  };
}
