const Rating = ({ value, className = "" }) => {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] whitespace-nowrap ${className}`}
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/bde9493d25ce464797f593ad6ddaebdc/b99bd7539683a894a0032aa2018e94eac60dee0e?placeholderIfAbsent=true"
        alt={`${value} out of 5 stars`}
        className="aspect-[1] object-contain w-[10px] shrink-0 my-auto"
      />
      <p>{value.toFixed(1)}</p>
    </div>
  );
};

const ProductImage = ({ src, alt }) => {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="aspect-[0.89] object-contain w-full"
        loading="lazy"
      />
    </div>
  );
};

const ProductDetails = ({ name, rating, price }) => {
  return (
    <div className="bg-white border-slate-200 flex w-full flex-col overflow-hidden text-sm text-slate-900 font-medium leading-6 px-[15px] py-2.5 border-t">
      <h3 className="font-bold z-10">{name}</h3>
      <Rating value={rating} className="mt-[-5px]" />
      <div className="text-[rgba(0,152,85,1)] text-right mt-[33px]">
        {price.toFixed(2)} บาท
      </div>
    </div>
  );
};

export const SimpleProductDetails = ({ name, id }) => {
  return (
    <div className="flex flex-col items-start pt-2 pr-8 pb-5 pl-3 bg-white border-solid border-slate-200 border-t">
      <h2 className="text-sm font-bold leading-6 text-slate-900">{name}</h2>
      <p className="text-xs font-medium text-slate-600">ID: {id}</p>
    </div>
  );
};

export const ProductCard = ({ product, variant = "default" }) => {
  if (variant === "simple") {
    return (
      <article className="overflow-hidden rounded-xl border border-solid border-slate-200 max-w-[196px]">
        <img
          src={product.imageUrl}
          alt={`Product image of ${product.name}`}
          className="object-contain w-full aspect-square"
        />
        <SimpleProductDetails name={product.name} id={product.id} />
      </article>
    );
  }

  // Default variant
  return (
    <article className="border-slate-200 border max-w-44 overflow-hidden rounded-[10px] border-solid hover:shadow-lg hover:shadow-slate-700/5 transition-shadow duration-200 cursor-pointer">
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductDetails
        name={product.name}
        rating={product.rating}
        price={product.price}
      />
    </article>
  );
};

export default ProductCard;
