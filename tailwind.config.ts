
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
				'serif': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'sans-serif'],
				'legal': ['IBM Plex Serif', 'serif'],
			},
			colors: {
				// Premium legal color palette
				ebony: {
					50: '#f8f8f9',
					100: '#f1f1f3',
					200: '#dfdfe4',
					300: '#c8c8d0',
					400: '#ababba',
					500: '#9090a7',
					600: '#7a7a94',
					700: '#6b6b82',
					800: '#5a5a6d',
					900: '#4a4e69',
					950: '#1c1c1e',
				},
				gold: {
					50: '#fefbeb',
					100: '#fdf2c7',
					200: '#fbe68a',
					300: '#f8d44d',
					400: '#f5c421',
					500: '#e5a50a',
					600: '#d4af37',
					700: '#a16207',
					800: '#854d0e',
					900: '#713f12',
					950: '#422006',
				},
				parchment: {
					50: '#fefefe',
					100: '#fdfdfd',
					200: '#f9f9f9',
					300: '#f3f3f3',
					400: '#eae7dc',
					500: '#d6d3cc',
					600: '#b8b5ad',
					700: '#9a978f',
					800: '#7c7974',
					900: '#636059',
					950: '#3a3936',
				},
				charcoal: {
					50: '#f6f6f6',
					100: '#e7e7e7',
					200: '#d1d1d1',
					300: '#b0b0b0',
					400: '#888888',
					500: '#6d6d6d',
					600: '#5d5d5d',
					700: '#4f4f4f',
					800: '#454545',
					900: '#3d3d3d',
					950: '#2c2c2c',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'premium': '0 8px 32px rgba(28, 28, 30, 0.12)',
				'premium-lg': '0 16px 64px rgba(28, 28, 30, 0.15)',
				'gold-glow': '0 4px 20px rgba(212, 175, 55, 0.25)',
				'soft': '0 2px 8px rgba(28, 28, 30, 0.08)',
			},
			backgroundImage: {
				'wood-grain': 'linear-gradient(45deg, #2c2c2c 0%, #1c1c1e 25%, #2c2c2c 50%, #1c1c1e 75%, #2c2c2c 100%)',
				'leather-texture': 'radial-gradient(circle at 25% 25%, #2c2c2c 0%, #1c1c1e 50%)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'premium-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'premium-fade-in': 'premium-fade-in 0.4s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
