import React, { useState } from 'react';

// Define prop types for the component
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
                // Additional logic here, e.g., redirect to another page
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
                <textarea
                    rows={4}
                    cols={50}
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={handleInputChange}
                />
                <button onClick={handleSave}>Comment</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CommentForm;
