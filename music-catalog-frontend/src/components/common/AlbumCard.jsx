import { Plus, Edit2, Trash2 } from "lucide-react";
import StarRating from "./StarRating";

const FALLBACK_ART = "https://placehold.co/200x200/1a1a2e/7c3aed?text=♪";

function AlbumCard({
  album,
  variant = "search", // "search" | "library"
  onAdd,
  onEdit,
  onDelete,
  style,
}) {
  const {
    title,
    collectionName,
    artistName,
    artworkUrl100,
    artworkUrl,
    primaryGenreName,
    genre,
    userRating,
    trackCount,
  } = album;

  const displayTitle = title || collectionName || "Unknown Album";
  const displayArtist = artistName || "Unknown Artist";
  const displayGenre = genre || primaryGenreName;
  const artwork = artworkUrl || artworkUrl100 || FALLBACK_ART;

  return (
    <div className="album-card glass-card animate-fade-in-up" style={style}>
      <img
        src={artwork}
        alt={`${displayTitle} album art`}
        className="album-artwork"
        onError={(e) => { e.target.src = FALLBACK_ART; }}
        loading="lazy"
      />
      <div className="album-body">
        <div className="album-title" title={displayTitle}>{displayTitle}</div>
        <div className="album-artist" title={displayArtist}>{displayArtist}</div>

        <div className="album-meta">
          {displayGenre && <span className="album-genre">{displayGenre}</span>}
          {trackCount && (
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {trackCount} tracks
            </span>
          )}
        </div>

        {variant === "library" && userRating > 0 && (
          <div style={{ marginTop: "8px" }}>
            <StarRating value={userRating} readOnly size="0.9rem" />
          </div>
        )}

        <div className="album-actions">
          {variant === "search" && (
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onAdd && onAdd(album)}
              id={`add-album-${album.collectionId}`}
              aria-label={`Add ${displayTitle} to library`}
            >
              <Plus size={14} /> Add
            </button>
          )}
          {variant === "library" && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                style={{ flex: 1 }}
                onClick={() => onEdit && onEdit(album)}
                id={`edit-album-${album.id}`}
                aria-label={`Edit ${displayTitle}`}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete && onDelete(album)}
                id={`delete-album-${album.id}`}
                aria-label={`Remove ${displayTitle}`}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;
