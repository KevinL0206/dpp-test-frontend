import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export enum RewardType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file'
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  type: RewardType;
  content_url: string;
  date_created: string;
}

export interface ProductRewards {
  product_id: number;
  product_name: string;
  rewards: Reward[];
}

const useGetProductRewards = (productId: number | undefined, token: string | null) => {
  const [productRewards, setProductRewards] = useState<ProductRewards | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductRewards = useCallback(async () => {
    if (!productId || !token ) {
      console.log("Missing productId or token, skipping fetch");
      setLoading(false);
      setError(null);
      setProductRewards(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/product/${productId}/rewards`,
        {
          headers: {
            'Authorization': token,
          },
        }
      );
      setProductRewards(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching product rewards:", err);
      setProductRewards(null);
      setError('Failed to fetch product rewards');
    } finally {
      setLoading(false);
    }
  }, [token, productId]);

  useEffect(() => {
    fetchProductRewards();
  }, [fetchProductRewards]);

  return { productRewards, loading, error, refetch: fetchProductRewards };
};

export default useGetProductRewards;
