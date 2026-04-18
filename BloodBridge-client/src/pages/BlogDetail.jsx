import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!blog) return <div className="text-center py-12">Blog not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {blog.thumbnail && (
          <img 
            src={blog.thumbnail} 
            alt={blog.title} 
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span>By {blog.authorName || 'Admin'}</span>
          <span>|</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-8">
          <Link 
            to="/blog" 
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
