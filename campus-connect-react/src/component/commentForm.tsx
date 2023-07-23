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

    const handleSave = () => {
        onSave(postId, comment);
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
                <button onClick={handleSave}>Save Comment</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CommentForm;
