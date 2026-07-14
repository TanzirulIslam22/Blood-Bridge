import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { imgbbUpload } from '../../utils/imgbbUpload';

const AddBlog = () => {
  const { dbUser, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await imgbbUpload(file);
        setFormData(prev => ({ ...prev, thumbnail: url }));
        toast.success('Photo uploaded successfully');
      } catch (error) {
        toast.error('Photo upload failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/blogs', {
        ...formData,
        authorName: dbUser?.name || user?.displayName,
        authorEmail: dbUser?.email || user?.email
      });
      toast.success('Blog created successfully!');
      navigate('/dashboard/content-management');
    } catch (error) {
      toast.error('Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">Add New Blog Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#B09090] mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg"
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Content</label>
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              className="h-64 mb-12"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D62828] text-white py-3 rounded-lg hover:bg-[#FF2D2D] disabled:opacity-50 mt-16 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
