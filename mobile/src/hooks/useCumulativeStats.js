import { useState, useEffect, useCallback } from 'react';
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
    totalCornerKicks: 0,
    totalThrowIns: 0,
    todayTouches: 0,
    weekTouches: 0,
    monthTouches: 0,
  });

  const computeStats = useCallback(async () => {
    try {
      const allSessions = await db.sessions.getAll();
      const allTouches = await db.touches.getAll();

      // Count sessions
      const totalSessions = allSessions.length;

      // Sum per-session fields
      const sessionAggregates = allSessions.reduce(
        (acc, session) => {
          acc.totalHoursTrained += parseFloat(session.totalHoursTrained) || 0;
          acc.totalGames += parseFloat(session.totalGames) || 0;
          return acc;
        },
        { totalHoursTrained: 0, totalGames: 0 }
      );

      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

      let todayTouches = 0;
      let weekTouches = 0;
      let monthTouches = 0;
      let totalGoals = 0;
      let totalPenalties = 0;
      let totalCornerKicks = 0;
      let totalThrowIns = 0;

      allTouches.forEach((touch) => {
        const ts = touch.timestamp || 0;
        if (ts >= oneDayAgo) todayTouches++;
        if (ts >= oneWeekAgo) weekTouches++;
        if (ts >= oneMonthAgo) monthTouches++;

        if (touch.actionType === 'Goal') totalGoals++;
        if (touch.actionType === 'Penalty Kick') totalPenalties++;
        if (touch.actionType === 'Corner Kick') totalCornerKicks++;
        if (touch.actionType === 'Throw-In' || touch.actionType === 'Throw-in') totalThrowIns++;
      });

      setStats({
        totalSessions,
        totalHoursTrained: sessionAggregates.totalHoursTrained,
        totalGames: sessionAggregates.totalGames,
        totalGoals,
        totalPenalties,
        totalTouches: allTouches.length,
        totalCornerKicks,
        totalThrowIns,
        todayTouches,
        weekTouches,
        monthTouches,
      });
    } catch (error) {
      console.error('Error computing cumulative stats:', error);
    }
  }, []);

  useEffect(() => {
    computeStats();
    // Subscribe to DB changes for reactivity
    const unsubscribe = subscribeToDb(computeStats);
    return unsubscribe;
  }, [computeStats]);

  return stats;
}

export default useCumulativeStats;
