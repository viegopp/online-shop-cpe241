import React from "react";

const Badge = ({ icon: Icon, title, description }) => {
  return (
    <article className="text-xs font-medium w-[274px] text-slate-500">
      <div className="flex gap-4 px-4 py-4 bg-white rounded-xl border border-solid border-slate-200">
        <div className="shrink-0 w-9 h-9 flex items-center justify-center">
          <Icon className="text-slate-500" size={36} strokeWidth={1.6} />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-slate-700 text-[16px] font-semibold">{title}</h3>
          <p className="grow shrink self-start w-[177px]">{description}</p>
        </div>
      </div>
    </article>
  );
};

export default Badge;

/*
Example Usage:
<Badge
  icon={SomeIcon}
  title="Sample Title"
  description="This is a sample description for the badge."
/>
*/
