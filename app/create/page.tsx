'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function CreatePage() {
    const router = useRouter();
    const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!authToken) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    }
  }, [authToken]);

    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <button onClick={() => router.push('/create/collection')} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Create Collection</button>
            <button onClick={() => router.push('/create/product')} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Create Product</button>
        </div>
    );
};

