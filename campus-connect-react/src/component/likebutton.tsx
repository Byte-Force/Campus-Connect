import React, { useState } from "react";

const LikeButton: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  const buttonClasses = `text-black font-bold text-xl flex flex-col ${
    isLiked ? "bg-blue-500 text-white" : "border border-blue-500 text-black" // Change "text-blue-500" to "text-black"
  }`;

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {isLiked ? "Liked" : "Like"}
    </button>
  );
};

export default LikeButton;
