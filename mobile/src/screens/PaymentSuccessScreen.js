import React from 'react';
import { Layout } from '../components/Layout';
import { PaymentSuccess } from '../components/sections/PaymentSuccess';

export function PaymentSuccessScreen() {
  return (
    <Layout hideHeader hideBottomBar>
      <PaymentSuccess />
    </Layout>
  );
}

export default PaymentSuccessScreen;
