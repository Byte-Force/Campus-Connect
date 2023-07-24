import React, { useState } from "react";
import Like from "../image/thumbs.png";
import Liked from "../image/like.png";


type LikeButtonProps = {
  postId: number;
  onLike: () => Promise<void>;
};



const LikeButton: React.FC<LikeButtonProps> = ({ onLike }) => {
  const [isLiked, setIsLiked] = useState(false);


  const handleClick = async () => {
    try {
      // Call the onLike callback to handle the like action and update the database
      await onLike();

      // Update the state to toggle the Like button's appearance
      setIsLiked((prevIsLiked) => !prevIsLiked);
    } catch (error) {
      console.error('Error occurred during like:', error);
    }
  };

  const buttonClasses = `text-black font-bold text-xl flex flex-col ${isLiked ? "bg-red-500 text-white" : "text-black"
    }`;

  // Styles for the images
  const imgStyles = {
    width: "30px", // Set the desired width
    height: "30px", // Set the desired height
    filter: isLiked ? "none" : "grayscale(100%)", // Apply grayscale filter if not liked
    marginRight: "10px", // Add some spacing between the image and text (optional)
  };

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {isLiked ? (
        <img src={Liked} alt="Liked" style={imgStyles} />
      ) : (
        <img src={Like} alt="Like" style={imgStyles} />
      )}
      {/* {isLiked ? "Liked" : "Like"} */}
    </button>
  );
};

export default LikeButton;
