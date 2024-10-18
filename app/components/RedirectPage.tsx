'use client';
import React from 'react';
import { useRouter } from 'next/navigation'

interface RedirectPageProps {
  pageName: string;
}

export default function RedirectPage({ pageName }: RedirectPageProps) {
  const router = useRouter()

  return (
    <div>
      <h1>Redirected Page</h1>
      <p>You were redirected to: {pageName}</p>
      <button onClick={() => router.push('/')}>Go back home</button>
    </div>
  )
}
