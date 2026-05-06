import { useState, useEffect } from "react";
import { Star, Quote, X, UploadCloud } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://gunnu-dashboard.onrender.com/api/reviews";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    review: "",
    image: null,
    preview: ""
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get(API);
    setReviews(res.data);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("review", form.review);

      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.post(API, formData);

      toast.success("Review submitted ⭐ Waiting for approval");

      setShowModal(false);
      setForm({
        name: "",
        role: "",
        review: "",
        image: null,
        preview: ""
      });

      fetchReviews();
    } catch (err) {
      toast.error("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <section className="py-24 bg-black text-white">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold">
          What Our <span className="text-yellow-500">Customers Say</span>
        </h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-600 text-black font-semibold rounded-xl hover:scale-105 transition"
        >
          Add Your Review
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-6">
        {reviews.map((item) => (
          <div key={item._id} className="p-6 bg-white/5 rounded-2xl border border-white/10">

            <div className="flex gap-3 items-center">
              <img src={item.image} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.role}</p>
              </div>
            </div>

            <div className="flex mt-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <p className="mt-3 text-sm text-gray-300">
              "{item.review}"
            </p>
          </div>
        ))}
      </div>

      {/* 🔥 PREMIUM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">

          <div className="bg-[#111] w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-xl relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-yellow-400">
              Add Your Review
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Share your experience 🍜
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <input
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-500 outline-none"
              />

              {/* ROLE */}
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 text-gray-300 focus:border-yellow-500 outline-none"
              >
                <option value="">Select Role</option>
                <option>Food Lover</option>
                <option>Regular Customer</option>
                <option>Food Blogger</option>
                <option>First Time Visitor</option>
              </select>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Profile Image
                </label>

                <label className="flex items-center justify-center gap-2 cursor-pointer border border-dashed border-yellow-500 rounded-lg p-4 hover:bg-yellow-500/10 transition">
                  <UploadCloud size={18} />
                  <span className="text-sm">Click to Upload Image</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {form.preview && (
                  <img
                    src={form.preview}
                    className="w-16 h-16 rounded-full mt-3 border border-yellow-500"
                  />
                )}
              </div>

              {/* REVIEW */}
              <textarea
                placeholder="Write your review..."
                required
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-500 outline-none"
              />

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Testimonials;