import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";
import CreateNote from "../components/CreateNote";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import { useToast } from "../components/Toast";

const Home = () => {
  const { searchQuery, isListView } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const { showToast } = useToast();

  const fetchNotes = async () => {
    try {
      setLoading(false);
      const response = await api.get("/notes");
      setNotes(response.data.data);
    } catch (err) {
      showToast("Failed to fetch notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (noteData) => {
    // Only save if there's actual title or content
    if (!noteData.title && !noteData.content) return;

    try {
      const response = await api.post("/notes", noteData);
      setNotes((prevNotes) => [response.data.data, ...prevNotes]);
      showToast("Note created", "success");
    } catch (err) {
      showToast("Failed to create note", "error");
    }
  };

  const handleUpdateNote = async (id, updatedFields) => {
    try {
      const response = await api.put(`/notes/${id}`, updatedFields);
      
      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === id ? response.data.data : n))
      );

      // Interactive feedback messaging
      if (updatedFields.isTrashed) {
        showToast("Note moved to Trash", "info", 5000, {
          label: "Undo",
          onClick: async () => {
            await api.put(`/notes/${id}`, { isTrashed: false });
            fetchNotes();
            showToast("Note restored", "success");
          },
        });
        // Remove note immediately from active list
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
      } else if (updatedFields.isArchived) {
        showToast("Note archived", "info", 5000, {
          label: "Undo",
          onClick: async () => {
            await api.put(`/notes/${id}`, { isArchived: false });
            fetchNotes();
            showToast("Note unarchived", "success");
          },
        });
        // Remove note immediately from active list
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

  // Filter notes based on global search query
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  if (loading) {
    return (
      <div className="premium-loader-container">
        <div className="premium-loader"></div>
        <p>Syncing notes...</p>
      </div>
    );
  }

  return (
    <div className="notes-page-workspace">
      <CreateNote onSave={handleCreateNote} />

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">🔍</span>
          <p>No notes matching your search query.</p>
        </div>
      )}

      {notes.length === 0 && (
        <div className="empty-state-view">
          <span className="empty-state-icon">💡</span>
          <p>Notes you add appear here.</p>
        </div>
      )}

      {filteredNotes.length > 0 && (
        <div className="notes-layout-container">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="notes-section">
              <h4 className="section-title">Pinned</h4>
              <div className={`notes-grid ${isListView ? "list-view" : ""}`}>
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                    onEditClick={setSelectedNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Others Section */}
          {otherNotes.length > 0 && (
            <div className="notes-section">
              {pinnedNotes.length > 0 && <h4 className="section-title">Others</h4>}
              <div className={`notes-grid ${isListView ? "list-view" : ""}`}>
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                    onEditClick={setSelectedNote}
                  />
                ))}
              </div>
            </div>
          )}
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

export default Home;
