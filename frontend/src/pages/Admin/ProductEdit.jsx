import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import InputField from "../../components/forms/InputField";
import Toggle from "../../components/common/Toggle";
import TagInput from "../../components/forms/TagInput";
import { ImageItem, ImageItemGroup } from "../../components/common/ImageItem";
import { Trash2 } from "lucide-react";

const ProductEditPage = () => {
  // Get productId from URL
  const { productId } = useParams();
  const fileInputRef = useRef(null);

  // Breadcrumb setup for the MainLayout
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stock Management", href: "/admin/inventory/stock-management" },
    { label: "เพียวรีน มิกซ์เบอร์รี่", href: "#" },
  ];

  // Product form state
  const [formData, setFormData] = useState({
    productName: "เพียวรีน มิกซ์เบอร์รี่",
    productId: productId || "000001",
    manufacturer: "TCP Group",
    description: "เครื่องดื่มน้ำผลไม้รสมิกซ์เบอร์รี่ สูตรไม่มีน้ำตาล",
    price: "15.00",
    inventory: "500",
    isAvailable: true,
    categories: ["เครื่องดื่ม", "น้ำผลไม้"],
    images: [],
  });

  // Set up sample images for ImageItemGroup
  const [productImages, setProductImages] = useState([
    {
      id: 1,
      src: "https://www.tcp.com/storage/content/product/tea-and-fruit-juice/puriku/puriku-2.png",
      alt: "Product 1",
      // No icon by default - will be shown on hover with CSS
    },
    {
      id: 2,
      src: "https://www.tcp.com/storage/content/product/tea-and-fruit-juice/puriku/puriku-2.png",
      alt: "Product 2",
      // No icon by default - will be shown on hover with CSS
    },
    {
      id: 3,
      src: "https://www.tcp.com/storage/content/product/tea-and-fruit-juice/puriku/puriku-2.png",
      alt: "Product 3",
      // No icon by default - will be shown on hover with CSS
    },
  ]);

  // Fetch product data based on productId
  useEffect(() => {
    if (productId) {
      // Here you would typically fetch the product data from your API
      console.log(`Fetching product data for ID: ${productId}`);
      // For now, we'll use the default state
    }
  }, [productId]);

  // Handle all input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Category management
  const handleAddCategory = (category) => {
    if (category && !formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const handleRemoveCategory = (index) => {
    const newCategories = [...formData.categories];
    newCategories.splice(index, 1);
    setFormData({ ...formData, categories: newCategories });
  };

  // Image handling functions
  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Create a URL for the file preview
      const imageUrl = URL.createObjectURL(file);

      // Add new image to productImages state
      setProductImages((prevImages) => [
        ...prevImages,
        {
          id: Date.now() + Math.random(), // Generate unique ID
          src: imageUrl,
          alt: file.name,
          file: file, // Store the actual file for upload
          onDelete: () => handleDeleteImage(Date.now() + Math.random()),
        },
      ]);
    });

    // Reset file input
    e.target.value = null;
  };

  const handleDeleteImage = (imageId) => {
    setProductImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId)
    );
  };

  // Custom ImageItem with hover delete functionality
  const ImageItemWithHoverDelete = ({ image, width, height, variant }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ImageItem
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          variant={variant}
          icon={isHovered ? Trash2 : null}
          onDelete={() => handleDeleteImage(image.id)}
        />
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare images for submission
    const imagesToUpload = productImages
      .filter((image) => image.file) // Only get images with actual files
      .map((image) => image.file);

    console.log("Saving product:", formData);
    console.log("Images to upload:", imagesToUpload);

    // Here you would typically upload the images and save the product data
    // For example:
    // const formDataToSubmit = new FormData();
    // formDataToSubmit.append('productData', JSON.stringify(formData));
    // imagesToUpload.forEach((file, index) => {
    //   formDataToSubmit.append(`image-${index}`, file);
    // });
    // fetch('/api/products', { method: 'POST', body: formDataToSubmit });
  };

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Products Editor">
      <form onSubmit={handleSubmit} className="mb-10">
        {/* Top section - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div>
            {/* General Information Section */}
            <div className="p-6 bg-white rounded-lg border border-slate-200 h-full">
              <h2 className="text-xl font-semibold mb-4">
                General Information
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Product Name"
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                  placeholder="Product Name"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Product ID"
                    value={formData.productId}
                    onChange={(e) =>
                      handleInputChange("productId", e.target.value)
                    }
                    placeholder="000001"
                  />
                  <InputField
                    label="Manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      handleInputChange("manufacturer", e.target.value)
                    }
                    placeholder="Manufacturer"
                  />
                </div>

                <InputField
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Description ..."
                  isTextarea={true}
                  rows={8}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Pricing & Inventory Section */}
            <div className="p-6 bg-white rounded-lg border border-slate-200 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Pricing & Inventory
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Price (THB)"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Price (THB)"
                  type="number"
                />

                <InputField
                  label="Inventory Quantity"
                  value={formData.inventory}
                  onChange={(e) =>
                    handleInputChange("inventory", e.target.value)
                  }
                  placeholder="Inventory Quantity"
                  type="number"
                />

                <Toggle
                  label="Product Availability"
                  checked={formData.isAvailable}
                  onChange={(value) => handleInputChange("isAvailable", value)}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="mb-2">Product categories</div>
              <TagInput
                tags={formData.categories}
                onAddTag={handleAddCategory}
                onRemoveTag={handleRemoveCategory}
                placeholder="Add a category..."
              />
            </div>
          </div>
        </div>

        {/* Bottom section - Full width */}
        <div className="w-full">
          {/* Product Media Section */}
          <div className="p-6 bg-white rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Product Media</h2>
            <div className="mb-4">Product Images</div>

            {/* Hidden file input for image upload */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

            {/* Custom image group with hover delete */}
            <div className="flex flex-wrap gap-3">
              {productImages.map((image, index) => (
                <ImageItemWithHoverDelete
                  key={index}
                  image={image}
                  width={96}
                  height={96}
                  variant="square"
                />
              ))}

              {/* Add Image button */}
              <div
                className="flex items-center justify-center border-2 border-dashed border-slate-200 cursor-pointer rounded-md"
                style={{ width: "96px", height: "96px" }}
                onClick={handleAddImage}
              >
                <div className="flex flex-col items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="text-slate-500 mb-1"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <span className="text-xs text-slate-500">Add Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Save Product
          </button>
        </div>
      </form>
    </MainLayout>
  );
};

export default ProductEditPage;
