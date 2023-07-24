import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentForm from './commentForm';
import axios from 'axios';


type Post = {
    postid: number;
    title: string;
    body: string;
    comments: string[]; // Assuming comments is an array of strings
};

export default function Home() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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

        const checkLoginStatus = async () => {
            const response = await axios.get(
                'http://localhost:3000/db/check_login',
                { withCredentials: true }
            );

            setIsLoggedIn(response.data.loggedIn);
            setUsername(response.data.userName);
            console.log('Username has changed:', username);
        };



        fetchPosts();
        checkLoginStatus();
    }, [username]);


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

    function handlePost() {
        console.log('Post');
        navigate('/create-post');
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Hello {username}</h1>
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
                                    {post.comments.length} Show Comments
                                </button>

                                {selectedPostId === post.postid && (
                                    <>
                                        {renderComments(post.postid)}
                                        <CommentForm
                                            postId={post.postid.toString()}
                                            onClose={() => setSelectedPostId(null)}
                                            onSave={(postId, comment) => {
                                                // Code to handle saving the comment goes here
                                                // For example, you might call a function to save the comment to a database or perform other actions
                                                // For demonstration purposes, let's log the postId and comment to the console
                                                console.log('postId:', postId);
                                                console.log('comment:', comment);
                                            }}
                                        />
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}    