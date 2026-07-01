import React, { useState, useEffect, useRef } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

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

const NoteModal = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "#ffffff");
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [isArchived, setIsArchived] = useState(note?.isArchived || false);
  const [reminder, setReminder] = useState(note?.reminder || null);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const modalRef = useRef(null);

  // Sync state with note when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setColor(note.color || "#ffffff");
      setIsPinned(note.isPinned || false);
      setIsArchived(note.isArchived || false);
      setReminder(note.reminder || null);
    }
  }, [note]);

  const handleClose = () => {
    onSave(note._id, {
      title,
      content,
      color,
      isPinned,
      isArchived,
      reminder,
    });
    onClose();
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content, color, isPinned, isArchived, reminder]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const isDefaultColor = color === "#ffffff" || color === "transparent" || !color;
  const textColorClass = isDefaultColor ? "text-light" : "text-dark";

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={`premium-modal-card glassmorphism animate-scale-up ${textColorClass}`}
        style={isDefaultColor ? {} : { backgroundColor: color }}
      >
        <div className="modal-header">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="modal-input-title"
          />
          <button
            type="button"
            className={`icon-button pin-btn ${isPinned ? "pinned" : ""}`}
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin note" : "Pin note"}
          >
            {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </button>
        </div>

        <textarea
          placeholder="Note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="modal-input-content"
          rows={6}
        />

        {/* Display reminder chip in modal if exists */}
        {reminder && (
          <div className="reminder-badge modal-reminder-badge">
            <span className="reminder-badge-icon">⏰</span>
            <span className="reminder-badge-text">
              {new Date(reminder).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              className="clear-reminder-btn"
              onClick={() => setReminder(null)}
              title="Remove reminder"
            >
              &times;
            </button>
          </div>
        )}

        <div className="modal-footer">
          <div className="modal-actions">
            {/* Reminder Button */}
            <div className="action-popover-wrapper">
              <button
                type="button"
                className={`icon-button action-btn ${reminder ? "active" : ""}`}
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
                    value={reminder ? new Date(reminder).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setReminder(e.target.value)}
                    className="popover-datetime-input"
                  />
                  <div className="popover-button-group">
                    {reminder && (
                      <button
                        className="popover-btn delete-btn"
                        onClick={() => {
                          setReminder(null);
                          setShowReminderPicker(false);
                        }}
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
                type="button"
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
                        className={`color-dot ${color === c.value ? "selected" : ""}`}
                        style={{ backgroundColor: c.value }}
                        onClick={() => setColor(c.value)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Archive Toggle Button */}
            <button
              type="button"
              className="icon-button action-btn"
              onClick={() => setIsArchived(!isArchived)}
              title={isArchived ? "Unarchive" : "Archive"}
            >
              {isArchived ? <UnarchiveOutlinedIcon /> : <ArchiveOutlinedIcon />}
            </button>
          </div>

          <button type="button" className="text-btn close-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
