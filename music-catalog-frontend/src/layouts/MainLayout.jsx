import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Library,
  BarChart2,
  Sparkles,
  LogOut,
  Music2,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/library",   icon: Library,         label: "My Library" },
  { to: "/analytics", icon: BarChart2,       label: "Analytics" },
  { to: "/ai",        icon: Sparkles,        label: "AI Insights" },
];

function MainLayout() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Extract email initial from JWT payload
  let emailDisplay = "User";
  let emailInitial = "U";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    emailDisplay = payload.sub || "User";
    emailInitial = emailDisplay[0].toUpperCase();
  } catch {
    // ignore parse errors
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      {/* ── Mobile Overlay ─────────────────── */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────── */}
      <aside
        className={`sidebar${sidebarOpen ? " open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile close button inside sidebar */}
        <button
          className="sidebar-mobile-close"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Music2 size={18} color="#fff" />
          </div>
          <div>
            <span className="sidebar-logo-text">MusicVault</span>
            <span className="sidebar-logo-sub">Catalog Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={closeSidebar}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{emailInitial}</div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {emailDisplay}
              </div>
              <div className="user-email">Signed in</div>
            </div>
          </div>
          <button
            className="nav-link btn-full"
            id="btn-logout"
            onClick={handleLogout}
            style={{ marginTop: "8px", color: "#ef4444" }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            className="hamburger-btn"
            id="btn-open-sidebar"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div className="mobile-logo">
            <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}>
              <Music2 size={14} color="#fff" />
            </div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem" }}>
              MusicVault
            </span>
          </div>
          <div className="user-avatar" style={{ width: 30, height: 30, fontSize: "0.72rem" }}>
            {emailInitial}
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
