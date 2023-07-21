import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


type Post = {
    postid: number;
    title: string;
    body: string;
    comments: string[]; // Assuming comments is an array of strings
};

export default function Home() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/db/posts');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const fetchedPosts = data.posts || [];

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



    const renderComments = (postId: any) => {
        const postComments = posts[parseInt(postId) - 1]?.comments || [];

        console.log('Post ID:', postId);
        console.log('Post Comments:', postComments);

        if (postComments.length === 0) {
            return <p>No comments available for this post.</p>;
        }

        return (
            <ul>
                {postComments.map((comment, index) => (
                    <li key={index} className="bg-gray-200 p-2 rounded-lg">
                        {comment}
                    </li>
                ))}
            </ul>
        );
    };


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
                            <li key={post["postid"]} className="bg-gray-100 p-4 mb-4 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">{post["title"]}</h3>
                                <p className="text-gray-700">{post["body"]}</p>
                                <button onClick={() => setSelectedPostId(post.postid)} className="bg-blue-300">
                                    Show Comments
                                </button>
                                {selectedPostId === post.postid && renderComments(post.postid)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}    