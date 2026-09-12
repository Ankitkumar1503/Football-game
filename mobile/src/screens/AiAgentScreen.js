import React from 'react';
import { Layout } from '../components/Layout';
import { AiPlayerAgent } from '../components/sections/AiPlayerAgent';

export function AiAgentScreen() {
  return (
    <Layout scrollable={false}>
      <AiPlayerAgent />
    </Layout>
  );
}

export default AiAgentScreen;
