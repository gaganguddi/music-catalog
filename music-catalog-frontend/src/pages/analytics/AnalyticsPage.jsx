import { useEffect, useState } from "react";
import { BarChart2, Music, Star, TrendingUp, Calendar, User, PieChart as PieIcon } from "lucide-react";
import toast from "react-hot-toast";
import { libraryService } from "../../services/libraryService";
import { SpinnerCenter } from "../../components/common/Spinner";
import StarRating from "../../components/common/StarRating";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ['#7c3aed', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6'];

function buildGenreMap(albums) {
  const map = {};
  albums.forEach((a) => {
    if (a.genre) map[a.genre] = (map[a.genre] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

function buildRatingMap(albums) {
  const map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  albums.forEach((a) => {
    if (a.userRating >= 1 && a.userRating <= 5) map[a.userRating]++;
  });
  return Object.entries(map).map(([rating, count]) => ({ rating: `${rating} ★`, count }));
}

function buildYearMap(albums) {
  const map = {};
  albums.forEach((a) => {
    if (a.releaseDate) {
      const year = new Date(a.releaseDate).getFullYear();
      if (!isNaN(year)) map[year] = (map[year] || 0) + 1;
    }
  });
  return Object.entries(map)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year, count }));
}

function buildArtistMap(albums) {
  const map = {};
  albums.forEach((a) => {
    if (a.artistName) map[a.artistName] = (map[a.artistName] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function AnalyticsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryService
      .getLibrary()
      .then((res) => setAlbums(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SpinnerCenter />;

  if (albums.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Insights about your music taste</p>
        </div>
        <div className="empty-state glass-card">
          <div className="empty-state-icon">
            <BarChart2 size={32} color="var(--text-muted)" />
          </div>
          <h3>No data yet</h3>
          <p>Add albums to your library to see analytics</p>
        </div>
      </div>
    );
  }

  const genreData = buildGenreMap(albums);
  const ratingData = buildRatingMap(albums);
  const yearData = buildYearMap(albums);
  const artistData = buildArtistMap(albums);
  
  const topRated = [...albums]
    .filter((a) => a.userRating > 0)
    .sort((a, b) => b.userRating - a.userRating)
    .slice(0, 5);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Insights from your {albums.length}-album library</p>
      </div>

      <div className="analytics-grid">
        
        {/* 1. Pie/Donut Chart: Genre Distribution */}
        <div className="chart-card glass-card animate-fade-in-up" style={{ animationDelay: "0s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <PieIcon size={18} color="var(--accent-light)" />
            <h2 className="chart-title" style={{ margin: 0 }}>Genre Distribution</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            {genreData.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No genre data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Histogram / Bar Chart: Rating Distribution */}
        <div className="chart-card glass-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Star size={18} color="#fbbf24" />
            <h2 className="chart-title" style={{ margin: 0 }}>Rating Distribution</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="rating" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Line Chart: Releases by Year */}
        <div className="chart-card glass-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Calendar size={18} color="#06b6d4" />
            <h2 className="chart-title" style={{ margin: 0 }}>Releases by Year</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            {yearData.length === 0 ? (
               <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No year data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }} />
                  <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Horizontal Bar Chart: Top Artists */}
        <div className="chart-card glass-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <User size={18} color="#ec4899" />
            <h2 className="chart-title" style={{ margin: 0 }}>Top Artists</h2>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            {artistData.length === 0 ? (
               <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No artist data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={artistData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Rated Albums Leaderboard */}
        {topRated.length > 0 && (
          <div
            className="chart-card glass-card animate-fade-in-up"
            style={{ gridColumn: "1 / -1", animationDelay: "0.4s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#10b981" />
              <h2 className="chart-title" style={{ margin: 0 }}>Your Top Rated</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {topRated.map((album, i) => (
                <div
                  key={album.id}
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <span
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i === 0 ? "rgba(251,191,36,0.2)" : "var(--bg-card)",
                      border: `1px solid ${i === 0 ? "#fbbf24" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700,
                      color: i === 0 ? "#fbbf24" : "var(--text-secondary)",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <img
                    src={album.artworkUrl || "https://placehold.co/40x40/1a1a2e/7c3aed?text=♪"}
                    alt={album.title}
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {album.title}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                      {album.artistName}
                    </div>
                  </div>
                  <StarRating value={album.userRating} readOnly size="0.85rem" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
