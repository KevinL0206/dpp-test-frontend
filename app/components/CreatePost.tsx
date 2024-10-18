import { useState } from 'react';
import useCreatePost from '../hooks/useCreatePost';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface CreatePostProps {
  collection_id?: number;
  onClose: () => void;
  refetch?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ collection_id, onClose, refetch }) => {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const { createPost, isLoading, error } = useCreatePost();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmitPost = async () => {
    if (!image || !token) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        if (!collection_id) {
          console.error('Collection ID is required');
          return;
        }
        await createPost({
          token,
          collection_id: collection_id,
          post_image: base64Image,
          post_caption: caption,
        });
        onClose();
        if (refetch) refetch();
      } catch (err) {
        console.error('Error creating post:', err);
      }
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a caption..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="flex justify-between">
        <button
          onClick={handleSubmitPost}
          disabled={!image || isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CreatePost;
