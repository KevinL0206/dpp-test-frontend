import { useState } from 'react';

interface CreateCollectionParams {
  token?: string | null;
  collection_name: string;
  collection_image?: string;
  date: string;
  location: string;
}

interface CreateCollectionResponse {
  message: string;
  collection_id: number;
  collection_name: string;
  collection_image: string | null;
  created_by: number;
  date: string;
  location: string;
}

const useCreateCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCollection = async ({
    token,
    collection_name,
    collection_image,
    date,
    location,
  }: CreateCollectionParams): Promise<CreateCollectionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://verisart-kevin-core.eu.ngrok.io/api/create-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "token" :token,
          "collection_name" :collection_name,
          "collection_image" :collection_image,
          "date" :date,
          "location" :location,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collection');
      }

      const data: CreateCollectionResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCollection, isLoading, error };
};

export default useCreateCollection;

