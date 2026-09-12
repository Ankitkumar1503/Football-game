import React from 'react';
import { Layout } from '../components/Layout';
import { PlayerEvaluation } from '../components/sections/PlayerEvaluation';

export function EvaluationScreen() {
  return (
    <Layout>
      <PlayerEvaluation />
    </Layout>
  );
}

export default EvaluationScreen;
