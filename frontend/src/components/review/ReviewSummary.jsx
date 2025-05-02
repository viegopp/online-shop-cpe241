import React from "react";
import { Star } from "lucide-react";

const ReviewSummary = ({
  rating = 4.2,
  totalReviews = 125,
  ratingBreakdown = [
    { stars: 5, count: 78 },
    { stars: 4, count: 25 },
    { stars: 3, count: 12 },
    { stars: 2, count: 6 },
    { stars: 1, count: 4 },
  ],
}) => {
  const getPercentage = (count) => {
    return (count / totalReviews) * 100;
  };

  return (
    <div className="flex w-full max-w-[700px] h-[272px] p-6 border border-gray-200 rounded-lg bg-white font-satoshi">
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="text-5xl font-black text-slate-700">{rating}</div>
        <div className="mt-4 text-base font-medium text-gray-500">
          Based on {totalReviews} reviews
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              fill={star <= Math.floor(rating) ? "#FFDF20" : "none"}
              stroke="#FFDF20"
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
      <div className="w-2/3 pl-6 space-y-2.5 flex flex-col justify-center">
        {ratingBreakdown.map((item) => (
          <div key={item.stars} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Star
                  size={12}
                  className="text-yellow-300"
                  fill="#FFDF20"
                  stroke="#FFDF20"
                />
                <span className="ml-1 text-xs font-medium">{item.stars}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {item.count} reviews
              </span>
            </div>
            <div className="w-full h-3.5 bg-gray-100 rounded">
              <div
                className="h-3.5 bg-gray-600 rounded"
                style={{ width: `${getPercentage(item.count)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;

/*
Example Usage:
<ReviewSummary
  rating={4.5}
  totalReviews={200}
  ratingBreakdown={[
    { stars: 5, count: 120 },
    { stars: 4, count: 50 },
    { stars: 3, count: 20 },
    { stars: 2, count: 5 },
    { stars: 1, count: 5 },
  ]}
/>
*/
