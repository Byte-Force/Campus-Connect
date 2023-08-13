import React, { useState } from 'react';




// This code is a React component that displays a form for adding a comment to a post.
// The component takes in a postId, and onClose and onSave functions.
// The component renders a text area and a button.
// The text area allows the user to enter a comment.
// The button allows the user to submit the comment.
// When the user clicks the button, the component calls the onSave function with the postId and the comment.
// When the user clicks the button, the component calls the onClose function.

type CommentFormProps = {
    postId: string; // You can change 'string' to the appropriate data type for postId
    onClose: () => void;
    onSave: (postId: string, comment: string) => void; // You can change 'string' to the appropriate data type for postId and comment
};



const CommentForm: React.FC<CommentFormProps> = ({ postId, onClose, onSave }) => {
    const [comment, setComment] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const handleSave = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onSave(postId, comment);
        try {
            const response = await fetch('http://localhost:3000/db/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ postId, commentBody: comment }),
            });

            if (response.ok) {
                console.log('Comment created successfully!');
            } else {
                console.error('Failed to create comment.');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }

        setComment('');
        onClose();
    };
    return (
        <div className="popup">
            <div className="popup-inner">
                <h3>Add a Comment</h3>
                <div className="w-full">
                    <textarea
                        rows={4}
                        cols={50}
                        placeholder="Write your comment here..."
                        value={comment}
                        onChange={handleInputChange}
                        className="w-full" // Set the textarea width to 100% of its container
                    />
                </div>
                <div className="flex justify-end mt-4">
                    {/* Comment Button */}
                    <button onClick={handleSave} className="bg-blue-300 px-4 py-2 rounded-lg mr-2">
                        Comment
                    </button>
                    {/* Cancel Button */}
                    <button onClick={onClose} className="bg-red-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

};

export default CommentForm;
