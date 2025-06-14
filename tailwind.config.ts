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
        mono: ['Space Mono', 'monospace'],
        display: ['Major Mono Display', 'monospace'],
      },
			colors: {
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
        terminal: {
          DEFAULT: 'hsl(var(--terminal))'
        },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
        "glitch-anim-1": {
          "0%": { clip: "rect(61px, 9999px, 52px, 0)" },
          "20%": { clip: "rect(33px, 9999px, 144px, 0)" },
          "40%": { clip: "rect(121px, 9999px, 115px, 0)" },
          "60%": { clip: "rect(144px, 9999px, 15px, 0)" },
          "80%": { clip: "rect(62px, 9999px, 180px, 0)" },
          "100%": { clip: "rect(84px, 9999px, 98px, 0)" },
        },
        "glitch-anim-2": {
          "0%": { clip: "rect(65px, 9999px, 119px, 0)" },
          "20%": { clip: "rect(78px, 9999px, 66px, 0)" },
          "40%": { clip: "rect(148px, 9999px, 99px, 0)" },
          "60%": { clip: "rect(122px, 9999px, 188px, 0)" },
          "80%": { clip: "rect(110px, 9999px, 159px, 0)" },
          "100%": { clip: "rect(86px, 9999px, 22px, 0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        "glitch-1": "glitch-anim-1 2s infinite linear alternate-reverse",
        "glitch-2": "glitch-anim-2 2s infinite linear alternate-reverse",
        "blink": "blink 1s infinite",
        "rotate": "rotate 20s linear infinite",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
