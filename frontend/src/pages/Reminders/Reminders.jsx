import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import NoteCard from "../../components/NoteCard";
import NoteModal from "../../components/NoteModal";
import { useToast } from "../../components/Toast";

const Reminders = () => {
  const { searchQuery, isListView } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const { showToast } = useToast();

  const fetchReminderNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes/reminders");
      setNotes(response.data.data);
    } catch (err) {
      showToast("Failed to fetch reminders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminderNotes();
  }, []);

  const handleUpdateNote = async (id, updatedFields) => {
    try {
      const response = await api.put(`/notes/${id}`, updatedFields);
      
      // Update state
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === id ? response.data.data : n))
      );

      // If reminder was removed or note was trashed/archived, filter out
      if (updatedFields.reminder === null) {
        showToast("Reminder removed", "info");
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      } else if (updatedFields.isTrashed || updatedFields.isArchived) {
        showToast(updatedFields.isTrashed ? "Moved to Trash" : "Note archived", "info");
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      }
    } catch (err) {
      showToast("Failed to update note", "error");
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
        <p>Syncing reminders...</p>
      </div>
    );
  }

  return (
    <div className="notes-page-workspace">
      <div className="workspace-header">
        <h2>Reminders</h2>
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🔍</span>
          <p>No reminders matching your search query.</p>
        </div>
      )}

      {notes.length === 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🔔</span>
          <p>Notes with upcoming reminders appear here.</p>
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

export default Reminders;
