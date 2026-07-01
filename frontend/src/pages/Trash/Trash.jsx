import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import NoteCard from "../../components/NoteCard";
import { useToast } from "../../components/Toast";

const Trash = () => {
  const { searchQuery, isListView } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTrashedNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes/trashed");
      setNotes(response.data.data);
    } catch (err) {
      showToast("Failed to fetch trashed notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedNotes();
  }, []);

  const handleUpdateNote = async (id, updatedFields) => {
    try {
      await api.put(`/notes/${id}`, updatedFields);
      
      // If restored, remove from trash page immediately
      if (updatedFields.isTrashed === false) {
        showToast("Note restored", "success");
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      }
    } catch (err) {
      showToast("Failed to restore note", "error");
    }
  };

  const handleDeleteNote = async (id, permanent) => {
    if (!permanent) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      showToast("Note permanently deleted", "success");
    } catch (err) {
      showToast("Failed to delete note", "error");
    }
  };

  const handleEmptyTrash = async () => {
    if (notes.length === 0) return;
    if (!window.confirm("Empty trash? All notes in trash will be permanently deleted.")) {
      return;
    }

    try {
      await api.delete("/notes/trash/empty");
      setNotes([]);
      showToast("Trash emptied", "success");
    } catch (err) {
      showToast("Failed to empty trash", "error");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="premium-loader-container">
        <div className="premium-loader"></div>
        <p>Syncing trash bin...</p>
      </div>
    );
  }

  return (
    <div className="notes-page-workspace">
      <div className="workspace-header trash-header">
        <div className="header-info">
          <h2>Trash</h2>
          <p className="trash-subtext">Notes in Trash are kept here.</p>
        </div>
        {notes.length > 0 && (
          <button
            className="premium-btn danger-btn empty-trash-btn"
            onClick={handleEmptyTrash}
          >
            Empty Trash
          </button>
        )}
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🔍</span>
          <p>No notes matching your search query.</p>
        </div>
      )}

      {notes.length === 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🗑️</span>
          <p>Trash is empty!</p>
        </div>
      )}

      {filteredNotes.length > 0 && (
        <div className={`notes-grid ${isListView ? "list-view" : ""}`}>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onEditClick={() => showToast("Restore this note to edit it.", "info")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
