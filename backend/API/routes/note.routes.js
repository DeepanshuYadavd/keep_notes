import express from "express";
import {
  getNotes,
  getArchivedNotes,
  getTrashedNotes,
  getReminderNotes,
  createNote,
  updateNote,
  deleteNote,
  emptyTrash,
} from "../controllers/note.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All note routes require authentication
router.use(authenticateUser);

router.get("/", getNotes);
router.get("/archived", getArchivedNotes);
router.get("/trashed", getTrashedNotes);
router.get("/reminders", getReminderNotes);
router.post("/", createNote);
router.delete("/trash/empty", emptyTrash);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
