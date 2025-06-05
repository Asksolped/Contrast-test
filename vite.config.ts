import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Contrast-test/", // this MUST match the repo name
  plugins: [react()],
});
