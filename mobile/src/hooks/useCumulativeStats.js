import { useState, useEffect } from 'react';
import { db, subscribeToDb } from '../lib/db';

/**
 * Hook that computes cumulative player stats across ALL sessions.
 * These stats accumulate every time the player uses the app.
 * Uses the mobile AsyncStorage-based DB adapter.
 */
export function useCumulativeStats() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHoursTrained: 0,
    totalGames: 0,
    totalGoals: 0,
    totalPenalties: 0,
    totalTouches: 0,
  });

  const computeStats = async () => {
    try {
      const allSessions = await db.sessions.getAll();
      const allTouches = await db.touches.getAll();

      // Count sessions
      const totalSessions = allSessions.length;

      // Sum per-session fields
      const sessionAggregates = allSessions.reduce((acc, session) => {
        acc.totalHoursTrained += parseFloat(session.totalHoursTrained) || 0;
        acc.totalGames += parseFloat(session.totalGames) || 0;
        return acc;
      }, { totalHoursTrained: 0, totalGames: 0 });

      // Compute touch-based stats
      const touchAggregates = allTouches.reduce((acc, touch) => {
        acc.totalTouches++;
        if (touch.actionType === 'Goal') acc.totalGoals++;
        if (touch.actionType === 'Penalty Kick') acc.totalPenalties++;
        return acc;
      }, { totalGoals: 0, totalPenalties: 0, totalTouches: 0 });

      setStats({
        totalSessions,
        totalHoursTrained: sessionAggregates.totalHoursTrained,
        totalGames: sessionAggregates.totalGames,
        totalGoals: touchAggregates.totalGoals,
        totalPenalties: touchAggregates.totalPenalties,
        totalTouches: touchAggregates.totalTouches,
      });
    } catch (error) {
      console.error('Error computing cumulative stats:', error);
    }
  };

  useEffect(() => {
    computeStats();
    // Subscribe to DB changes for reactivity
    const unsubscribe = subscribeToDb(computeStats);
    return unsubscribe;
  }, []);

  return stats;
}
