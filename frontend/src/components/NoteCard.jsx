import React, { useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

const PRESET_COLORS = [
  { name: "Default", value: "#ffffff" },
  { name: "Coral", value: "#faafa8" },
  { name: "Peach", value: "#f39f76" },
  { name: "Sand", value: "#fff8b8" },
  { name: "Mint", value: "#e2f6d3" },
  { name: "Sage", value: "#b4ddd3" },
  { name: "Fog", value: "#d4e4ed" },
  { name: "Storm", value: "#aeecfc" },
  { name: "Dusk", value: "#d3bfdb" },
  { name: "Blossom", value: "#f6e2dd" },
  { name: "Clay", value: "#e9e3d4" },
  { name: "Charcoal", value: "#efeff1" },
];

const NoteCard = ({ note, onUpdate, onDelete, onEditClick }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const handleColorChange = (newColor) => {
    onUpdate(note._id, { color: newColor });
    setShowColorPicker(false);
  };

  const handleReminderChange = (date) => {
    onUpdate(note._id, { reminder: date });
    setShowReminderPicker(false);
  };

  const handleCardClick = (e) => {
    // If user clicked an action button, do not trigger card edit click
    if (e.target.closest(".icon-button") || e.target.closest(".premium-popover")) {
      return;
    }
    onEditClick(note);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isReminderOverdue = note.reminder && new Date(note.reminder) < new Date();

  const isDefaultColor = note.color === "#ffffff" || note.color === "transparent" || !note.color;
  const textColorClass = isDefaultColor ? "text-light" : "text-dark";

  return (
    <div
      className={`premium-note-card glassmorphism ${note.isPinned ? "pinned-card" : ""} ${textColorClass}`}
      style={isDefaultColor ? {} : { backgroundColor: note.color }}
      onClick={handleCardClick}
    >
      <div className="note-card-header">
        <h3 className="note-card-title">
          {note.title || <span className="placeholder-text">Untitled</span>}
        </h3>
        
        {!note.isTrashed && (
          <button
            className={`icon-button pin-btn ${note.isPinned ? "pinned" : ""}`}
            onClick={() => onUpdate(note._id, { isPinned: !note.isPinned })}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            {note.isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </button>
        )}
      </div>

      <div className="note-card-content">
        <p>{note.content || <span className="placeholder-text">Empty note</span>}</p>
      </div>

      {/* Reminder Badge */}
      {note.reminder && !note.isTrashed && (
        <div className={`reminder-badge ${isReminderOverdue ? "overdue" : ""}`}>
          <span className="reminder-badge-icon">⏰</span>
          <span className="reminder-badge-text">{formatDate(note.reminder)}</span>
          <button
            className="clear-reminder-btn"
            onClick={() => onUpdate(note._id, { reminder: null })}
            title="Remove reminder"
          >
            &times;
          </button>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="note-card-footer">
        {note.isTrashed ? (
          // Trashed actions
          <div className="note-card-actions">
            <button
              className="icon-button action-btn"
              onClick={() => onUpdate(note._id, { isTrashed: false })}
              title="Restore"
            >
              <RestoreFromTrashOutlinedIcon />
            </button>
            <button
              className="icon-button action-btn delete-forever-btn"
              onClick={() => onDelete(note._id, true)}
              title="Delete permanently"
            >
              <DeleteForeverOutlinedIcon />
            </button>
          </div>
        ) : (
          // Standard active/archived actions
          <div className="note-card-actions">
            {/* Reminder Button */}
            <div className="action-popover-wrapper">
              <button
                className={`icon-button action-btn ${note.reminder ? "active" : ""}`}
                onClick={() => {
                  setShowReminderPicker(!showReminderPicker);
                  setShowColorPicker(false);
                }}
                title="Remind me"
              >
                <NotificationsOutlinedIcon />
              </button>
              {showReminderPicker && (
                <div className="premium-popover reminder-popover glassmorphism">
                  <h4>Set Reminder</h4>
                  <input
                    type="datetime-local"
                    value={note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleReminderChange(e.target.value)}
                    className="popover-datetime-input"
                  />
                  <div className="popover-button-group">
                    {note.reminder && (
                      <button
                        className="popover-btn delete-btn"
                        onClick={() => handleReminderChange(null)}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      className="popover-btn save-btn"
                      onClick={() => setShowReminderPicker(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette Button */}
            <div className="action-popover-wrapper">
              <button
                className="icon-button action-btn"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowReminderPicker(false);
                }}
                title="Background options"
              >
                <PaletteOutlinedIcon />
              </button>
              {showColorPicker && (
                <div className="premium-popover color-popover glassmorphism">
                  <div className="color-grid">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`color-dot ${note.color === c.value ? "selected" : ""}`}
                        style={{ backgroundColor: c.value }}
                        onClick={() => handleColorChange(c.value)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Archive Toggle Button */}
            <button
              className="icon-button action-btn"
              onClick={() =>
                onUpdate(note._id, { isArchived: !note.isArchived })
              }
              title={note.isArchived ? "Unarchive" : "Archive"}
            >
              {note.isArchived ? <UnarchiveOutlinedIcon /> : <ArchiveOutlinedIcon />}
            </button>

            {/* Trash Button */}
            <button
              className="icon-button action-btn"
              onClick={() => onUpdate(note._id, { isTrashed: true })}
              title="Delete note"
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
