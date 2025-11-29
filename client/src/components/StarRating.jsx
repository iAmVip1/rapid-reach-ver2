import { useState } from "react";

const StarRating = ({ totalStars = 5, rating = 0, displayOnly = false, size = "w-8 h-8" }) => {
  const [interactiveRating, setInteractiveRating] = useState(0);
  
  // Use provided rating if displayOnly, otherwise use interactive rating
  const currentRating = displayOnly ? rating : interactiveRating;
  
  // Handle star hover and click (only if not displayOnly)
  const handleMouseEnter = (index) => {
    if (!displayOnly) setInteractiveRating(index);
  };
  const handleMouseLeave = () => {
    if (!displayOnly) setInteractiveRating(0);
  };
  const handleClick = (index) => {
    if (!displayOnly) setInteractiveRating(index);
  };

  // Calculate filled stars (can be decimal)
  const filledStars = Math.min(currentRating, totalStars);
  const fullStars = Math.floor(filledStars);
  const hasHalfStar = filledStars % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalStars }, (_, index) => {
        let starClass = "text-gray-300";
        if (index < fullStars) {
          starClass = "text-yellow-400";
        } else if (index === fullStars && hasHalfStar) {
          starClass = "text-yellow-300";
        }

        return (
          <svg
            key={index}
            className={`${size} ${displayOnly ? '' : 'cursor-pointer'} transition-all duration-200 ${starClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            onMouseEnter={displayOnly ? undefined : () => handleMouseEnter(index + 1)}
            onMouseLeave={displayOnly ? undefined : handleMouseLeave}
            onClick={displayOnly ? undefined : () => handleClick(index + 1)}
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
          </svg>
        );
      })}
      {displayOnly && (
        <span className="ml-2 text-sm font-semibold ">
          {rating.toFixed(1)}
        </span>
      )}
      {!displayOnly && (
        <span className="ml-2 text-lg font-semibold">{interactiveRating}</span>
      )}
    </div>
  );
};

export default StarRating;
