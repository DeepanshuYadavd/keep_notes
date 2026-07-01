import React, { useState, useRef, useEffect } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";

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

const CreateNote = ({ onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [reminder, setReminder] = useState(null);
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const containerRef = useRef(null);

  // Click outside to collapse/save
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (title.trim() || content.trim()) {
          handleSave();
        } else {
          resetForm();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, content, color, isPinned, isArchived, reminder]);

  const handleSave = () => {
    onSave({
      title: title.trim(),
      content: content.trim(),
      color,
      isPinned,
      isArchived,
      reminder,
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("#ffffff");
    setIsPinned(false);
    setIsArchived(false);
    setReminder(null);
    setIsExpanded(false);
    setShowColorPicker(false);
    setShowReminderPicker(false);
  };

  const isDefaultColor = color === "#ffffff" || color === "transparent" || !color;
  const textColorClass = isDefaultColor ? "text-light" : "text-dark";

  return (
    <div
      ref={containerRef}
      className={`create-note-container glassmorphism ${isExpanded ? "expanded" : ""} ${textColorClass}`}
      style={isDefaultColor ? {} : { backgroundColor: color }}
    >
      {isExpanded && (
        <div className="create-note-header">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="create-note-input-title"
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
      )}

      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        className="create-note-input-content"
        rows={isExpanded ? 3 : 1}
      />

      {isExpanded && (
        <div className="create-note-footer">
          <div className="create-note-actions">
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
                    value={reminder || ""}
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

            {/* Archive Button */}
            <button
              type="button"
              className={`icon-button action-btn ${isArchived ? "active" : ""}`}
              onClick={() => setIsArchived(!isArchived)}
              title="Archive"
            >
              <ArchiveOutlinedIcon />
            </button>
          </div>

          <button
            type="button"
            className="text-btn close-btn"
            onClick={handleSave}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
