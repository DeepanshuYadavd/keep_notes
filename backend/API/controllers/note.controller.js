import { Note } from "../models/note.schema.js";

// Get active notes (not archived, not trashed)
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.user.id,
      isArchived: false,
      isTrashed: false,
    }).sort({ isPinned: -1, updatedAt: -1 });

    return res.status(200).json({
      data: notes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get archived notes (isArchived = true, isTrashed = false)
export const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.user.id,
      isArchived: true,
      isTrashed: false,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      data: notes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get trashed notes
export const getTrashedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.user.id,
      isTrashed: true,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      data: notes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get notes with reminders
export const getReminderNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.user.id,
      isTrashed: false,
      reminder: { $ne: null },
    }).sort({ reminder: 1 });

    return res.status(200).json({
      data: notes,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, color, isPinned, isArchived, reminder } = req.body;
    
    const note = await Note.create({
      title: title || "",
      content: content || "",
      color: color || "#ffffff",
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      reminder: reminder || null,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Note created successfully",
      data: note,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find note and ensure ownership
    const note = await Note.findOne({ _id: id, createdBy: req.user.id });
    if (!note) {
      return res.status(404).json({
        message: "Note not found or unauthorized",
      });
    }

    // Extract updateable fields
    const { title, content, color, isPinned, isArchived, isTrashed, reminder } = req.body;
    
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;
    if (isTrashed !== undefined) {
      note.isTrashed = isTrashed;
      // If moving to trash, unpin it
      if (isTrashed) {
        note.isPinned = false;
      }
    }
    if (reminder !== undefined) note.reminder = reminder;

    const updatedNote = await note.save();

    return res.status(200).json({
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Permanently delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, createdBy: req.user.id });

    if (!note) {
      return res.status(404).json({
        message: "Note not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Note permanently deleted",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Empty all trashed notes
export const emptyTrash = async (req, res) => {
  try {
    await Note.deleteMany({
      createdBy: req.user.id,
      isTrashed: true,
    });

    return res.status(200).json({
      message: "Trash emptied successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
