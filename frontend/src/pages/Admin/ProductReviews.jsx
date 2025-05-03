import { useState, useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ProductCard from "../../components/product/ProductCard";
import TableToolbar from "../../components/tables/TableToolbar";
import ReviewSummary from "../../components/review/ReviewSummary";
import ReviewManage from "../../components/review/ReviewManage";

import Pagination from "../../components/tables/Pagination";
import { Reply, Trash2, Star } from "lucide-react";
import { useParams } from "react-router-dom";

export const ProductReviewLandingPage = () => {
  // Breadcrumb setup
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products & Reviews", href: "/products-reviews" },
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Generate sample products
  const generateProducts = () => {
    const products = [];
    const productNames = [
      "เพียวรีน มิกซ์เบอร์รี่",
      "เพียวรีน น้ำส้ม",
      "เพียวรีน น้ำแอปเปิ้ล",
      "เพียวรีน น้ำองุ่น",
      "เพียวรีน ชาเขียว",
      "เพียวรีน ชาดำ",
      "เพียวรีน กาแฟ",
      "เพียวรีน โกโก้",
      "เพียวรีน ชานม",
      "เพียวรีน นมสด",
    ];

    for (let i = 1; i <= 50; i++) {
      const randomName =
        productNames[Math.floor(Math.random() * productNames.length)];
      const randomPrice = (Math.random() * 50 + 10).toFixed(2);
      const randomRating = (Math.random() * 3 + 2).toFixed(1);

      products.push({
        id: i,
        name: `${randomName} #${i}`,
        price: parseFloat(randomPrice),
        imageUrl:
          "https://www.tcp.com/storage/content/product/tea-and-fruit-juice/puriku/puriku-2.png",
        rating: parseFloat(randomRating),
      });
    }
    return products;
  };

  // Initialize products
  useEffect(() => {
    const products = generateProducts();
    setAllProducts(products);
    setFilteredProducts(products);
  }, []);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching

    if (!term.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  // Handle filter
  const handleFilter = () => {
    // Implement your filter logic here
    console.log("Filter clicked");
  };

  // Handle add product
  const handleAddProduct = () => {
    console.log("Add product clicked");
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Products & Reviews">
      <div className="flex flex-col gap-4">
        {/* Search and Filter Toolbar */}
        <TableToolbar
          onSearch={handleSearch}
          searchPlaceHolder="products"
          onFilter={handleFilter}
          onAddItem={handleAddProduct}
          itemName="Product"
        />

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 bg-slate-50 rounded-lg">
            <p className="text-slate-500">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={productsPerPage}
              totalItems={filteredProducts.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export const ProductReviewDetailPage = () => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    rating: 0, // 0 means all ratings
    hasReply: false,
    sortBy: "date", // "date", "rating"
  });

  // State for reply modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [product, setProduct] = useState({
    id: productId || "000001",
    name: "เพียวรีน มิกซ์เบอร์รี่",
    price: 15.0,
    imageUrl:
      "https://www.tcp.com/storage/content/product/tea-and-fruit-juice/puriku/puriku-2.png",
    rating: 4.2,
    totalReviews: 125,
    ratingBreakdown: [
      { stars: 5, count: 78 },
      { stars: 4, count: 25 },
      { stars: 3, count: 12 },
      { stars: 2, count: 6 },
      { stars: 1, count: 4 },
    ],
  });

  useEffect(() => {
    const sampleReviews = [
      {
        id: 1,
        customerId: "103",
        userName: "Mooham Chugra",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "สินค้าดีมาก รสชาติดี สดชื่น คุณภาพคุ้มราคา จะมาอุดหนุนอีกแน่นอน",
        rating: 5,
        date: "12 Apr 2025",
        adminReply:
          "ขอบคุณสำหรับคำชมและการสนับสนุนค่ะ ทางเรามุ่งรักษามาตรฐานคุณภาพให้ดีที่สุด",
      },
      {
        id: 2,
        customerId: "87",
        userName: "Jane Smith",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "รสชาติไม่ดี แต่บรรจุภัณฑ์ดี อาจจะดีขึ้นถ้าลดความหวานลงอีกหน่อย",
        rating: 3,
        date: "03 Apr 2025",
        adminReply: "",
      },
      {
        id: 3,
        customerId: "156",
        userName: "John Doe",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "อร่อยดี แนะนำให้ลอง สดชื่นมากและดีต่อสุขภาพมาก",
        rating: 4,
        date: "28 Mar 2025",
        adminReply: "",
      },
      {
        id: 4,
        customerId: "212",
        userName: "Alice Johnson",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "รสชาติดีมาก แต่ราคาสูงไปหน่อย อยากให้มีแพ็คประหยัดมากกว่านี้",
        rating: 4,
        date: "20 Mar 2025",
        adminReply: "",
      },
      {
        id: 5,
        customerId: "178",
        userName: "Robert Williams",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "รสชาติเยี่ยม บรรจุภัณฑ์ดูดี ซื้อเป็นของฝากได้ ประทับใจมาก",
        rating: 5,
        date: "15 Mar 2025",
        adminReply: "",
      },
      {
        id: 6,
        customerId: "199",
        userName: "Sarah Parker",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "ไม่ชอบเลย รสชาติประหลาด ไม่เหมือนที่โฆษณา ผิดหวังมาก",
        rating: 1,
        date: "10 Mar 2025",
        adminReply:
          "ขออภัยในความไม่พึงพอใจ เราจะนำความคิดเห็นไปปรับปรุงสินค้าให้ดีขึ้นค่ะ",
      },
      {
        id: 7,
        customerId: "205",
        userName: "Emily Davis",
        productName: "เพียวรีน มิกซ์เบอร์รี่",
        text: "ดีมาก ทานแล้วรู้สึกสดชื่น อยากให้มีรสชาติอื่นๆ เพิ่มด้วย",
        rating: 5,
        date: "05 Mar 2025",
        adminReply: "",
      },
    ];

    setReviews(sampleReviews);
    setFilteredReviews(sampleReviews);
  }, []);

  useEffect(() => {
    let result = [...reviews];

    // Apply search term
    if (searchTerm.trim()) {
      result = result.filter(
        (review) =>
          review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rating filter
    if (filterOptions.rating > 0) {
      result = result.filter(
        (review) => review.rating === filterOptions.rating
      );
    }

    // Apply reply filter
    if (filterOptions.hasReply) {
      result = result.filter(
        (review) => review.adminReply && review.adminReply.trim() !== ""
      );
    }

    // Apply sorting
    if (filterOptions.sortBy === "date") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filterOptions.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredReviews(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterOptions, reviews]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  const paginatedReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products & Reviews", href: "/admin/inventory/products-reviews" },
    { label: product.name, href: "#" },
  ];

  const handleDeleteReview = (comment) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmed) {
      setReviews(reviews.filter((review) => review.id !== comment.id));
    }
  };

  const handleReply = (comment) => {
    setSelectedComment(comment);
    setReplyText(comment.adminReply || "");
    setReplyModalOpen(true);
  };

  const handleSaveReply = () => {
    if (selectedComment) {
      const updatedReviews = reviews.map((review) => {
        if (review.id === selectedComment.id) {
          return { ...review, adminReply: replyText };
        }
        return review;
      });
      setReviews(updatedReviews);
      setReplyModalOpen(false);
      setSelectedComment(null);
      setReplyText("");
    }
  };

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Product & Reviews">
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <ProductCard product={product} variant="simple" />
          <ReviewSummary
            rating={product.rating}
            totalReviews={product.totalReviews}
            ratingBreakdown={product.ratingBreakdown}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <TableToolbar
              onSearch={handleSearch}
              searchPlaceHolder="reviews"
              onFilter={handleFilter}
            />

            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-center">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Rating
                  </div>
                  <div className="flex gap-2">
                    {[0, 5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        className={`px-2 py-1 text-xs rounded-md ${
                          filterOptions.rating === rating
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                        onClick={() =>
                          setFilterOptions({ ...filterOptions, rating })
                        }
                      >
                        {rating === 0 ? (
                          "All"
                        ) : (
                          <div className="flex items-center">
                            {rating}
                            <Star
                              size={12}
                              className="ml-1"
                              fill="#FFDF20"
                              stroke="#FFDF20"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Reply Status
                  </div>
                  <button
                    className={`px-2 py-1 text-xs rounded-md ${
                      filterOptions.hasReply
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                    onClick={() =>
                      setFilterOptions({
                        ...filterOptions,
                        hasReply: !filterOptions.hasReply,
                      })
                    }
                  >
                    Has Reply
                  </button>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Sort By
                  </div>
                  <select
                    className="text-xs px-2 py-1 rounded-md border border-slate-200"
                    value={filterOptions.sortBy}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        sortBy: e.target.value,
                      })
                    }
                  >
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            )}

            <ReviewManage
              comments={paginatedReviews}
              onDelete={handleDeleteReview}
              onReply={handleReply}
            />

            {replyModalOpen && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-medium mb-4">
                    Reply to Customer
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm mb-2">
                      <span className="font-medium">Customer ID:</span>{" "}
                      {selectedComment?.customerId}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Review:</span>{" "}
                      {selectedComment?.text}
                    </p>
                  </div>
                  <textarea
                    className="w-full border border-slate-200 rounded-md p-3 text-sm mb-4"
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-sm cursor-pointer"
                      onClick={() => setReplyModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 bg-slate-600 text-white rounded-md text-sm cursor-pointer"
                      onClick={handleSaveReply}
                    >
                      Save Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredReviews.length > 0 && (
              <Pagination
                currentPage={currentPage}
                itemsPerPage={reviewsPerPage}
                totalItems={filteredReviews.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
