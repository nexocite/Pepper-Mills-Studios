import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: If your repo name changes, update `base` to match the repo slug.
// For this repo, it's '/Pepper-Mills-Studios/'.
export default defineConfig({
  plugins: [react()],
  base: "/Pepper-Mills-Studios/",
});
