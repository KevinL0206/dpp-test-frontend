import { ProductInfo } from '@/app/hooks/useGetProductInfo';
import Image from 'next/image';
import LocationIcon from '@/icons/ico-location.svg';
import DateIcon from '@/icons/ico-date.svg';
import { PageView } from '@/app/[uid]/page';

interface ProductViewProps {
  productInfo: ProductInfo | null;
  setPageView: (view: PageView) => void;
}

export default function ProductView({ productInfo, setPageView }: ProductViewProps) {

  if (!productInfo) return null;

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
      <div className="relative z-10 container mx-auto px-6 sm:px-8 pt-[25px] flex flex-col items-start text-left">
        <div className="flex items-center mb-[16px]">
          {productInfo.creator_image && (
            <Image
              src={productInfo.creator_image}
              alt={productInfo.created_by_name || 'Creator'}
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
          )}
          <span className="text-white text-lg font-semibold">
            {productInfo.created_by_name}
          </span>
        </div>

        <div className="flex flex-col gap-[12px] mb-[25px]">
        <h1 className="text-[30px] font-[650] text-white drop-shadow-lg whitespace-normal break-words" 
            style={{ 
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              hyphens: 'manual'
            }}>
          {productInfo.collection_name}
        </h1>
        <h2 className="text-base font-[500] text-white text-left flex flex-row gap-[18px]">
          <div className="flex flex-row gap-2 justify-center items-center"><LocationIcon />{productInfo.location}</div>
          <div className="flex flex-row gap-2 justify-center items-center"><DateIcon />{productInfo.date && new Date(productInfo.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
        </h2>
        </div>

        {productInfo.product_image && (
          <div className="w-full flex justify-center">
            <div onClick={() => setPageView(PageView.COLLECTION)} className="w-full max-w-lg p-4 py-10 rounded-lg shadow-lg backdrop-blur-sm backdrop-brightness-110 border border-white/30">
              <div className="relative w-full h-[200px]">
                <Image 
                  src={productInfo.product_image} 
                  alt={productInfo.product_name || 'Product image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl text-white mt-6 text-center">
                {productInfo.product_name}
              </h2>
              <h3 className="text-gray-300 mt-2 text-center">
                Official merchandise
              </h3>
            </div>
          </div>
        )}

        {/* Updated content blocks section */}
        {productInfo.content_blocks && productInfo.content_blocks.length > 0 && (
          <div className="w-full mt-8 flex flex-col gap-[12px] items-center mb-20">
            {productInfo.content_blocks.map((block, index) => (
              <div key={block.id} className="mb-6">
                {block.type === 'text' && (
                  <p className="text-white">{block.content}</p>
                )}
                {block.type === 'image' && (
                  <Image
                    src={block.content}
                    alt={`Content block image ${index + 1}`}
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                )}
                {block.type === 'video' && (
                  <video 
                    controls 
                    className="w-full max-w-lg rounded-lg"
                  >
                    <source src={block.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
