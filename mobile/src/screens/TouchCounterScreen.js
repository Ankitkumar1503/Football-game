import React from 'react';
import { ScrollView, View } from 'react-native';
import { Layout } from '../components/Layout';
import { ActionWheel } from '../components/sections/ActionWheel';
import { LiveStats } from '../components/sections/LiveStats';
import { BottomBar } from '../components/sections/BottomBar';

export function TouchCounterScreen() {
    return (
        <Layout>
            <ScrollView className="flex-1 px-4 py-6 mb-16">
                <ActionWheel />
                <LiveStats />
            </ScrollView>
            <BottomBar />
        </Layout>
    );
}
