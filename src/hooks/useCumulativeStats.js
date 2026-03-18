import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

/**
 * Hook that computes cumulative player stats across ALL sessions.
 * These stats accumulate every time the player uses the app.
 */
export function useCumulativeStats() {
  // Count all sessions
  const totalSessions = useLiveQuery(
    () => db.sessions.count(),
    []
  );

  // Get all sessions to sum up manual per-session fields
  const allSessions = useLiveQuery(
    () => db.sessions.toArray(),
    []
  );

  // Get ALL touches across every session
  const allTouches = useLiveQuery(
    () => db.touches.toArray(),
    []
  );

  // Compute cumulative values from all sessions
  const sessionAggregates = (() => {
    if (!allSessions || allSessions.length === 0) {
      return { totalHoursTrained: 0, totalGames: 0 };
    }

    return allSessions.reduce((acc, session) => {
      acc.totalHoursTrained += parseFloat(session.totalHoursTrained) || 0;
      acc.totalGames += parseFloat(session.totalGames) || 0;
      return acc;
    }, { totalHoursTrained: 0, totalGames: 0 });
  })();

  // Compute cumulative touch-based stats
  const touchAggregates = (() => {
    if (!allTouches || allTouches.length === 0) {
      return { totalGoals: 0, totalPenalties: 0, totalTouches: 0, totalCornerKicks: 0, totalThrowIns: 0 };
    }

    return allTouches.reduce((acc, touch) => {
      acc.totalTouches++;
      if (touch.actionType === 'Goal') acc.totalGoals++;
      if (touch.actionType === 'Penalty Kick') acc.totalPenalties++;
      if (touch.actionType === 'Corner Kick') acc.totalCornerKicks++;
      if (touch.actionType === 'Throw-in') acc.totalThrowIns++;
      return acc;
    }, { totalGoals: 0, totalPenalties: 0, totalTouches: 0, totalCornerKicks: 0, totalThrowIns: 0 });
  })();

  return {
    totalSessions: totalSessions ?? 0,
    totalHoursTrained: sessionAggregates.totalHoursTrained,
    totalGames: sessionAggregates.totalGames,
    totalGoals: touchAggregates.totalGoals,
    totalPenalties: touchAggregates.totalPenalties,
    totalTouches: touchAggregates.totalTouches,
    totalCornerKicks: touchAggregates.totalCornerKicks,
    totalThrowIns: touchAggregates.totalThrowIns,
  };
}
