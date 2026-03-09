/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#030303', // Near black
                surface: '#0a0a0a',
                surfaceLight: '#171717',
                primary: '#10b981', // Emerald 500
                primaryHover: '#059669', // Emerald 600
                secondary: '#3b82f6', // Blue 500
                textMain: '#fafafa',
                textMuted: '#a1a1aa',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
