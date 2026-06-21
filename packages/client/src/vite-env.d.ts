// Vite handles CSS imports at build time; TypeScript doesn't need to know the type.
declare module '*.css'

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
