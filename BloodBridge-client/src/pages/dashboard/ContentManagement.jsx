import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const ContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/all`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}/publish`);
      setBlogs(blogs.map(b => b._id === id ? { ...b, status: 'published' } : b));
      toast.success('Blog published successfully');
    } catch (error) {
      toast.error('Failed to publish blog');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}/unpublish`);
      setBlogs(blogs.map(b => b._id === id ? { ...b, status: 'draft' } : b));
      toast.success('Blog unpublished successfully');
    } catch (error) {
      toast.error('Failed to unpublish blog');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`);
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success('Blog deleted successfully');
        } catch (error) {
          toast.error('Failed to delete blog');
        }
      }
    });
  };

  return (
<div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : blogs.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 font-medium">{blog.title}</td>
                  <td className="px-6 py-4">{blog.authorName || 'Admin'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {blog.status === 'draft' ? (
                        <button
                          onClick={() => handlePublish(blog._id)}
                          className="text-green-600 hover:underline"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(blog._id)}
                          className="text-yellow-600 hover:underline"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts yet</p>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
