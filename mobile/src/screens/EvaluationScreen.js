import React from 'react';
import { ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { PlayerEvaluation } from '../components/sections/PlayerEvaluation';
import { BottomBar } from '../components/sections/BottomBar';

export function EvaluationScreen() {
    return (
        <Layout>
            <ScrollView className="flex-1 px-4 py-6 mb-16">
                <PlayerEvaluation />
            </ScrollView>
            <BottomBar />
        </Layout>
    );
}
