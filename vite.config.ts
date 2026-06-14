// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const isBuild = process.argv.includes("build") || process.env.NODE_ENV === "production";

export default defineConfig({
	vite: {
		publicDir: "public",
		server: {
			proxy: {
				"/api": {
					target: "http://localhost:4000",
					changeOrigin: true,
					timeout: 1000,
					proxyTimeout: 1000,
				},
			},
		},
		environments: {
			ssr: {
				optimizeDeps: {
					include: ["react-dom/server"],
				},
			},
		},
	},
	cloudflare: false,
	plugins: isBuild ? [nitro({ preset: "vercel" })] : [],
});

