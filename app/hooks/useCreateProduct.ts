import { useState } from 'react';

interface CreateProductParams {
  token?: string | null;
  product_name: string;
  product_image?: string;
  collection_id: number;
  tag_uid: string;
  content_blocks?: Array<{
    type: string;
    content: string;
  }>;
}

interface CreateProductResponse {
  message: string;
  product_id: number;
  tag_uid: string;
}

const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async ({
    token,
    product_name,
    product_image,
    collection_id,
    tag_uid,
    content_blocks = [],
  }: CreateProductParams): Promise<CreateProductResponse | null> => {
    if (!token) {
      setError('Token is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://verisart-kevin-core.eu.ngrok.io/api/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          product_name,
          product_image,
          collection_id,
          tag_uid,
          content_blocks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const data: CreateProductResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error };
};

export default useCreateProduct;
