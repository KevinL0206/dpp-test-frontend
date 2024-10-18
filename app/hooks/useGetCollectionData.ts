import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Post {
  id: number;
  user_name: string;
  user_id: number;
  user_image: string;
  post_image: string;
  date: string;
  post_caption: string;
  pinned: boolean;
}

export interface CollectionData {
  collection_id: number;
  collection_name: string;
  collection_image: string;
  location: string;
  date: string;
  created_by_name: string;
  created_by_id: number;
  creator_image: string;
  posts: Post[];
}

const useGetCollectionData = (uid: string, token?: string, authToken?: string | null, collectionId?: number) => {
  const [collectionData, setCollectionData] = useState<CollectionData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollectionData = useCallback(async () => {
    if (!token && !authToken) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://verisart-kevin-core.eu.ngrok.io/api/collection/${uid}/${collectionId}/posts`,
        {
          params: { token: token, auth_token: authToken },
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        }
      );
      setCollectionData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch collection data");
      setCollectionData(undefined);
    } finally {
      setLoading(false);
    }
  }, [uid, token, authToken, collectionId]);

  useEffect(() => {
    if (!collectionId) {
      return;
    }
    fetchCollectionData();
  }, [collectionId, fetchCollectionData]);

  return { collectionData, loading, error, refetch: fetchCollectionData };
};

export default useGetCollectionData;
