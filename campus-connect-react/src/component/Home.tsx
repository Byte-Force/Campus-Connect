import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommentForm from './commentForm';
import axios from 'axios';
import LikeButton from './likebutton';


type Post = {
    postid: number;
    title: string;
    body: string;
    comments: string[]; // Assuming comments is an array of strings
};

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const [posts, setPosts] = useState<Post[]>([]);
    const [userid, setUserid] = useState<number>(0);
    const [username, setUsername] = useState('');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);





    // const checkLoginStatus = async () => {
    //     try {
    //         const response = await axios.get(
    //             'http://localhost:3000/db/check_login',
    //             { withCredentials: true }
    //         );
    //         setIsLoggedIn(response.data.loggedIn);
    //         // Set the username state if the user is logged in
    //         if (response.data.loggedIn) {
    //             setUsername(response.data.userName);
    //         }
    //         console.log('Username has changed:', response.data.userName);
    //     } catch (error) {
    //         console.error('Error checking login status:', error);
    //     }
    // };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/db/posts');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const fetchedPosts = data.posts || [];
                        //console.log('Fetched posts:', fetchedPosts);
                        setPosts(fetchedPosts);
                        setComments(fetchedPosts.map((post: any) => post.comments)); // assuming comments is a property on each post

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

        updateSessionData();
    }, [location.state]);



    function updateSessionData() {
        const sessionData = location.state?.sessionData;
        console.log('Session Data:', sessionData);
        if (sessionData?.success) {
            setUsername(sessionData.userName);
            setUserid(sessionData.user_id);
        }
    }


    const handleNewComment = async (postId: string, comment: string): Promise<void> => {
        try {
            // API call to save the comment
            const response = await fetch('http://localhost:3000/db/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, commentBody: comment }),
            });

            if (response.ok) {
                const updatedComments = [...comments];
                updatedComments[parseInt(postId) - 1].push(comment); // assuming postId starts from 1
                setComments(updatedComments);
                console.log('Comment created successfully!');
            } else {
                console.error('Failed to create comment.');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };





    const renderComments = (postId: number): JSX.Element => {
        const postComments = comments[postId - 1] || [];  // assuming postId starts from 1

        if (postComments.length === 0) {
            return <p>No comments available for this post.</p>;
        }

        return (
            <ul>
                {postComments.map((comment: string, index: number) => (
                    <li key={index} className="bg-gray-200 p-2 rounded-lg">
                        {comment}
                    </li>
                ))}
            </ul>
        );
    };

    const handleDelete = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/db/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Post deleted successfully!');
                setPosts((prevPosts) => prevPosts.filter((post) => post.postid !== postId));
            } else {
                console.error('Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            // Handle error (e.g., show an error message)
        }
    };




    const handleLike = async (postId: number) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/db/like',
                {
                    userId: userid, // Replace with the actual userId of the current user
                    postId: postId,
                },
                { withCredentials: true }
            );

            console.log('Like response:', response.data);
            console.log(response.data.message);

            // Refresh the posts after the like action (optional)

        } catch (error) {
            console.error('Error occurred during like:', error);
        }
    };

    function handlePost() {
        console.log('Post');

        navigate('/create-post', { state: { userid: userid } });
    }

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-4">Hello {username}, Userid : {userid}</h1> */}
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
                                <LikeButton postId={post["postid"]} onLike={() => handleLike(post.postid)} />

                                {/* Add the Delete button */}
                                <button onClick={() => handleDelete(post["postid"])} className="bg-red-300">
                                    Delete
                                </button>

                                {selectedPostId === post.postid && (
                                    <>
                                        {renderComments(post.postid)}
                                        <CommentForm
                                            postId={post.postid.toString()}
                                            onClose={() => setSelectedPostId(null)}
                                            onSave={handleNewComment}
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