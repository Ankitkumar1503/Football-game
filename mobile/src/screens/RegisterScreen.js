import React from 'react';
import { ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { PlayerProfile } from '../components/sections/PlayerProfile';

export function RegisterScreen() {
    return (
        <Layout>
            <ScrollView className="flex-1 px-4 py-6">
                <PlayerProfile />
            </ScrollView>
        </Layout>
    );
}
