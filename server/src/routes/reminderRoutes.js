import express from "express";
import Contact from "../models/contact.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/reminders/upcoming
router.get("/upcoming", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowParam = req.query.days ?? process.env.REMINDER_WINDOW_DAYS;

    let windowDays;
    if (!windowParam) {
      windowDays = 365; // default to one year if not provided
    } else if (typeof windowParam === "string" && windowParam.toLowerCase() === "all") {
      windowDays = Infinity;
    } else {
      const parsed = Number(windowParam);
      windowDays = Number.isFinite(parsed) && parsed >= 0 ? parsed : 365;
    }

    const windowEnd = Number.isFinite(windowDays)
      ? new Date(today.getTime() + windowDays * 24 * 60 * 60 * 1000)
      : null;
    if (windowEnd) {
      windowEnd.setHours(0, 0, 0, 0);
    }

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User context missing" });
    }

    // support both current (ownerId) and legacy (user) references
    const contacts = await Contact.find({
      $or: [{ ownerId: userId }, { user: userId }],
    }).lean();

    const upcoming = [];

    const friendlyType = (type, label) => {
      if (!type) return label || "Event";
      const t = type.toLowerCase();
      if (t.includes("birth")) return "Birthday";
      if (t.includes("wedding") || t.includes("marriage")) return "Marriage Anniversary";
      if (t.includes("death") || t.includes("deceased")) return "Death Anniversary";
      return label || type.charAt(0).toUpperCase() + type.slice(1);
    };

    const pushReminder = (contact, dateValue, { type, label, recurring }) => {
      if (!dateValue) return;
      const eventDate = new Date(dateValue);
      if (Number.isNaN(eventDate.valueOf())) return;

      const occurrence = new Date(eventDate);
      occurrence.setFullYear(today.getFullYear());
      occurrence.setHours(0, 0, 0, 0);

      if (occurrence < today) {
        const shouldRepeat = recurring ?? true; // default to recurring for legacy data
        if (shouldRepeat) {
          occurrence.setFullYear(today.getFullYear() + 1);
          occurrence.setHours(0, 0, 0, 0);
        }
      }

      if (occurrence < today) return; // non-recurring event already passed
      if (windowEnd && occurrence > windowEnd) return;

      if (occurrence >= today) {
        const first = contact.firstName || "";
        const last = contact.lastName ? ` ${contact.lastName}` : "";
        const fallbackName = contact.name || `${first}${last}`.trim();
        const name = fallbackName || "Unknown";

        upcoming.push({
          name,
          type: friendlyType(type, label),
          date: occurrence.toDateString(),
        });
      }
    };

    contacts.forEach((contact) => {
      // Handle new schema with events array
      if (Array.isArray(contact.events) && contact.events.length > 0) {
        contact.events.forEach((event) => {
          if (!event || !event.date) return;
          pushReminder(contact, event.date, {
            type: event.type,
            label: event.label,
            recurring: event.recurring,
          });
        });
      }

      // Handle legacy flat fields if present
      [
        { key: "birthday", label: "Birthday" },
        { key: "marriageAnniversary", label: "Marriage Anniversary" },
        { key: "deathAnniversary", label: "Death Anniversary" },
      ].forEach(({ key, label }) => {
        if (contact[key]) {
          pushReminder(contact, contact[key], {
            type: label,
            label,
            recurring: true,
          });
        }
      });
    });

    // sort by date ascending
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ upcoming });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;