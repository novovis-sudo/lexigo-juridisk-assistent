
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'serif': ['Space Grotesk', 'serif'],
				'sans': ['Inter', 'sans-serif'],
				'legal': ['Space Grotesk', 'serif'],
			},
			colors: {
				// HackTheBox-inspired dark theme with Swedish accents
				dark: {
					bg: '#0a0a0b',
					surface: '#111114',
					card: '#1a1a1e',
					border: '#2a2a2f',
					accent: '#333338',
				},
				swedish: {
					blue: '#0066cc',
					yellow: '#ffcd00',
					lightBlue: '#4da6ff',
					darkBlue: '#003d7a',
				},
				cyber: {
					green: '#00ff88',
					orange: '#ff6b35',
					purple: '#9d4edd',
					cyan: '#06ffa5',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'cyber': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
				'cyber-blue': '0 0 20px rgba(77, 166, 255, 0.3), 0 0 40px rgba(77, 166, 255, 0.1)',
				'cyber-purple': '0 0 20px rgba(157, 78, 237, 0.3), 0 0 40px rgba(157, 78, 237, 0.1)',
				'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
				'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.8), 0 0 30px rgba(0, 255, 136, 0.6)' }
				},
				'progress-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-value, 100%)' }
				},
				'badge-unlock': {
					'0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
					'50%': { transform: 'scale(1.2) rotate(0deg)', opacity: '0.8' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'cyber-typing': {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.4s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'progress-fill': 'progress-fill 1s ease-out',
				'badge-unlock': 'badge-unlock 0.6s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'cyber-typing': 'cyber-typing 2s steps(20) infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
