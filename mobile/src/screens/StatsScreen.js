import React from 'react';
import { Layout } from '../components/Layout';
import { PlayerStats } from '../components/sections/PlayerStats';

export function StatsScreen() {
  return (
    <Layout>
      <PlayerStats />
    </Layout>
  );
}

export default StatsScreen;
