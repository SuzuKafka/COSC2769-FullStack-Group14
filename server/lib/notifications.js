// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

const Notification = require('../models/Notification');

function normaliseText(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

async function createNotification({ userId, title, message, link = null, metadata = null }) {
  const trimmedTitle = normaliseText(title);
  const trimmedMessage = normaliseText(message);

  if (!userId || !trimmedTitle || !trimmedMessage) {
    return null;
  }

  try {
    const doc = await Notification.create({
      user: userId,
      title: trimmedTitle,
      message: trimmedMessage,
      link: link ? normaliseText(link) : null,
      metadata: metadata || null,
    });
    return doc;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create notification', error);
    return null;
  }
}

async function createNotifications(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  const jobs = entries.map((entry) => createNotification(entry));
  return Promise.all(jobs);
}

module.exports = {
  createNotification,
  createNotifications,
};
