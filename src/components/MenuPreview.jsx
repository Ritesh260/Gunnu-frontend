import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Star, ShoppingCart, Search, Leaf, Drumstick, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const isNonVeg = (type) => type === "nonveg" || type === "non-veg";

const VegDot = ({ type }) => {
  const nonVeg = isNonVeg(type);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: nonVeg ? "#dc2626" : "#16a34a",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: nonVeg ? "#dc2626" : "#16a34a",
          border: `1.5px solid ${nonVeg ? "#b91c1c" : "#15803d"}`,
          flexShrink: 0,
        }}
      />
      {nonVeg ? "Non Veg" : "Veg"}
    </span>
  );
};

const StarRating = ({ rating = 5 }) => {
  const filled = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= filled ? "#f59e0b" : "none"}
          stroke={i <= filled ? "#f59e0b" : "#6b7280"}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
};

function MenuPreview() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("https://gunnu-dashboard.onrender.com/api/menu");
      setMenuItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isNonVeg = (type) => type === "nonveg" || type === "non-veg";
  const isVeg = (type) => type === "veg";

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchType =
        filter === "all" ||
        (filter === "veg" && isVeg(item.type)) ||
        (filter === "nonveg" && isNonVeg(item.type));
      const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [menuItems, filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const vegCount = menuItems.filter((i) => isVeg(i.type)).length;
  const nonVegCount = menuItems.filter((i) => isNonVeg(i.type)).length;

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <section
      id="menu"
      style={{
        background: "#0a0a0a",
        color: "#f9fafb",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,30,30,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,179,8,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ─── HEADING ─── */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              border: "1px solid rgba(234,179,8,0.35)",
              color: "#fbbf24",
              background: "rgba(255,255,255,0.04)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            Veg &amp; Non Veg Menu
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Crafted With{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #ef4444, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Passion
            </span>
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontSize: 15 }}>
            Premium veg &amp; non-veg Chinese dishes, made fresh with rich taste and unforgettable flavor.
          </p>
        </div>

        {/* ─── CONTROLS ─── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 4,
            }}
          >
            {[
              { key: "all", label: "All", icon: <UtensilsCrossed size={14} />, count: menuItems.length },
              { key: "veg", label: "Veg", icon: <Leaf size={14} />, count: vegCount },
              { key: "nonveg", label: "Non Veg", icon: <Drumstick size={14} />, count: nonVegCount },
            ].map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleFilterChange(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Sora', sans-serif",
                    transition: "all 0.2s",
                    background: active
                      ? tab.key === "veg"
                        ? "linear-gradient(135deg, #166534, #15803d)"
                        : tab.key === "nonveg"
                        ? "linear-gradient(135deg, #991b1b, #b91c1c)"
                        : "linear-gradient(135deg, #7c2d12, #c2410c)"
                      : "transparent",
                    color: active ? "#fff" : "#9ca3af",
                    boxShadow: active ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    style={{
                      background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 11,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={handleSearch}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px 10px 36px",
                color: "#f3f4f6",
                fontSize: 13,
                fontFamily: "'Sora', sans-serif",
                width: 220,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(234,179,8,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>

        {/* ─── LOADING ─── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid rgba(255,255,255,0.1)",
                borderTop: "3px solid #f59e0b",
                borderRadius: "50%",
                margin: "0 auto 16px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Loading menu...</p>
          </div>
        )}

        {/* ─── EMPTY ─── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
            <UtensilsCrossed size={40} style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <h3 style={{ fontWeight: 600, fontSize: 18, color: "#f3f4f6", marginBottom: 8 }}>
              No dishes found
            </h3>
            <p style={{ fontSize: 14 }}>Try a different search or filter.</p>
          </div>
        )}

        {/* ─── GRID ─── */}
        {!loading && paginated.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {paginated.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  overflow: "hidden",
                  transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(234,179,8,0.3)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.07)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  />
                  {/* Tag */}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: "linear-gradient(90deg, #7f1d1d, #ca8a04)",
                      color: "#fff",
                    }}
                  >
                    {item.tag || "Popular"}
                  </span>
                  {/* Veg/NonVeg badge corner */}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "#0a0a0a",
                      border: `2px solid ${isNonVeg(item.type) ? "#dc2626" : "#16a34a"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: isNonVeg(item.type) ? "#dc2626" : "#16a34a",
                      }}
                    />
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px 20px" }}>
                  {/* Name + Price */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#f59e0b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Veg label + Rating row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <VegDot type={item.type} />
                    <StarRating rating={item.rating || 5} />
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: 13,
                      lineHeight: 1.65,
                      marginTop: 12,
                      marginBottom: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description || "Fresh ingredients, premium sauces and perfect flavor in every bite."}
                  </p>

                  {/* Divider */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      marginTop: 16,
                      paddingTop: 16,
                    }}
                  >
                    <Link
                      to="/order"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        width: "100%",
                        padding: "11px 0",
                        borderRadius: 12,
                        background: "linear-gradient(90deg, #7f1d1d, #ca8a04)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: "none",
                        letterSpacing: "0.03em",
                        transition: "opacity 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.85";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <ShoppingCart size={16} />
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── PAGINATION ─── */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 52,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: page === 1 ? "#4b5563" : "#f3f4f6",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: page === 1 ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: pg === page ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background:
                    pg === page
                      ? "linear-gradient(135deg, #7f1d1d, #ca8a04)"
                      : "rgba(255,255,255,0.04)",
                  color: pg === page ? "#fff" : "#9ca3af",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: pg === page ? 700 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: page === totalPages ? "#4b5563" : "#f3f4f6",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* ─── RESULT COUNT ─── */}
        {!loading && filtered.length > 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#4b5563",
              fontSize: 12,
              marginTop: 20,
              letterSpacing: "0.04em",
            }}
          >
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} items
          </p>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </section>
  );
}

export default MenuPreview;