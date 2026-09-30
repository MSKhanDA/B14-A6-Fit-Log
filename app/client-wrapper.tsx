'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
    </>
  );
}