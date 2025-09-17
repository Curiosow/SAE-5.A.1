/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/components/**/*.{js,vue,ts}",
        "./src/layouts/**/*.vue",
        "./src/pages/**/*.vue",
        "./src/plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    theme: {
        extend: {
            colors: {
                roseLight: {
                    50: '#fff1f6',
                    100: '#ffe4ef',
                    200: '#fecdd6',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
            },
            animation: {
                // LUEURS
                light1: 'moveLight1 12s ease-in-out infinite',
                light2: 'moveLight2 18s ease-in-out infinite',
                light3: 'moveLight3 22s ease-in-out infinite',
                pulseLight: 'pulseLight 6s ease-in-out infinite',
                // PARTICULES
                float1: 'floatParticle1 8s ease-in-out infinite',
                float2: 'floatParticle2 10s ease-in-out infinite',
                float3: 'floatParticle3 12s ease-in-out infinite',
                twinkle: 'twinkle 3s ease-in-out infinite',
            },
            keyframes: {
                /* Déplacement des lueurs : on anime le transform
                   (plus fiable que background-position sur radial-gradient) */
                moveLight1: {
                    '0%': { transform: 'translate(0%, 0%) scale(1)' },
                    '50%': { transform: 'translate(18%, 26%) scale(1.05)' },
                    '100%': { transform: 'translate(0%, 0%) scale(1)' },
                },
                moveLight2: {
                    '0%': { transform: 'translate(0%, 0%) scale(1)' },
                    '50%': { transform: 'translate(-16%, -12%) scale(1.03)' },
                    '100%': { transform: 'translate(0%, 0%) scale(1)' },
                },
                moveLight3: {
                    '0%': { transform: 'translate(0%, 0%) scale(1)' },
                    '50%': { transform: 'translate(10%, -20%) scale(1.04)' },
                    '100%': { transform: 'translate(0%, 0%) scale(1)' },
                },
                pulseLight: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },

                /* Variantes de flottement pour les particules (parcours et opacité) */
                floatParticle1: {
                    '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.7' },
                    '50%': { transform: 'translateY(-32px) translateX(10px) scale(1.06)', opacity: '1' },
                    '100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.7' },
                },
                floatParticle2: {
                    '0%': { transform: 'translateY(0) translateX(0) scale(0.9)', opacity: '0.6' },
                    '50%': { transform: 'translateY(-50px) translateX(-12px) scale(1.02)', opacity: '0.92' },
                    '100%': { transform: 'translateY(0) translateX(0) scale(0.9)', opacity: '0.6' },
                },
                floatParticle3: {
                    '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.8' },
                    '50%': { transform: 'translateY(-40px) translateX(6px) scale(1.08)', opacity: '1' },
                    '100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.8' },
                },

                /* Scintillement doux */
                twinkle: {
                    '0%, 100%': { opacity: '0.65' },
                    '50%': { opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'rose-light': 'radial-gradient(ellipse at 60% 0%, rgba(236, 72, 153, 0.22) 0%, transparent 70%)',
            },
        },
    },
    plugins: [],
}