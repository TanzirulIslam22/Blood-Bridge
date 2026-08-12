import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const ContentManagement = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blogs/all');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.put(`/api/blogs/${id}/publish`);
      setBlogs(blogs.map(b => b._id === id ? { ...b, status: 'published' } : b));
      toast.success(t('dashboard.blogPublished'));
    } catch (error) {
      toast.error(t('dashboard.publishFailed'));
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await axios.put(`/api/blogs/${id}/unpublish`);
      setBlogs(blogs.map(b => b._id === id ? { ...b, status: 'draft' } : b));
      toast.success(t('dashboard.blogUnpublished'));
    } catch (error) {
      toast.error(t('dashboard.unpublishFailed'));
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: t('dashboard.deleteTitle'),
      text: t('dashboard.deleteText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('dashboard.delete'),
      cancelButtonText: t('dashboard.cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/blogs/${id}`);
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success(t('dashboard.blogDeleted'));
        } catch (error) {
          toast.error(t('dashboard.deleteBlogFailed'));
        }
      }
    });
  };

  return (
<div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#F5E6E0]">{t('dashboard.contentManagementTitle')}</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : blogs.length > 0 ? (
        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#150A0A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.title')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.author')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 font-medium text-[#F5E6E0]">{blog.title}</td>
                  <td className="px-6 py-4 text-[#F5E6E0]">{blog.authorName || t('dashboard.authorFallback')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${blog.status === 'published' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(255,255,255,0.08)] text-[#B09090]'}`}>
                      {blog.status === 'published' ? t('dashboard.published') : t('dashboard.draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#F5E6E0]">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {blog.status === 'draft' ? (
                        <button
                          onClick={() => handlePublish(blog._id)}
                          className="text-green-400 hover:underline"
                        >
                          {t('dashboard.publish')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(blog._id)}
                          className="text-yellow-400 hover:underline"
                        >
                          {t('dashboard.unpublish')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-400 hover:underline"
                      >
                        {t('dashboard.delete')}
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
          <p className="text-[#B09090]">{t('dashboard.noBlogs')}</p>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
