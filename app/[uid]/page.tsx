'use client';

import { useParams, useSearchParams } from 'next/navigation';
import useGetProductInfo from '../hooks/useGetProductInfo';
import BottomNav from '@/app/components/BottomNav';
import ProductView from '@/app/components/ProductView';
import { useState, useEffect } from 'react';
import useGetCollectionData from '../hooks/useGetCollectionData';
import CollectionView from '@/app/components/CollectionView';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import CreatePost from '../components/CreatePost';
import useGetProductRewards from '../hooks/useGetProductRewards';
import RewardsView from '@/app/components/RewardsView';


export enum PageView {
  PRODUCT = 'product',
  COLLECTION = 'collection',
  CREATE = 'create', 
  REWARDS = 'rewards',
}

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const uid = params.uid as string;
  const token = searchParams.get('token') || undefined;
  const authToken = useSelector((state: RootState) => state.auth.token);
  const { productInfo, loading, error,refetch } = useGetProductInfo(uid, token,authToken);
  
  const [pageView, setPageView] = useState<PageView>(PageView.PRODUCT);
  const [collectionId, setCollectionId] = useState<number | undefined>(undefined);
  const [showNoProductInfo, setShowNoProductInfo] = useState(false);
  const { collectionData, loading: collectionLoading, error: collectionError, refetch: refetchCollectionData } = useGetCollectionData(uid, token, authToken, collectionId);
  const [showError, setShowError] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.user_id;
  const { productRewards, refetch: refetchRewards } = useGetProductRewards(productInfo?.product_id, authToken);


  useEffect(() => {
    refetch();
    refetchCollectionData();
    console.log("authToken: ", authToken);
    console.log("refetching...")
  }, [authToken]);

  const claimedByCurrentUser = productInfo?.claimed === userId;

  useEffect(() => {
    if (productInfo && productInfo.collection_id) {
      setCollectionId(productInfo.collection_id);
    }
  }, [productInfo]);

  useEffect(() => {
      refetchRewards();
  }, [productInfo,claimedByCurrentUser]);

  const errorMessage = productInfo?.error;

  useEffect(() => {
    console.log("errorMessage: ", errorMessage);
    if (error || errorMessage) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error, errorMessage,productInfo]);

  useEffect(() => {
    if (!productInfo) {
      const timer = setTimeout(() => {
        setShowNoProductInfo(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowNoProductInfo(false);
    }
  }, [productInfo]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (showError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p>{error || errorMessage}</p>
      </div>
    );
  }

  if (!productInfo && showNoProductInfo) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        No product information available.
      </div>
    );
  }
  

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {pageView === PageView.PRODUCT && <ProductView productInfo={productInfo} setPageView={setPageView} />}
      {pageView === PageView.COLLECTION && <CollectionView collectionData={collectionData} loading={collectionLoading} error={collectionError}  />}
      {pageView === PageView.CREATE && <CreatePost collection_id={collectionId} onClose={() => setPageView(PageView.PRODUCT)} refetch={refetchCollectionData} />}
      {pageView === PageView.REWARDS && <RewardsView productRewards={productRewards} productInfo={productInfo}/>}
      {pageView !== PageView.CREATE && (
        <BottomNav
          pageView={pageView}
          setPageView={setPageView}
          user={user}
          claimed={productInfo?.claimed}
          claimedByCurrentUser={claimedByCurrentUser}
          uid={uid}
          refetch={refetch}
          productRewards={productRewards || undefined}
        />
      )}
    </div>
  );
}
