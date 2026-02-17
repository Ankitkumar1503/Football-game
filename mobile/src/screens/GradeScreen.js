import React from 'react';
import { ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { PlayerAttendanceGrade } from '../components/sections/PlayerAttendanceGrade';
import { BottomBar } from '../components/sections/BottomBar';

export function GradeScreen() {
    return (
        <Layout>
            <ScrollView className="flex-1 px-4 py-6 mb-16">
                <PlayerAttendanceGrade />
            </ScrollView>
            <BottomBar />
        </Layout>
    );
}
