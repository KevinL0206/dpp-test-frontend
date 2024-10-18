import { useState } from 'react';

interface ClaimTagParams {
  token: string | null;
  uid: string;
  submitted_password: string;
}

interface ClaimTagResponse {
  message: string;
}

const useClaimTag = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimTag = async ({
    token,
    uid,
    submitted_password,
  }: ClaimTagParams): Promise<ClaimTagResponse | null> => {
    if (!token) {
      setError('Token is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://verisart-kevin-core.eu.ngrok.io/api/claim-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          uid,
          submitted_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to claim tag');
      }

      const data: ClaimTagResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { claimTag, isLoading, error };
};

export default useClaimTag;

