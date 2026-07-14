import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#F5E6E0]">Latest Blog Posts</h1>
      
      {blogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden hover:border-[rgba(214,40,40,0.3)] transition">
              {blog.thumbnail && (
                <img 
                  src={blog.thumbnail} 
                  alt={blog.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-[#F5E6E0]">{blog.title}</h2>
                <p className="text-[#B09090] mb-4 line-clamp-3">
                  {blog.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#B09090] text-sm">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/blog/${blog._id}`}
                    className="text-[#D62828] font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#B09090] text-lg">No blog posts available</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
