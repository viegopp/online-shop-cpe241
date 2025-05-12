import { useState, useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ProductCard from "../../components/product/ProductCard";
import TableToolbar from "../../components/tables/TableToolbar";
import ReviewSummary from "../../components/review/ReviewSummary";
import ReviewManage from "../../components/review/ReviewManage";
import apiClient from "../../api/AxiosInterceptor";
import Pagination from "../../components/tables/Pagination";
import { Reply, Trash2, Star } from "lucide-react";
import { useParams, useNavigate  } from "react-router-dom";

export const ProductReviewLandingPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    price_min: "",
    price_max: "",
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products & Reviews", href: "/products-reviews" },
  ];

  const fetchProducts = async (search = "", page = 1, filterState = filters) => {
    const { category, price_min, price_max } = filterState;
    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/review`, {
        params: {
          search,
          page,
          category,
          price_min,
          price_max,
        },
      });

      const productsFromAPI = response.data.data;

      const formatted = productsFromAPI.map((product) => ({
        id: product.product_id,
        name: product.name,
        price: parseFloat(product.price),
        imageUrl: product.thumbnail || "/images/default.jpg",
        rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      }));

      setAllProducts(formatted);
      setFilteredProducts(formatted);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchProducts(term, 1, filters);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchProducts(searchTerm, pageNumber, filters);
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchProducts(searchTerm, 1, filters);
  };

  const [showFilters, setShowFilters] = useState(false);
  const currentProducts = filteredProducts;

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Products & Reviews">
      <div className="flex flex-col gap-4">
        {/* Search Toolbar */}
      <div className="relative">
      <TableToolbar
        onSearch={handleSearch}
        searchPlaceHolder="products"
        onFilter={() => setShowFilters(!showFilters)}
        itemName="Product"
      />

    {showFilters && (
      <div className="absolute right-0 z-10 w-72 bg-white border border-slate-200 rounded shadow p-4 mt-2">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All</option>
            <option value="Beverage">Beverage</option>
            <option value="Merchandise">Merchandise</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Price Min</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              value={filters.price_min}
              onChange={(e) => handleFilterChange("price_min", e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Price Max</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              value={filters.price_max}
              onChange={(e) => handleFilterChange("price_max", e.target.value)}
              placeholder="e.g. 100"
            />
          </div>
          <button
            className="w-full bg-slate-800 text-white px-3 py-2 rounded text-sm"
            onClick={() => {
              setShowFilters(false);
              setCurrentPage(1);
              fetchProducts(searchTerm, 1, filters);
            }}
          >
            Apply Filter
          </button>
          </div>
          )}
        </div>


        {/* Product Grid */}
        {loading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/admin/inventory/products-reviews/${product.id}`)
                }
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 bg-slate-50 rounded-lg">
            <p className="text-slate-500">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={productsPerPage}
            totalItems={filteredProducts.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </MainLayout>
  );
};

export const ProductReviewDetailPage = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviewDetails = async (page = 1) => {
    try {
      const res = await apiClient.get(`/admin/review/${productId}?page=${page}`);
      const { summary, data, pagination } = res.data;

      setProduct({
        id: summary.product_id,
        name: summary.product_name,
        imageUrl: summary.thumbnail || "/images/default.jpg",
        rating: summary.average_rating,
        totalReviews: summary.total_reviews,
        ratingBreakdown: Object.entries(summary.breakdown).map(([star, count]) => ({
          stars: parseInt(star),
          count,
        })),
      });

      setReviews(
        data.map((r, i) => ({
          id: `${r.customer_id}_${i}`,
          customerId: r.customer_id.toString(),
          rating: r.rating,
          text: r.comment,
          adminReply: r.reply_comment,
          date: new Date(r.created_at).toLocaleDateString("en-GB"),
        }))
      );

      setTotalPages(pagination.last_page);
      setCurrentPage(pagination.current_page);
    } catch (error) {
      console.error("Failed to fetch product review detail", error);
    }
  };

  useEffect(() => {
    fetchReviewDetails(currentPage);
  }, [currentPage, productId]);

  const handleReply = (comment) => {
    setSelectedComment(comment);
    setReplyText(comment.adminReply || "");
    setReplyModalOpen(true);
  };

  const handleSaveReply = async () => {
  if (selectedComment) {
    try {
      await apiClient.put(`/admin/review/${selectedComment.customerId}`, {
        reply_comment: replyText,
      });
      await fetchReviewDetails(currentPage);
      setReplyModalOpen(false);
    } catch (error) {
      console.error("Failed to save reply", error);
    }
  }
};


  const handleDeleteReview = async (comment) => {
  const confirmed = window.confirm("Are you sure you want to delete this review?");
  if (confirmed) {
    try {
      await apiClient.delete(`/admin/review/${comment.customerId}`);
      await fetchReviewDetails(currentPage);
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  }
};


  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products & Reviews", href: "/admin/inventory/products-reviews" },
        { label: product?.name || "..." },
      ]}
      title="Product & Reviews"
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          {product && (
            <>
              <ProductCard product={product} variant="simple" />
              <ReviewSummary
                rating={product.rating}
                totalReviews={product.totalReviews}
                ratingBreakdown={product.ratingBreakdown}
              />
            </>
          )}
        </div>

        <ReviewManage
          comments={reviews}
          onReply={handleReply}
          onDelete={handleDeleteReview}
        />

        {replyModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Reply to Customer</h3>
              <p className="text-sm mb-2">
                <span className="font-medium">Customer ID:</span>{" "}
                {selectedComment?.customerId}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Review:</span>{" "}
                {selectedComment?.text}
              </p>
              <textarea
                className="w-full border border-slate-200 rounded-md p-3 text-sm mb-4"
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-sm"
                  onClick={() => setReplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 bg-slate-600 text-white rounded-md text-sm"
                  onClick={handleSaveReply}
                >
                  Save Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={3}
            totalItems={totalPages * 3}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </MainLayout>
  );
};