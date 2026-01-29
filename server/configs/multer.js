import multer from "multer";

// We switch to memoryStorage because Vercel is a Read-Only file system
const storage = multer.memoryStorage();

export const upload = multer({ storage });