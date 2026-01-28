import Dexie from 'dexie';

export const db = new Dexie('FootballAppDB');

db.version(1).stores({
  // Main session metadata (Player Name, Date, Team)
  sessions: '++id, date, time, playerName, age, position, club, team, level, gameNumber, totalYearsPlaying, totalHoursTrained, createdAt',

  // The raw event log (The clicks on the ball)
  touches: '++id, sessionId, actionType, quality, timestamp',

  // The bottom forms (Ratings and Text)
  // detailedEvaluation and detailedPerformance will be stored as objects (not indexed directly)
  reflections: '++id, sessionId, technical, physical, tactical, mental, whatWentWell, wellDoneTags, achievedGoal, whatToImprove, whatLearned, whatWouldChange, overallPerformance, detailedPerformance, detailedEvaluation'
});

// Export database instance
export default db;
