'use client';

import React, { useState, useEffect, useRef, useCallback, TouchEvent } from 'react';
import useCreateProduct from '../../hooks/useCreateProduct';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

interface ContentBlock {
  type: string;
  content: string | File | null;
  preview?: string;
  fileName?: string;
}

const CreateProductPage = () => {
  const { createProduct, isLoading, error } = useCreateProduct();
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [collectionId, setCollectionId] = useState(0);
  const [tagUid, setTagUid] = useState('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isDndReady, setIsDndReady] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dropLinePosition, setDropLinePosition] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const contentBlocksRef = useRef<HTMLDivElement>(null);
  const dragButtonRef = useRef<HTMLDivElement>(null);

  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!authToken) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    }
  }, [authToken]);

  useEffect(() => {
    // This ensures that the drag and drop is only initialized client-side
    setIsDndReady(true);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProductImage(event.target.files[0]);
    }
  };

  const addContentBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'text', content: '' }]);
  };

  const updateContentBlock = (index: number, field: keyof ContentBlock, value: any) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setContentBlocks(updatedBlocks);
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleContentBlockImageUpload = (index: number, file: File) => {
    console.log('Uploading image for block:', index, 'File:', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('FileReader onloadend triggered');
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleFactor = Math.min(250 / img.width, 250 / img.height);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedPreview = canvas.toDataURL(file.type);
        console.log('Preview generated, updating content block');
        setContentBlocks(prevBlocks => {
          const newBlocks = [...prevBlocks];
          newBlocks[index] = {
            ...newBlocks[index],
            content: file,
            preview: resizedPreview,
            fileName: file.name,
            type: 'image'
          };
          return newBlocks;
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = '0.4';
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (contentBlocksRef.current) {
      const containerRect = contentBlocksRef.current.getBoundingClientRect();
      const y = e.clientY - containerRect.top;
      const blockHeight = 100; // Adjust this value based on your actual block height
      const linePosition = Math.round(y / blockHeight);
      setDropLinePosition(linePosition);
    }
  }, []);

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDropLinePosition(null);
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Prevent default touch behavior
    setDraggedItem(index);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
    if (dragButtonRef.current) {
      dragButtonRef.current.style.opacity = '0.4';
    }
  };

  const onTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling
    if (contentBlocksRef.current && touchStartY !== null) {
      const containerRect = contentBlocksRef.current.getBoundingClientRect();
      const y = e.touches[0].clientY - containerRect.top;
      const blockHeight = 100; // Adjust this value based on your actual block height
      const linePosition = Math.round(y / blockHeight);
      setDropLinePosition(linePosition);
    }
  }, [isDragging, touchStartY]);

  const onTouchEnd = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const draggedIndex = draggedItem;
    if (draggedIndex === null) return;

    const dropIndex = dropLinePosition ?? contentBlocks.length;
    const newBlocks = [...contentBlocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);

    setContentBlocks(newBlocks);
    setDraggedItem(null);
    setDropLinePosition(null);
    setTouchStartY(null);
    setIsDragging(false);
    if (dragButtonRef.current) {
      dragButtonRef.current.style.opacity = '1';
    }
  }, [isDragging, draggedItem, dropLinePosition, contentBlocks]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = draggedItem;
    if (draggedIndex === null) return;

    const newBlocks = [...contentBlocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, removed);

    setContentBlocks(newBlocks);
    setDraggedItem(null);
    setDropLinePosition(null);

    // Handle file drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleContentBlockImageUpload(index, file);
    }
  }, [contentBlocks, draggedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      
      // Process content blocks
      const processedContentBlocks = await Promise.all(contentBlocks.map(async (block) => {
        if (block.type === 'image' || block.type === 'video') {
          if (block.content instanceof File) {
            return new Promise<{ type: string; content: string }>((resolve) => {
              const blockReader = new FileReader();
              blockReader.onloadend = () => {
                resolve({ type: block.type, content: blockReader.result as string });
              };
              blockReader.readAsDataURL(block.content as File);
            });
          }
          // Handle case where content is not a File
          return { type: block.type, content: '' };
        } else if (block.type === 'text' && typeof block.content === 'string') {
          return { type: block.type, content: block.content };
        } else {
          // Handle invalid or null content
          return { type: block.type, content: '' };
        }
      }));

      const response = await createProduct({
        token: authToken,
        product_name: productName,
        product_image: base64Image,
        collection_id: collectionId,
        tag_uid: tagUid,
        content_blocks: processedContentBlocks,
      });
      if (response) {
        console.log('Product created:', response);
        // Redirect to the product page using the tag_uid
        window.location.href = `/${tagUid}`;
      }
    };
    reader.readAsDataURL(productImage);
  };

  const CustomFileInput = ({ accept, onChange, fileName }: { accept: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, fileName?: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('File selected:', e.target.files);
      if (e.target.files && e.target.files[0]) {
        onChange(e);
        // Reset the file input value to allow selecting the same file again
        e.target.value = '';
      }
    };

    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {fileName ? 'Change File' : 'Choose File'}
        </button>
        {fileName && <span className="ml-2">{fileName}</span>}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  };

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    
    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isDragging]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block mb-1">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="productImage" className="block mb-1">Main Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="collectionId" className="block mb-1">Collection ID</label>
          <input
            type="number"
            id="collectionId"
            value={collectionId}
            onChange={(e) => setCollectionId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="tagUid" className="block mb-1">Tag UID</label>
          <input
            type="text"
            id="tagUid"
            value={tagUid}
            onChange={(e) => setTagUid(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Content Blocks</h2>
          <div
            ref={contentBlocksRef}
            onDragOver={onDragOver}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative"
          >
            {contentBlocks.map((block, index) => (
              <React.Fragment key={`block-${index}`}>
                {dropLinePosition === index && (
                  <div className="h-1 bg-blue-500 w-full my-2" />
                )}
                <div
                  onDrop={(e) => onDrop(e, index)}
                  className={`flex flex-col space-y-2 mb-2 p-2 border rounded ${
                    draggedItem === index ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      ref={dragButtonRef}
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragEnd={onDragEnd}
                      onTouchStart={(e) => onTouchStart(e, index)}
                      className="cursor-move p-2 bg-gray-200 rounded"
                    >
                      ☰
                    </div>
                    <select
                      value={block.type}
                      onChange={(e) => updateContentBlock(index, 'type', e.target.value)}
                      className="px-3 py-2 border rounded"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  {block.type === 'text' ? (
                    <textarea
                      value={block.content as string}
                      onChange={(e) => updateContentBlock(index, 'content', e.target.value)}
                      placeholder="Enter text content"
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                    />
                  ) : (
                    <div>
                      <CustomFileInput
                        accept={block.type === 'image' ? "image/*" : "video/*"}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleContentBlockImageUpload(index, e.target.files[0]);
                          }
                        }}
                        fileName={block.fileName}
                      />
                      {block.preview ? (
                        <img 
                          src={block.preview} 
                          alt="Preview" 
                          className="mt-2 max-w-[250px] max-h-[250px] object-contain"
                        />
                      ) : (
                        <p>No preview available</p>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
            {dropLinePosition === contentBlocks.length && (
              <div className="h-1 bg-blue-500 w-full my-2" />
            )}
          </div>
          <button
            type="button"
            onClick={addContentBlock}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
          >
            Add Content Block
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreateProductPage;
