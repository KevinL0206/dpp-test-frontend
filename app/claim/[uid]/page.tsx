'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useClaimTag from '../../hooks/useClaimTag';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export default function ClaimTagPage() {
  const { uid } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { claimTag, isLoading, error } = useClaimTag();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!authToken) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    }
  }, [authToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await claimTag({ token:authToken, uid: uid as string, submitted_password: password });
    if (result) {
      setMessage(result.message);
      if (result.message === "Tag claimed successfully") {
        router.push(`/${uid}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Claim Tag</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Claiming...' : 'Claim Tag'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}
