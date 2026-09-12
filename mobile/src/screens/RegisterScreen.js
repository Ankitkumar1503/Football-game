import React from 'react';
import { Layout } from '../components/Layout';
import { PlayerProfile } from '../components/sections/PlayerProfile';

export function RegisterScreen() {
  return (
    <Layout hideHeader hideBottomBar>
      <PlayerProfile />
    </Layout>
  );
}

export default RegisterScreen;
