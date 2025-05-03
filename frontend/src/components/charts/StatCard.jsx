import React from "react";
import { Users, Minus, ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ icon, title, value, changeType, changeValue }) => {
  return (
    <div className="bg-white rounded-2xl p-4.5 w-full border border-slate-200">
      <div className="flex items-end justify-between">
        <div>
          <div className="bg-slate-100 w-13 h-13 rounded-[10px] flex items-center justify-center">
            {icon}
          </div>
          <div className="mt-6">
            <p className="text-slate-600 text-sm font-medium">{title}</p>
            <div className="mt-1">
              <h2 className="text-3xl font-extrabold">{value}</h2>
            </div>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            changeType === "positive"
              ? "bg-green-50"
              : changeType === "negative"
              ? "bg-red-50"
              : "bg-slate-50"
          }`}
        >
          {changeType === "positive" && (
            <ArrowUp className="w-3 h-3 text-green-600" />
          )}
          {changeType === "negative" && (
            <ArrowDown className="w-3 h-3 text-red-500" />
          )}
          {changeType === "neutral" && <Minus className="w-3 h-3" />}
          <p
            className={`font-medium text-xs ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                ? "text-red-500"
                : "text-slate-700"
            }`}
          >
            {changeValue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
