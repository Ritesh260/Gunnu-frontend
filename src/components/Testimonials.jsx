import { useState, useEffect, useRef } from "react";
import { Star, X, UploadCloud, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://gunnu-dashboard.onrender.com/api/reviews";

function StarRating({ value = 5, onChange }) {
  const [hovered, setHovered] = useState(0);

  if (onChange) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={22}
              className={`transition-colors ${
                star <= (hovered || value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={`${
            star <= value
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ src, name, size = "md" }) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-yellow-500/30 flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex-shrink-0 flex items-center justify-center font-semibold border-2 border-yellow-500/30`}
      style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
    >
      {initials}
    </div>
  );
}

function ReviewCard({ item }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-yellow-500/30 transition-all duration-300 h-full">
      {/* Author — top */}
      <div className="flex items-center gap-3">
        <Avatar src={item.image} name={item.name} size="md" />
        <div>
          <p className="font-semibold text-white text-sm">{item.name}</p>
          <p className="text-xs text-gray-500">{item.role || "Customer"}</p>
          <div className="mt-1">
            <StarRating value={item.rating || 5} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Quote mark */}
      <div className="text-yellow-500/20 text-5xl font-serif leading-none select-none -mb-2">"</div>

      {/* Review text */}
      <p className="text-sm text-gray-300 leading-relaxed flex-1">
        {item.review}
      </p>
    </div>
  );
}

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 1
  );

  const [form, setForm] = useState({
    name: "",
    role: "",
    review: "",
    rating: 5,
    image: null,
    preview: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newPer = window.innerWidth >= 1024 ? 3 : 1;
      setPerPage((prev) => {
        if (prev !== newPer) setPage(0);
        return newPer;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(API);
      setReviews(res.data);
    } catch {
      // silently fail — sample data already set
    }
  };

  const totalPages = Math.ceil(reviews.length / perPage);

  const visibleReviews = reviews.slice(page * perPage, page * perPage + perPage);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.error("Name and review are required.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("review", form.review);
      formData.append("rating", form.rating);
      if (form.image) formData.append("image", form.image);

      await axios.post(API, formData);
      toast.success("Review submitted ⭐ Waiting for approval");
      setShowModal(false);
      setForm({ name: "", role: "", review: "", rating: 5, image: null, preview: "" });
      fetchReviews();
    } catch {
      toast.error("Something went wrong ❌");
    }
    setLoading(false);
  };

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-4 relative">
        <p className="text-xs tracking-[0.2em] text-yellow-500 uppercase mb-3 font-medium">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          What Our{" "}
          <span className="text-yellow-500">Customers Say</span>
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Honest reviews from people who love our food
        </p>
      </div>

      {/* Add Review Button */}
      <div className="flex justify-center mt-8 px-4">
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
          }}
        >
          <Star size={16} className="fill-black" />
          Add Your Review
        </button>
      </div>

      {/* Slider */}
      <div className="max-w-6xl mx-auto px-4 mt-14 relative">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 py-16">
            No reviews yet. Be the first!
          </p>
        ) : (
          <>
            {/* Cards Grid */}
            <div
              className={`grid gap-6 ${
                perPage === 3
                  ? "grid-cols-1 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {visibleReviews.map((item) => (
                <ReviewCard key={item._id} item={item} />
              ))}
            </div>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === page ? "20px" : "6px",
                        height: "6px",
                        background:
                          i === page
                            ? "#f59e0b"
                            : "rgba(255,255,255,0.2)",
                      }}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Page count */}
            <p className="text-center text-xs text-gray-600 mt-4">
              {page + 1} / {totalPages}
            </p>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-yellow-400 mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Your review helps others discover great food
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <input
                placeholder="Your full name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />

              {/* Role */}
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                style={{ color: form.role ? "#fff" : "#4b5563" }}
              >
                <option value="">Select your role</option>
                <option>Food Lover</option>
                <option>Regular Customer</option>
                <option>Food Blogger</option>
                <option>First Time Visitor</option>
              </select>

              {/* Star Rating in Modal */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Your rating:</span>
                <StarRating
                  value={form.rating}
                  onChange={(val) => setForm({ ...form, rating: val })}
                />
                <span className="text-sm text-yellow-400 font-medium">
                  {form.rating}/5
                </span>
              </div>

              {/* Image Upload */}
              <label className="flex items-center justify-center gap-2 border border-dashed border-yellow-500/40 rounded-xl p-4 cursor-pointer hover:bg-yellow-500/5 transition-colors text-yellow-500/70 text-sm">
                <UploadCloud size={18} />
                {form.preview ? "Change Photo" : "Upload Profile Photo (optional)"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {form.preview && (
                <div className="flex items-center gap-3">
                  <img
                    src={form.preview}
                    alt="preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500/30"
                  />
                  <span className="text-xs text-gray-500">Photo selected</span>
                </div>
              )}

              {/* Review Text */}
              <textarea
                placeholder="Tell us about your experience... *"
                required
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
                }}
              >
                {loading ? "Submitting..." : "Submit Review ⭐"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Testimonials;