import React from "react";
import { Star, CornerDownRight, Trash } from "lucide-react";

const ReviewManage = ({ comments = [], onReply, onDelete, className = "" }) => {
  return (
    <div
      className={`flex flex-col w-full max-w-[910px] bg-white border border-slate-200 rounded-lg p-6 gap-4 ${className}`}
    >
      {comments.map((comment) => (
        <div
          key={comment.customerId}
          className="flex flex-col rounded p-2 gap-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="flex gap-1 justify-center items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < comment.rating ? "#FFDF20" : "none"}
                    stroke="#FFDF20"
                    strokeWidth={1}
                  />
                ))}
              </div>
              <span className="font-bold text-xs text-black">
                CustomerID: {comment.customerId}
              </span>
              <span className="text-xs text-slate-400">{comment.date}</span>
            </div>
            <div className="flex items-center">
              <div className="flex gap-2 ml-2">
                {onReply && (
                  <button
                    onClick={() => onReply(comment)}
                    className="focus:outline-none"
                  >
                    <CornerDownRight size={14} className="text-slate-400" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(comment)}
                    className="focus:outline-none"
                  >
                    <Trash size={14} className="text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="font-normal text-sm text-black">{comment.text}</div>
          {comment.adminReply && (
            <div className="bg-slate-50 rounded px-3 py-2 flex flex-col gap-1">
              <span className="font-bold text-xs text-slate-500">
                Admin Reply:{" "}
              </span>
              <span className="font-normal text-xs text-black">
                {comment.adminReply}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewManage;

/*
Example Usage:
<ReviewManage 
    comments={comments}
    onReply={(comment) => console.log("Reply to:", comment)}
    onDelete={(comment) => console.log("Delete comment:", comment)}
/>
*/
