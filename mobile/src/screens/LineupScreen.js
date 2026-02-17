import React from 'react';
import { ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { FootballFormation } from '../components/sections/FootballFormation';
import { BottomBar } from '../components/sections/BottomBar';

export function LineupScreen() {
    return (
        <Layout>
            <ScrollView className="flex-1 px-4 py-6 mb-16">
                <FootballFormation />
            </ScrollView>
            <BottomBar />
        </Layout>
    );
}
