import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [], title = "Dashboard" }) => {
  if (!items || items.length === 0) {
    items = [
      { label: "Home", path: "/" },
      { label: title, path: "#" },
    ];
  }

  return (
    <div className="flex justify-between items-center w-full mx-auto my-4">
      <h1 className="font-satoshi font-bold text-xl text-slate-900">{title}</h1>
      <nav className="flex items-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-slate-400 font-satoshi text-base">/</span>
            )}
            {index === items.length - 1 ? (
              <span className="text-slate-600 font-satoshi text-sm font-normal">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-slate-400 font-satoshi text-sm font-normal hover:text-slate-600"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumbs;

/*
Example Usage:
<Breadcrumbs
  items={[
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
  ]}
  title="Product List"
/>
*/
