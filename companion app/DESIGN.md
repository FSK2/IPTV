---
name: Deep Nord Cyberpunk
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#bccac2'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#87948d'
  outline-variant: '#3d4944'
  surface-tint: '#68dbb3'
  primary: '#d1ffea'
  on-primary: '#003829'
  primary-container: '#7bedc4'
  on-primary-container: '#006b51'
  inverse-primary: '#006c51'
  secondary: '#45dfa4'
  on-secondary: '#003825'
  secondary-container: '#00bd85'
  on-secondary-container: '#00452e'
  tertiary: '#f9f3ff'
  on-tertiary: '#381385'
  tertiary-container: '#dfd2ff'
  on-tertiary-container: '#674bb5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#86f7ce'
  primary-fixed-dim: '#68dbb3'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513c'
  secondary-fixed: '#68fcbf'
  secondary-fixed-dim: '#45dfa4'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#e8ddff'
  tertiary-fixed-dim: '#cebdff'
  on-tertiary-fixed: '#21005e'
  on-tertiary-fixed-variant: '#4f319c'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-mono-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  space-4xl: 6rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  container-max: 80rem
---

## Brand & Style

This design system targets power users, systems engineers, and game-adjacent developers who demand ultra-performant, high-density tooling. The aesthetic merges the frozen, disciplined utility of Nordic minimalism with the visceral, high-tech pulse of cyberpunk terminal interfaces.

It rejects garish magenta/yellow retro-futurism in favor of sub-zero darkness: deep arctic night backgrounds, crystalline obsidian chassis panels, and razor-sharp bioluminescent accents in electric mint and cyber violet. The interface evokes precise instrumentation, hardware mastery, and high-velocity workflow orchestration. Glassmorphic layers, fine vector grids, and sub-pixel edge glows deliver tactile depth without sacrificing runtime performance or information density.

## Colors

The foundation is anchored in `#0b0f19` (Void Abyss) as the overarching viewport canvas, supported by `#111827` (Obsidian Base) for surface enclosures and `#162032` for elevated controls.

- **Primary (`#7bedc4` - Electric Mint):** Reserved for primary interactive triggers, active states, and focal metrics. Emits a localized glow (`0 0 20px rgba(123, 237, 196, 0.35)`) on hover and active execution.
- **Secondary (`#34d399` - Neon Emerald):** Conveys real-time telemetry, healthy telemetry loops, operational statuses, and live socket connectivity.
- **Tertiary (`#a78bfa` - Cyber Violet):** Dedicated to auxiliary telemetry, secondary tags, code syntax symbols, and hardware routing indicators.
- **Borders & Dividers:** Built using strict alpha levels: `rgba(255, 255, 255, 0.08)` for primary panel boundaries, rising to `rgba(123, 237, 196, 0.25)` when focused or active.
- **Text Hierarchy:** Text tokens scale from `#f9fafb` (98% high-contrast white) to `#94a3b8` (cool slate secondary) down to `#475569` (disabled/structural code guides).

## Typography

The type scale balances futuristic engineering poise with absolute legibility:

- **Space Grotesk** is applied across all major headlines and hero hooks. Its geometric quirks and sharp tech undertones bring distinctive authority to the branding.
- **Geist** handles the reading load across feature breakdowns, descriptions, and operational documentation, delivering a clinical, clean surface feel with optimized screen rendering.
- **JetBrains Mono** is mandatory for telemetry data, protocol badges, macro tags, terminal snippets, and performance metrics. Labels marked with `label-mono-xs` should always be rendered in uppercase to preserve utility hardware aesthetics.

## Layout & Spacing

The layout is built on a 12-column dynamic desktop grid capped at `80rem` (1280px) to maintain immediate visibility across widescreen monitors and companion displays.

- **Grid & Gutters:** Desktop uses `gutter-desktop` (32px) gutters and outer padding. Mobile cascades down to a 4-column structure with `gutter-mobile` (16px) margins.
- **Micro Rhythms:** Interior card layouts, data tables, and input docks are locked to an 8px base rhythm (`space-xs` = 4px for tight badge padding, `space-sm` = 8px for item separation, `space-md` = 16px for card gutters).
- **Reflow Principles:** On screens under 1024px, split hardware mockups and companion displays drop from multi-column split views to vertical stacks with zero margin decay, keeping terminal readouts crisp and uncompressed.

