import { CollectionData } from '@/app/hooks/useGetCollectionData';
import Image from 'next/image';
import LocationIcon from '@/icons/ico-location.svg';
import DateIcon from '@/icons/ico-date.svg';
import VerifiedIcon from '@/icons/ico-verified.svg';
import { useRef, useState, useEffect } from 'react';

interface CollectionViewProps {
  collectionData?: CollectionData | null; 
  loading: boolean;
  error: string | null;
}

const Base64Image = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (src.startsWith('data:image')) {
      const blob = dataURItoBlob(src);
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [src]);

  if (!objectUrl) return null;

  return <Image src={objectUrl} alt={alt} {...props} />;
};

const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export default function CollectionView({ collectionData, loading, error }: CollectionViewProps) {

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getColorFromLetter = (letter: string) => {
    const charCode = letter.toLowerCase().charCodeAt(0) - 97; 
    const hue = (charCode * 15) % 360; 
    return `hsl(${hue}, 70%, 50%)`; 
  };


  const isYouTubeLink = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isVideoFile = (url: string) => {
    return url.endsWith('.mov') || url.endsWith('.mp4');
  };

  const VideoPlayer = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

    // Generate thumbnail URL
    const thumbnailUrl = `${src.split('.').slice(0, -1).join('.')}.jpg`;

    const handleLoadedMetadata = () => {
      if (videoRef.current && !thumbnailLoaded) {
        videoRef.current.currentTime = 0.1;  
        setThumbnailLoaded(true);
      }
    };

    const togglePlay = (e: React.MouseEvent) => {
      e.preventDefault();
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
          setIsEnded(false);
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
    };

    const handleReplay = (e: React.MouseEvent) => {
      e.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
        setIsEnded(false);
      }
    };

    return (
      <div className="w-[350px] h-[350px] bg-black rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          src={src}
          poster={thumbnailUrl}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={() => setThumbnailLoaded(false)}
          playsInline
          onClick={togglePlay}
          onTouchStart={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!isPlaying && !isEnded && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        )}
        {isEnded && (
          <button
            onClick={handleReplay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </button>
        )}
      </div>
    );
  };

  const isBase64Image = (url: string) => {
    return url.startsWith('data:image');
  };

  return (
    <>
      {collectionData?.collection_image && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${collectionData?.collection_image})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }}
          ></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </>
      )}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 pt-[25px] flex flex-col items-start text-left">
        <div className="flex flex-col gap-[16px] mb-10">
        <div className="flex items-center">
          {collectionData?.creator_image && (
            <Image
              src={collectionData.creator_image}
              alt={collectionData.created_by_name || 'Creator'}
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
          )}
          <span className="text-white text-lg font-semibold">
            {collectionData?.created_by_name}
          </span>
        </div>
          <h1 className="text-[30px] font-[650] text-white drop-shadow-lg whitespace-normal break-words" 
              style={{ 
                wordBreak: 'keep-all',
                overflowWrap: 'normal',
                hyphens: 'manual'
              }}>
                {collectionData?.collection_name}
          </h1>
          <h2 className="text-base font-[500] text-white text-left flex flex-row gap-[18px]">
            <div className="flex flex-row gap-2 justify-center items-center"><LocationIcon />{collectionData?.location}</div>
            <div className="flex flex-row gap-2 justify-center items-center"><DateIcon />{collectionData?.date && new Date(collectionData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
          </h2>
        </div>

        <div className={`w-full flex flex-col items-center mb-20 ${collectionData?.posts.length === 0 ? 'justify-center' : ''}`} >
          {collectionData?.posts.length === 0 ? (
            <div className="text-white text-lg flex mt-[150px]">Nothing has been posted</div>
          ) : (
            collectionData?.posts.map((post) => (
              <div key={post.id} className="w-full max-w-lg mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {post.user_image ? (
                      <Image
                        src={post.user_image}
                        alt={`${post.user_name}'s profile`}
                        width={32}
                        height={32}
                        className="rounded-md mr-2"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center mr-2 text-white font-bold"
                        style={{ backgroundColor: getColorFromLetter(post.user_name.charAt(0)) }}
                      >
                        {post.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h2 className="text-base font-[500] text-white text-left flex items-center gap-[8px]">
                      {post.user_name}
                      {post.user_id == collectionData.created_by_id && (
                        <VerifiedIcon/>
                      )}
                    </h2>
                  </div>
                  {post.pinned && (
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="relative w-[350px] mb-2">
                  {isYouTubeLink(post.post_image) ? (
                    <div className="h-[196.875px]">
                      <iframe
                        width="350"
                        height="196.875"
                        src={post.post_image}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  ) : isVideoFile(post.post_image) ? (
                    <div>
                      <VideoPlayer src={post.post_image} />
                    </div>
                  ) : (
                    <div className="relative w-[350px] h-[350px]">
                      {isBase64Image(post.post_image) ? (
                        <Base64Image
                          src={post.post_image}
                          alt={`Post by ${post.user_name}`}
                          fill
                          sizes="350px"
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                      ) : (
                        <Image 
                          src={post.post_image} 
                          alt={`Post by ${post.user_name}`}
                          fill
                          sizes="350px"
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-white text-left">
                  {post.post_caption}
                </p>
                <h3 className="text-gray-300 text-[13px] mt-2 text-left">
                  {new Date(post.date).toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
