import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface ContentBlock {
  id: number;
  type: string;
  content: string;
  order: number;
}

export interface ProductInfo {
  product_id?: number;
  product_name?: string;
  product_image?: string;
  collection_id?: number;
  collection_name?: string;
  collection_image?: string;
  location?: string;
  date?: string;
  created_by_name?: string;
  creator_image?: string;
  error?: string;
  claimed?: number;
  creator_id?: number;
  content_blocks?: ContentBlock[];
}

const useGetProductInfo = (uid: string, token?: string, authToken?: string | null) => {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("token here: ", token);
  console.log("authToken here: ", authToken);

  const fetchProductInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://verisart-kevin-core.eu.ngrok.io/api/product/${uid}`,
        {
          params: { token: token, auth_token: authToken },
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        }
      );
      setProductInfo(response.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setProductInfo(null);
      setError('Failed to fetch product info');
    } finally {
      setLoading(false);
    }
  }, [token, authToken, uid]);

  useEffect(() => {
    fetchProductInfo();
  }, [fetchProductInfo]);

  return { productInfo, loading, error, refetch: fetchProductInfo };
};

export default useGetProductInfo;
