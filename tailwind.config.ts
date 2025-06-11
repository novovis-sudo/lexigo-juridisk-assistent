
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
				'heading': ['Crimson Text', 'Georgia', 'serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
			},
			colors: {
				// Professional color system
				professional: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				},
				legal: {
					gold: '#b7955f',
					navy: '#1e3a8a',
					burgundy: '#7f1d1d',
					teal: '#0e7490',
					slate: '#334155',
				},
				// Semantic color mappings
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
				'professional': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'professional-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'professional-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'professional-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'inner-subtle': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			keyframes: {
				'professional-fade-in': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(10px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0)' 
					}
				},
				'professional-scale-in': {
					'0%': { 
						opacity: '0', 
						transform: 'scale(0.95)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'scale(1)' 
					}
				},
				'professional-slide-in': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(-10px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					}
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'professional-fade-in': 'professional-fade-in 0.4s ease-out',
				'professional-scale-in': 'professional-scale-in 0.3s ease-out',
				'professional-slide-in': 'professional-slide-in 0.3s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			typography: {
				DEFAULT: {
					css: {
						color: 'hsl(var(--foreground))',
						fontFamily: 'Inter, system-ui, sans-serif',
						lineHeight: '1.6',
						h1: {
							fontFamily: 'Crimson Text, Georgia, serif',
							fontWeight: '600',
							letterSpacing: '-0.025em',
						},
						h2: {
							fontFamily: 'Crimson Text, Georgia, serif',
							fontWeight: '600',
							letterSpacing: '-0.025em',
						},
						h3: {
							fontFamily: 'Crimson Text, Georgia, serif',
							fontWeight: '600',
							letterSpacing: '-0.025em',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
