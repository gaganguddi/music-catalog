import { useState, useEffect, useCallback } from "react";
import { Library, Search } from "lucide-react";
import toast from "react-hot-toast";
import { libraryService } from "../../services/libraryService";
import AlbumCard from "../../components/common/AlbumCard";
import Modal from "../../components/common/Modal";
import StarRating from "../../components/common/StarRating";
import { SpinnerCenter } from "../../components/common/Spinner";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";

function LibraryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Edit modal
  const [editAlbum, setEditAlbum] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteAlbum, setDeleteAlbum] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadLibrary = useCallback(() => {
    setLoading(true);
    libraryService
      .getLibrary()
      .then((res) => setAlbums(res.data))
      .catch(() => toast.error("Failed to load library"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  const openEdit = (album) => {
    setEditAlbum(album);
    setEditRating(album.userRating || 0);
    setEditNotes(album.userNotes || "");
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await libraryService.updateAlbum(editAlbum.id, {
        userRating: editRating || null,
        userNotes: editNotes || null,
      });
      setAlbums((prev) =>
        prev.map((a) => (a.id === editAlbum.id ? res.data : a))
      );
      toast.success("Album updated!");
      setEditAlbum(null);
    } catch {
      toast.error("Failed to update album");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await libraryService.deleteAlbum(deleteAlbum.id);
      setAlbums((prev) => prev.filter((a) => a.id !== deleteAlbum.id));
      toast.success("Album removed from library");
      setDeleteAlbum(null);
    } catch {
      toast.error("Failed to delete album");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = albums.filter((a) => {
    const q = filter.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.artistName?.toLowerCase().includes(q) ||
      a.genre?.toLowerCase().includes(q)
    );
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) return <SpinnerCenter />;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">My Library</h1>
        <p className="page-subtitle">
          {albums.length} album{albums.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      {/* Filter bar */}
      {albums.length > 0 && (
        <div className="search-bar-wrapper">
          <Search size={18} className="search-bar-icon" />
          <input
            id="library-filter"
            type="search"
            className="search-bar"
            placeholder="Filter by title, artist, genre…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter library"
          />
        </div>
      )}

      {/* Empty state */}
      {albums.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">
            <Library size={32} color="var(--text-muted)" />
          </div>
          <h3>Your library is empty</h3>
          <p>Go to Search to discover and add albums!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={28} color="var(--text-muted)" />
          </div>
          <h3>No matches</h3>
          <p>Try a different filter</p>
        </div>
      ) : (
        <>
          <div className="album-grid">
            {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((album, i) => (
              <AlbumCard
                key={album.id}
                album={album}
                variant="library"
                onEdit={openEdit}
                onDelete={setDeleteAlbum}
                style={{ animationDelay: `${i * 0.04}s` }}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editAlbum}
        onClose={() => setEditAlbum(null)}
        title="Edit Album"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditAlbum(null)} disabled={saving}>
              Cancel
            </button>
            <button
              id="btn-save-edit"
              className="btn btn-primary"
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? <Spinner /> : "Save Changes"}
            </button>
          </>
        }
      >
        {editAlbum && (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <img
                src={editAlbum.artworkUrl || "https://placehold.co/60x60/1a1a2e/7c3aed?text=♪"}
                alt={editAlbum.title}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{editAlbum.title}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {editAlbum.artistName}
                </div>
              </div>
            </div>

            <hr className="divider" />

            <div className="input-group">
              <label className="input-label">Rating</label>
              <StarRating value={editRating} onChange={setEditRating} size="1.4rem" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="edit-notes">Notes</label>
              <textarea
                id="edit-notes"
                className="input-field"
                rows={3}
                placeholder="Your thoughts…"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteAlbum}
        onClose={() => setDeleteAlbum(null)}
        title="Remove Album"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteAlbum(null)} disabled={deleting}>
              Cancel
            </button>
            <button
              id="btn-confirm-delete"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Spinner /> : "Remove"}
            </button>
          </>
        }
      >
        {deleteAlbum && (
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Are you sure you want to remove{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              "{deleteAlbum.title}"
            </strong>{" "}
            by {deleteAlbum.artistName} from your library? This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}

export default LibraryPage;
