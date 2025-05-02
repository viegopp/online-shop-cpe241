import React from "react";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  const { userName, productName, reviewText, rating } = review;

  return (
    <div className="w-full p-3 bg-slate-50 rounded mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-xs">{userName}</span>
        <span className="text-[10px] text-black">{productName}</span>
      </div>
      <div className="flex w-full justify-between">
        <p className="text-[10px] mb-1">{reviewText}</p>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={10}
              fill="#FFDF20"
              stroke="#FFDF20"
              strokeWidth={1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReviewsBox = ({ reviews = [] }) => {
  // Default reviews if none provided
  const defaultReviews = [
    {
      id: 1,
      userName: "Mooham 1",
      productName: "เพียวริคุ มิกซ์เบอรรี่",
      reviewText:
        "ลองดื่มแล้ว เสพติดมากครับ อยากดื่มอีกใจจะขาด #เพียวริคุเพื่อชีวิต",
      rating: 5,
    },
    {
      id: 2,
      userName: "Mooham 1",
      productName: "เพียวริคุ มิกซ์เบอรรี่",
      reviewText:
        "ลองดื่มแล้ว เสพติดมากครับ อยากดื่มอีกใจจะขาด #เพียวริคุเพื่อชีวิต",
      rating: 5,
    },
    {
      id: 3,
      userName: "Mooham 1",
      productName: "เพียวริคุ มิกซ์เบอรรี่",
      reviewText:
        "ลองดื่มแล้ว เสพติดมากครับ อยากดื่มอีกใจจะขาด #เพียวริคุเพื่อชีวิต",
      rating: 5,
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="w-[448px] h-[300px] p-7 rounded-2xl border border-slate-200 bg-white overflow-y-auto no-scrollbar">
      <h2 className="font-bold text-lg text-slate-900 mb-3 font-satoshi">
        Recent Product Reviews
      </h2>
      <div className="space-y-2">
        {displayReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsBox;

/*
Example Usage:
<ReviewsBox
  reviews={[
    {
      id: 1,
      userName: "Mooham 1",
      productName: "เพียวริคุ มิกซ์เบอรรี่",
      reviewText:
        "ลองดื่มแล้ว เสพติดมากครับ อยากดื่มอีกใจจะขาด #เพียวริคุเพื่อชีวิต",
      rating: 5,
    },
    {
      id: 2,
      userName: "Mooham 1",
      productName: "เพียวริคุ มิกซ์เบอรรี่",
      reviewText:
        "ลองดื่มแล้ว เสพติดมากครับ อยากดื่มอีกใจจะขาด #เพียวริคุเพื่อชีวิต",
      rating: 5,
    },
  ]}
/>
*/
