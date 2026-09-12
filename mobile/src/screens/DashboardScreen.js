import React from 'react';
import { Layout } from '../components/Layout';
import { PlayerDashboard } from '../components/sections/PlayerDashboard';

export function DashboardScreen() {
  return (
    <Layout>
      <PlayerDashboard />
    </Layout>
  );
}

export default DashboardScreen;
