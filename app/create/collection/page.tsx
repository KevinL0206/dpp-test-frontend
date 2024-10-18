'use client';

import { useEffect, useState } from 'react';
import useCreateCollection from '../../hooks/useCreateCollection';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

export default function CreateCollectionPage() {
  const [collectionName, setCollectionName] = useState('');
  const [collectionImage, setCollectionImage] = useState<File | null>(null);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const { createCollection, isLoading, error } = useCreateCollection();

  const authToken = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    if (!authToken) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    }
  }, [authToken]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCollectionImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionImage) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const result = await createCollection({
        token: authToken,
        collection_name: collectionName,
        collection_image: base64Image,
        date: collectionDate,
        location: collectionLocation,
      });
      if (result) {
        console.log('Collection created:', result);
      }
    };
    reader.readAsDataURL(collectionImage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Collection</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="collectionName" className="block mb-1">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="collectionImage" className="block mb-1">Collection Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="collectionDate" className="block mb-1">Collection Date</label>
          <input
            type="date"
            id="collectionDate"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="collectionLocation" className="block mb-1">Collection Location</label>
          <input
            type="text"
            id="collectionLocation"
            value={collectionLocation}
            onChange={(e) => setCollectionLocation(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Creating...' : 'Create Collection'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
