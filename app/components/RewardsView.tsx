import { ProductRewards, Reward } from '@/app/hooks/useGetProductRewards';
import Image from 'next/image';
import { ProductInfo } from '../hooks/useGetProductInfo';

interface RewardsViewProps {
  productRewards: ProductRewards | null;
  productInfo: ProductInfo | null;
}

export default function RewardsView({ productRewards, productInfo }: RewardsViewProps) {
  if (!productRewards || !productInfo) {
    return <div className="text-white text-center p-4 h-screen">No rewards available.</div>;
  }

  return (
    <>
      {productInfo.collection_image && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${productInfo.collection_image})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }}
          ></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </>
      )}
      <div className="relative z-10 container mx-auto px-6  sm:px-8 pt-[25px] flex flex-col items-start text-left min-h-screen overflow-y-auto">
        <h1 className="text-[30px] font-[650] text-white w-[90%] drop-shadow-lg mb-[25px]">
          Rewards for {productRewards.product_name}
        </h1>

        <div className="w-full space-y-6 pb-6">
          {productRewards.rewards.map((reward: Reward) => (
            <div key={reward.id} className="w-full p-4 rounded-lg shadow-lg backdrop-blur-sm backdrop-brightness-110 border border-white/30">
              <h2 className="text-2xl text-white mb-2">{reward.name}</h2>
              <p className="text-gray-300 mb-4">{reward.description}</p>
              {reward.content_url && (
                <div className="relative w-full h-[200px] mb-4">
                  <Image 
                    src={reward.content_url} 
                    alt={reward.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
