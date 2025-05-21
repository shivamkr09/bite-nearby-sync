import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://msfzehtlunkptuegwukh.supabase.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/razorpay-payment-verification": {
        target: "https://msfzehtlunkptuegwukh.supabase.co/functions/v1/razorpay-payment-verification",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/razorpay-payment-verification/, ""),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
