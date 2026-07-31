import { useEffect, useState } from "react";
import { Sparkles, ThumbsUp, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { libraryService } from "../../services/libraryService";
import { aiService } from "../../services/aiService";
import { SpinnerCenter } from "../../components/common/Spinner";

function AIInsightsPage() {
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [insights, setInsights] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    libraryService
      .getLibrary()
      .then((res) => {
        setAlbums(res.data);
        if (res.data.length > 0) setSelectedId(String(res.data[0].id));
      })
      .catch(() => toast.error("Failed to load library"))
      .finally(() => setLoadingAlbums(false));
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) { toast.error("Please select an album"); return; }
    setGenerating(true);
    setInsights(null);
    try {
      const res = await aiService.generateInsights(Number(selectedId));
      setInsights(res.data);
      toast.success("AI Recommendation generated! ✨");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate insights";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  if (loadingAlbums) return <SpinnerCenter />;

  const selectedAlbum = albums.find((a) => String(a.id) === selectedId);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Sparkles size={18} color="var(--accent-light)" />
          </div>
          <h1 className="page-title" style={{ margin: 0 }}>AI Recommendation</h1>
        </div>
        <p className="page-subtitle">Get AI-powered recommendations based on any album in your library</p>
      </div>

      {albums.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">
            <Sparkles size={32} color="var(--text-muted)" />
          </div>
          <h3>No albums in library</h3>
          <p>Add albums to your library first to get AI recommendations</p>
        </div>
      ) : (
        <>
          {/* Album Selector */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="input-group" style={{ flex: "1 1 260px" }}>
                <label className="input-label" htmlFor="ai-album-select">
                  Select an Album
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="ai-album-select"
                    className="input-field"
                    style={{ paddingRight: 36, appearance: "none", cursor: "pointer" }}
                    value={selectedId}
                    onChange={(e) => { setSelectedId(e.target.value); setInsights(null); }}
                  >
                    {albums.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.title} — {a.artistName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
                  />
                </div>
              </div>

              <button
                id="btn-generate-insights"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={generating || !selectedId}
                style={{ padding: "12px 24px", flexShrink: 0 }}
              >
                {generating ? (
                  <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Generating…</>
                ) : (
                  <><Sparkles size={16} /> Get Recommendation</>
                )}
              </button>
            </div>

            {/* Selected album preview */}
            {selectedAlbum && (
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <img
                  src={selectedAlbum.artworkUrl || "https://placehold.co/52x52/1a1a2e/7c3aed?text=♪"}
                  alt={selectedAlbum.title}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{selectedAlbum.title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    {selectedAlbum.artistName}
                    {selectedAlbum.genre && ` · ${selectedAlbum.genre}`}
                  </div>
                </div>
                {generating && (
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} />
                    AI is analyzing…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Insight cards (Just Recommendation) */}
          {insights && insights.recommendation && (
            <div className="animate-fade-in-up">
              <div className="insight-card glass-card" style={{ animationDelay: "0s" }}>
                <div className="insight-icon-wrap" style={{ background: "rgba(16,185,129,0.12)" }}>
                  <ThumbsUp size={24} color="#10b981" />
                </div>
                <div className="insight-type" style={{ fontSize: "0.85rem", marginBottom: 12 }}>Recommendation</div>
                <p className="insight-text" style={{ fontSize: "1rem", lineHeight: 1.8 }}>{insights.recommendation}</p>
              </div>
            </div>
          )}

          {/* Prompt to generate */}
          {!insights && !generating && (
            <div className="empty-state" style={{ paddingTop: 40 }}>
              <div className="empty-state-icon">
                <Sparkles size={28} color="var(--accent-light)" />
              </div>
              <h3>Ready to recommend</h3>
              <p>Select an album and click Get Recommendation to see what you should listen to next</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AIInsightsPage;