## Elevation & Depth

Visual hierarchy uses frosted glassmorphic layering combined with calibrated micro-glows:

- **Layer 0 (Viewport Canvas):** Solid `#0b0f19` overlaid with an ultra-subtle radial matrix dot pattern (`rgba(123, 237, 196, 0.03)` at 24px increments).
- **Layer 1 (Card & Shell Panels):** Background `#111827` blended with `rgba(17, 24, 39, 0.75)` backdrop blur (16px), bordered by `1px solid rgba(255, 255, 255, 0.08)`.
- **Layer 2 (Elevated Nodes & Flyouts):** Background `#162032` with `1px solid rgba(255, 255, 255, 0.12)`, casting an ambient diffuse shadow: `0 8px 32px rgba(0, 0, 0, 0.55)`.
- **Layer 3 (Micro Glows & Active Hardware Highlights):** Elements in focus or execution receive a double-edge trace: an inner stroke of `1px solid #7bedc4` coupled with an exterior radiant aura of `0 0 16px rgba(123, 237, 196, 0.25)`. Violet telemetry variations apply the equivalent aura with `#a78bfa`.

## Shapes

The design uses tight, machined corners (`roundedness: 1`) to reinforce precision engineering and equipment design. Soft, pill-shaped bubbles are strictly avoided.

- Buttons, panels, and input fields use a base `4px` (`rounded-sm`) to `8px` (`rounded-lg`) radius.
- Macro keys and hardware companion dock cells strictly mirror the physical curvature of high-end programmable deck keys (`8px` perimeter radius with an inner inset bevel).
- Cut-corner (chamfered) accents can be applied via 45-degree clip-paths on promotional badges and terminal window heads to reinforce the cyberpunk identity.

## Components

### Buttons
- **Primary Cyber Button:** Solid Electric Mint background (`#7bedc4`), text in `#0b0f19` (`label-mono-md`, bold). Subtle inset highlight with a hover state expanding to a neon bloom (`box-shadow: 0 0 20px rgba(123, 237, 196, 0.4)`).
- **Secondary Shell Button:** Background `rgba(255, 255, 255, 0.03)`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#f9fafb`. Hover triggers a border shift to `#7bedc4` and text illumination.
- **Ghost Action:** Transparent background with `#a78bfa` text and subtle violet glow on interaction.

### Cards & Panels
- Constructed from `#111827` at 80% opacity with `backdrop-filter: blur(12px)`.
- Enclosed with a `1px` border of `rgba(255, 255, 255, 0.08)`.
- Top borders optionally feature a directional linear gradient: `transparent 0%, rgba(123, 237, 196, 0.4) 50%, transparent 100%` acting as a subtle luminescent edge.

### Chips & Monospace Badges
- Strict JetBrains Mono font (`label-mono-xs`), uppercase with `0.08em` tracking.
- Styled as translucent pills: `rgba(123, 237, 196, 0.08)` background, `#7bedc4` text, and `1px solid rgba(123, 237, 196, 0.25)`.
- Telemetry variants alternate with Violet (`rgba(167, 139, 250, 0.1)` fill and `#a78bfa` text).

### Form Controls & Inputs
- Inputs utilize an inset recessed field (`#0b0f19`) bordered by `rgba(255, 255, 255, 0.1)`.
- Focus states trigger an animated border color transition to `#7bedc4` and a faint outer glow. Placeholders are styled in muted slate `#475569`.
- Checkboxes and toggles are squared (`rounded-sm`) with a live status pip that illuminates in `#34d399` when active.

### DevDeck Companion Grid Module
- Specialized component representing the PC companion pad: an array of interactive physical-style macro cells. Each key features an obsidian base with customizable icon readouts, a sub-pixel border, and reactive micro-glow pulses when triggered via keystroke or RPC hook.