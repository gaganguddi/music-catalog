import { useEffect, useState, useCallback, useRef } from "react";
import { Music, Star, Heart, Clock, Search, Sparkles, ThumbsUp, Loader2, ChevronDown } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { searchService } from "../../services/searchService";
import { libraryService } from "../../services/libraryService";
import { aiService } from "../../services/aiService";
import AlbumCard from "../../components/common/AlbumCard";
import Modal from "../../components/common/Modal";
import StarRating from "../../components/common/StarRating";
import Spinner, { SpinnerCenter } from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";

const statCards = (data) => [
  {
    label: "Total Albums",
    value: data.totalAlbums ?? 0,
    icon: Music,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.15)",
  },
  {
    label: "Favorite Genre",
    value: data.favoriteGenre || "—",
    icon: Heart,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
  },
  {
    label: "Average Rating",
    value: data.averageRating ? `${data.averageRating.toFixed(1)} ★` : "—",
    icon: Star,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
  },
];

function DashboardPage() {
  // Dashboard stats
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const itemsPerPage = 12;
  const debounceRef = useRef(null);

  // Add to Library modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);

  // AI Recommendation
  const [myAlbums, setMyAlbums] = useState([]);
  const [aiSelectedId, setAiSelectedId] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));

    libraryService
      .getLibrary()
      .then((res) => {
        setMyAlbums(res.data);
        if (res.data.length > 0) setAiSelectedId(String(res.data[0].id));
      })
      .catch(() => {});
  }, []);

  // ── Search ──────────────────────────────────────────────
  const doSearch = useCallback(async (term) => {
    if (!term.trim()) { setResults([]); setHasSearched(false); return; }
    setSearching(true);
    try {
      const res = await searchService.searchAlbums(term);
      setResults(res.data.results || []);
      setSearchPage(1);
      setHasSearched(true);
    } catch {
      toast.error("Search failed. Is the backend running?");
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const openAddModal = (album) => {
    setSelectedAlbum(album);
    setRating(0);
    setNotes("");
    setModalOpen(true);
  };

  const handleAdd = async () => {
    if (!selectedAlbum) return;
    setAdding(true);
    try {
      const releaseDate = selectedAlbum.releaseDate
        ? selectedAlbum.releaseDate.split("T")[0]
        : null;
      await libraryService.addAlbum({
        appleCatalogId: selectedAlbum.collectionId,
        title: selectedAlbum.collectionName,
        artistName: selectedAlbum.artistName,
        genre: selectedAlbum.primaryGenreName || null,
        releaseDate,
        trackCount: selectedAlbum.trackCount || null,
        artworkUrl: selectedAlbum.artworkUrl100 || null,
        userRating: rating || null,
        userNotes: notes || null,
      });
      toast.success(`"${selectedAlbum.collectionName}" added to library! 🎵`);
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add album";
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  // ── AI Recommendation ────────────────────────────────────
  const handleGenerate = async () => {
    if (!aiSelectedId) { toast.error("Please select an album"); return; }
    setGenerating(true);
    setRecommendation(null);
    try {
      const res = await aiService.generateInsights(Number(aiSelectedId));
      setRecommendation(res.data.recommendation);
      toast.success("AI Recommendation ready! ✨");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate recommendation";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <SpinnerCenter />;

  const stats = statCards(data || {});
  const recentAlbums = data?.recentAlbums || [];
  const pagedResults = results.slice((searchPage - 1) * itemsPerPage, searchPage * itemsPerPage);

  return (
    <div className="animate-fade-in-up">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your music collection at a glance</p>
      </div>

      {/* ── Search Bar ─────────────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Search size={18} color="var(--accent-light)" />
          <h2 style={{ fontSize: "1.1rem" }}>Discover Albums</h2>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <div className="search-bar-wrapper">
            <Search size={18} className="search-bar-icon" />
            <input
              id="dashboard-search-input"
              type="search"
              className="search-bar"
              placeholder="Search by artist, album, or song…"
              value={query}
              onChange={handleInputChange}
              aria-label="Search albums"
            />
            {searching && (
              <Spinner style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }} />
            )}
          </div>
        </form>

        {hasSearched && !searching && results.length === 0 && (
          <div className="empty-state" style={{ paddingTop: 30 }}>
            <div className="empty-state-icon"><Search size={28} color="var(--text-muted)" /></div>
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 18 }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
            <div className="album-grid">
              {pagedResults.map((album, i) => (
                <AlbumCard
                  key={album.collectionId}
                  album={album}
                  variant="search"
                  onAdd={openAddModal}
                  style={{ animationDelay: `${i * 0.04}s` }}
                />
              ))}
            </div>
            <Pagination
              currentPage={searchPage}
              totalPages={Math.ceil(results.length / itemsPerPage)}
              onPageChange={setSearchPage}
            />
          </>
        )}
      </section>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className="stats-grid" style={{ marginBottom: 40 }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card glass-card animate-fade-in-up"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="stat-icon" style={{ background: stat.bg }}>
              <stat.icon size={22} color={stat.color} />
            </div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── AI Recommendation ──────────────────────────── */}
      {myAlbums.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Sparkles size={18} color="var(--accent-light)" />
            <h2 style={{ fontSize: "1.1rem" }}>AI Recommendation</h2>
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>
              Pick an album from your library and get a personalized AI recommendation on what to listen to next.
            </p>

            <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="input-group" style={{ flex: "1 1 240px", marginBottom: 0 }}>
                <label className="input-label" htmlFor="dashboard-ai-select">Select an album</label>
                <div style={{ position: "relative" }}>
                  <select
                    id="dashboard-ai-select"
                    className="input-field"
                    style={{ paddingRight: 36, appearance: "none", cursor: "pointer" }}
                    value={aiSelectedId}
                    onChange={(e) => { setAiSelectedId(e.target.value); setRecommendation(null); }}
                  >
                    {myAlbums.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.title} — {a.artistName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
              </div>

              <button
                id="btn-dashboard-recommend"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={generating || !aiSelectedId}
                style={{ padding: "12px 22px", flexShrink: 0 }}
              >
                {generating
                  ? <><Loader2 size={15} style={{ animation: "spin 0.7s linear infinite" }} /> Generating…</>
                  : <><Sparkles size={15} /> Get Recommendation</>
                }
              </button>
            </div>

            {recommendation && (
              <div
                className="animate-fade-in-up"
                style={{
                  marginTop: 24,
                  padding: "20px 24px",
                  background: "rgba(16,185,129,0.07)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "var(--radius)",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "rgba(16,185,129,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ThumbsUp size={18} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#10b981", marginBottom: 8 }}>
                    AI Recommendation
                  </div>
                  <p style={{ color: "var(--text-primary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                    {recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Recently Added ─────────────────────────────── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Clock size={18} color="var(--accent-light)" />
          <h2 style={{ fontSize: "1.1rem" }}>Recently Added</h2>
        </div>

        {recentAlbums.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-state-icon"><Music size={32} color="var(--text-muted)" /></div>
            <h3>No albums yet</h3>
            <p>Search for albums above and add them to your library!</p>
          </div>
        ) : (
          <div className="album-grid">
            {recentAlbums.map((album, i) => (
              <AlbumCard
                key={album.id}
                album={album}
                variant="library"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Add to Library Modal ────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add to Library"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={adding}>Cancel</button>
            <button id="btn-confirm-add-dash" className="btn btn-primary" onClick={handleAdd} disabled={adding}>
              {adding ? <Spinner /> : "Add Album"}
            </button>
          </>
        }
      >
        {selectedAlbum && (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <img
                src={selectedAlbum.artworkUrl100}
                alt={selectedAlbum.collectionName}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{selectedAlbum.collectionName}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{selectedAlbum.artistName}</div>
              </div>
            </div>
            <hr className="divider" />
            <div className="input-group">
              <label className="input-label">Your Rating (optional)</label>
              <StarRating value={rating} onChange={setRating} size="1.4rem" />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="dash-modal-notes">Notes (optional)</label>
              <textarea
                id="dash-modal-notes"
                className="input-field"
                rows={3}
                placeholder="What do you think about this album?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default DashboardPage;
