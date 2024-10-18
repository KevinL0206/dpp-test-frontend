import { useState } from 'react';

interface CreatePostParams {
  token: string;
  collection_id: number;
  post_image: string;
  post_caption?: string;
}

interface CreatePostResponse {
  message: string;
  post_id: number;
  user_id: number;
  post_image: string;
  post_caption: string | null;
  collection_id: number;
  date: string;
}

const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async ({
    token,
    collection_id,
    post_image,
    post_caption,
  }: CreatePostParams): Promise<CreatePostResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://verisart-kevin-core.eu.ngrok.io/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          collection_id,
          post_image,
          post_caption,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const data: CreatePostResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading, error };
};

export default useCreatePost;

