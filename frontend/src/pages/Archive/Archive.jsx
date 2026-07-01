import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import NoteCard from "../../components/NoteCard";
import NoteModal from "../../components/NoteModal";
import { useToast } from "../../components/Toast";

const Archive = () => {
  const { searchQuery, isListView } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const { showToast } = useToast();

  const fetchArchivedNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes/archived");
      setNotes(response.data.data);
    } catch (err) {
      showToast("Failed to fetch archived notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const handleUpdateNote = async (id, updatedFields) => {
    try {
      const response = await api.put(`/notes/${id}`, updatedFields);
      
      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === id ? response.data.data : n))
      );

      // Handle unarchived or trashed actions (remove immediately)
      if (updatedFields.isArchived === false) {
        showToast("Note unarchived", "info", 5000, {
          label: "Undo",
          onClick: async () => {
            await api.put(`/notes/${id}`, { isArchived: true });
            fetchArchivedNotes();
            showToast("Note archived", "success");
          },
        });
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      } else if (updatedFields.isTrashed) {
        showToast("Note moved to Trash", "info", 5000, {
          label: "Undo",
          onClick: async () => {
            await api.put(`/notes/${id}`, { isTrashed: false });
            fetchArchivedNotes();
            showToast("Note restored", "success");
          },
        });
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      }
    } catch (err) {
      showToast("Failed to update note", "error");
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
        <p>Syncing archives...</p>
      </div>
    );
  }

  return (
    <div className="notes-page-workspace">
      <div className="workspace-header">
        <h2>Archive</h2>
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🔍</span>
          <p>No notes matching your search query.</p>
        </div>
      )}

      {notes.length === 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">📦</span>
          <p>Your archived notes appear here.</p>
        </div>
      )}

      {filteredNotes.length > 0 && (
        <div className={`notes-grid ${isListView ? "list-view" : ""}`}>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onUpdate={handleUpdateNote}
              onEditClick={setSelectedNote}
            />
          ))}
        </div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onSave={handleUpdateNote}
        />
      )}
    </div>
  );
};

export default Archive;
