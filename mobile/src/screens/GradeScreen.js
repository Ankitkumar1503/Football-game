import React from 'react';
import { Layout } from '../components/Layout';
import { PlayerAttendanceGrade } from '../components/sections/PlayerAttendanceGrade';

export function GradeScreen() {
  return (
    <Layout>
      <PlayerAttendanceGrade />
    </Layout>
  );
}

export default GradeScreen;
