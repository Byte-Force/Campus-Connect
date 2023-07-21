import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/db/posts');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const fetchedPosts = data.posts || [];
                        console.log('Fetched posts:', fetchedPosts);
                        setPosts(fetchedPosts);
                    } else {
                        console.error('Failed to fetch posts:', data);
                    }
                } else {
                    console.error('Failed to fetch posts:', response.status);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    function handlePost() {
        console.log('Post');
        navigate('/create-post');
    }

    return (
        <div>
            <button onClick={handlePost} className="bg-blue-300">
                Post
            </button>

            <div>
                <h2 className="text-2xl font-bold mb-4">All Posts</h2>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <ul>
                        {posts.map((post) => (
                            <li key={post["_id"]} className="bg-gray-100 p-4 mb-4 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">{post["title"]}</h3>
                                <p className="text-gray-700">{post["body"]}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
