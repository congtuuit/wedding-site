# Wedding Invitation Website --- Master Implementation Plan

## 0. Project Vision

Build a **premium, elegant, cinematic wedding invitation website** for:

-   **Couple:** Tú Văn & Hường Nguyễn
-   **Wedding date:** 12 . 12 . 2026
-   **Primary experience:** Mobile-first
-   **Style:** Minimalist + Elegant + Romantic + Editorial
-   **Core feeling:** A digital wedding invitation, not a conventional
    marketing website
-   **Technical stack:** Next.js + TypeScript + Tailwind CSS
-   **Deployment:** Static export on GitHub Pages

The website should feel like opening a physical wedding invitation: a
short cinematic opening, refined typography, subtle motion, emotional
photography, gentle background music, and very little visual clutter.

------------------------------------------------------------------------

# 1. Design Direction

## 1.1 Visual keywords

Use these keywords as the design north star:

> Elegant / Editorial / Romantic / Minimal / Organic / Cinematic / Soft
> / Timeless

Avoid:

-   Excessive gradients
-   Heavy shadows
-   Neon colors
-   Overly colorful UI
-   Generic wedding-template appearance
-   Excessive animations
-   Large amounts of text
-   UI that looks like an admin/dashboard

## 1.2 Color palette

Derive the palette from the wedding photos:

-   Ivory / Wedding White --- primary background
-   Sage / Botanical Green --- secondary accent
-   Charcoal / Near Black --- primary text
-   Warm Gray --- secondary text
-   Very subtle Gold / Champagne --- optional micro-accent

Create CSS variables so the palette can be adjusted centrally.

Example conceptual tokens:

``` text
--color-background
--color-surface
--color-text
--color-muted
--color-accent
--color-accent-soft
--color-border
```

Do not hard-code colors throughout components.

------------------------------------------------------------------------

# 2. Typography

Use typography as a major part of the visual identity.

## Recommended pairing

### Display font

Use an elegant serif such as:

-   Cormorant Garamond
-   Playfair Display
-   Bodoni Moda

### Body font

Use a clean sans-serif such as:

-   Inter
-   Manrope
-   DM Sans

### Optional handwritten accent

A restrained script font can be used only for small romantic accents.

Rules:

-   Couple names should feel premium and editorial.
-   Body text must remain highly readable.
-   Avoid using script fonts for paragraphs.
-   Use large typography instead of decorative UI elements.

------------------------------------------------------------------------

# 3. Information Architecture

The website should be a single-page experience with logical sections:

1.  Opening / Envelope
2.  Hero
3.  Invitation message
4.  Countdown
5.  Wedding events
6.  Couple story / optional
7.  Photo gallery
8.  RSVP
9.  Wishes / guest messages
10. Gift / QR section
11. Closing / Thank You
12. Footer

Suggested anchors:

``` text
#home
#invitation
#countdown
#events
#gallery
#rsvp
#wishes
#gift
```

------------------------------------------------------------------------

# 4. Opening Experience --- "Open the Invitation"

This is one of the most important differentiators.

When a visitor first enters the site, do NOT immediately expose the
entire page.

Display a full-screen invitation cover.

## Visual concept

``` text
┌──────────────────────────────┐
│                              │
│          12 . 12 . 2026      │
│                              │
│          Tú Văn              │
│             &                │
│        Hường Nguyễn          │
│                              │
│      ┌────────────────┐      │
│      │  MỞ THIỆP ✦    │      │
│      └────────────────┘      │
│                              │
│      Một lời mời đặc biệt    │
│                              │
└──────────────────────────────┘
```

## Opening animation

Sequence:

1.  Background appears.
2.  Date fades in.
3.  Couple names appear.
4.  Small decorative element appears.
5.  "Mở thiệp" button becomes active.
6.  User taps.
7.  Envelope / curtain / card-opening animation plays.
8.  Background music starts.
9.  Opening screen transitions into Hero.

The animation should take approximately 1--2 seconds.

Avoid long intro animations that block the user.

------------------------------------------------------------------------

# 5. Background Music

Music should be part of the experience but never annoy the visitor.

## Behavior

Initial state:

``` text
Music = OFF
```

After user presses "Mở thiệp":

``` text
Music = ON
```

This avoids relying on autoplay behavior that browsers may block.

## Music UI

Create a small floating music button:

``` text
♪ / 🔊
```

States:

-   Playing
-   Paused

The button should have:

-   Minimum 44x44px touch area
-   Fixed position
-   Accessible label
-   Subtle animation while playing

## Technical requirements

Create:

``` text
MusicController
```

Responsibilities:

-   play()
-   pause()
-   toggle()
-   volume control
-   preserve state during navigation
-   gracefully handle browser autoplay restrictions

Audio should be compressed and optimized for mobile.

------------------------------------------------------------------------

# 6. Hero Section

Hero should occupy approximately:

``` text
min-height: 100svh
```

Use `100svh` rather than only `100vh` to behave better on mobile
browsers.

## Content

``` text
Tú Văn
&
Hường Nguyễn

12 . 12 . 2026

[Xác nhận tham dự]
```

## Image treatment

Use the strongest wedding photograph.

Recommended:

-   Full-screen image
-   `object-fit: cover`
-   subtle dark/soft overlay when required for text contrast
-   avoid excessive blur

The hero should immediately communicate:

> "This is a wedding invitation."

------------------------------------------------------------------------

# 7. Header

Keep the header extremely lightweight.

Desktop:

``` text
Logo / Couple Initials

Story
Events
Gallery
RSVP
```

Mobile:

``` text
[☰]
```

Hamburger opens a full-screen or elegant side navigation.

Menu links:

-   Trang chủ
-   Lời mời
-   Lịch cưới
-   Album
-   RSVP
-   Mừng cưới

When selecting an item:

1.  Close menu
2.  Smooth-scroll to section
3.  Maintain accessibility focus behavior

------------------------------------------------------------------------

# 8. Invitation Message

Create an emotional but concise section.

Visual approach:

Large quotation mark / decorative serif typography.

Example structure:

``` text
"Ngày hôm nay,
chúng mình chọn ở bên nhau
cho những ngày tháng về sau."

Trân trọng kính mời...
```

Keep the section spacious.

Do not create a huge wall of text.

------------------------------------------------------------------------

# 9. Countdown

Create a visually elegant countdown.

Structure:

``` text
COUNTDOWN

  109        08        42        17
 Days       Hours     Minutes   Seconds
```

Requirements:

-   Live update every second
-   Correct timezone: `Asia/Ho_Chi_Minh`
-   Handle date expiration gracefully
-   No hydration mismatch
-   Avoid unnecessary React re-renders

When countdown reaches zero:

``` text
Hôm nay là ngày chúng mình về chung một nhà.
```

## Technical implementation

Use a client-side countdown component.

Important:

-   Do not depend on server time for every tick.
-   Calculate from a fixed target timestamp.
-   Clean up `setInterval`.
-   Prevent memory leaks.

------------------------------------------------------------------------

# 10. Wedding Events

Create two premium event cards.

## Event 1 --- Lễ Gia Tiên

Content:

-   Event title
-   Date
-   Time
-   Address
-   Dress code if required
-   Map button

## Event 2 --- Tiệc Cưới

Content:

-   Event title
-   Date
-   Time
-   Venue
-   Address
-   Map button

Each card:

``` text
┌───────────────────────────┐
│       LỄ GIA TIÊN         │
│                           │
│    12 • 12 • 2026         │
│       09:00 AM             │
│                           │
│      [Tên địa điểm]       │
│      [Địa chỉ]            │
│                           │
│    [Nhận chỉ đường ↗]     │
└───────────────────────────┘
```

## Google Maps

Create a reusable:

``` text
MapButton
```

The destination URL should be stored in configuration/data rather than
hard-coded inside JSX.

------------------------------------------------------------------------

# 11. Gallery

This should be one of the visual highlights.

## Recommended layout

Use an editorial masonry-like grid.

Mobile:

``` text
┌────────────┐
│            │
│    IMG     │
│            │
├──────┬─────┤
│ IMG  │ IMG │
├──────┴─────┤
│            │
│    IMG     │
└────────────┘
```

Desktop:

Use a responsive masonry/editorial grid.

## Interaction

Tap an image:

``` text
Gallery → Lightbox
```

Lightbox requirements:

-   Full-screen
-   Swipe left/right on mobile
-   Previous/next buttons
-   Close button
-   Keyboard support
-   Image counter
-   Prevent background scroll

Touch targets:

``` text
minimum 44x44px
```

------------------------------------------------------------------------

# 12. Image Optimization

This is critical.

Use Next.js image optimization where compatible with the deployment
strategy.

For static GitHub Pages, verify the final `next/image` configuration.

Recommended strategy:

``` text
Original photos
      ↓
Resize/compress
      ↓
WebP / AVIF
      ↓
Responsive sizes
      ↓
Lazy loading
```

Recommended image sizes:

-   Hero: optimized high-resolution version
-   Gallery thumbnails: smaller responsive versions
-   Lightbox: larger version

Do NOT load full-resolution wedding photos immediately.

------------------------------------------------------------------------

# 13. RSVP

RSVP should be extremely simple.

Fields:

``` text
Tên khách mời
○ Có, tôi sẽ tham dự
○ Rất tiếc, tôi không thể tham dự
Số người đi cùng
Lời chúc
[Xác nhận]
```

## UX

Use:

-   Large labels
-   Large inputs
-   Strong focus state
-   44px+ interactive areas
-   Clear validation
-   Friendly success state

Example:

``` text
Cảm ơn bạn!
Chúng mình rất mong được gặp bạn
trong ngày đặc biệt này.
```

## Data architecture

Since the website is static:

Separate UI from submission logic.

Recommended abstraction:

``` text
submitRSVP(data)
```

Possible backend can be connected later without rewriting the UI.

Do not couple the RSVP form directly to a specific provider.

------------------------------------------------------------------------

# 14. Wishes / Guest Messages

Create a simple message section.

Example:

``` text
GỬI LỜI CHÚC

[ Tên của bạn ]

[ Viết lời chúc... ]

[ Gửi lời chúc ]

──────────────────

"Chúc hai bạn trăm năm hạnh phúc..."

— Nguyễn A
```

Messages should be displayed elegantly.

Avoid making it look like a social network.

------------------------------------------------------------------------

# 15. Gift / QR Section

Create a dedicated "Mừng cưới" section.

Concept:

``` text
MỪNG CƯỚI

Sự hiện diện của bạn
là món quà quý giá nhất.

Nếu bạn muốn gửi lời chúc
theo một cách đặc biệt hơn:

[ QR CỦA CÔ DÂU ]   [ QR CỦA CHÚ RỂ ]

Tên ngân hàng
Số tài khoản
Chủ tài khoản

[ Sao chép số tài khoản ]
```

## UX

Clicking account number:

``` text
Copy → "Đã sao chép"
```

QR images should open in a larger lightbox.

Do not expose sensitive financial information in source code if the
final project requires it to remain private.

------------------------------------------------------------------------

# 16. Bottom Navigation

On mobile, create a small floating/fixed navigation bar.

Recommended actions:

``` text
[ RSVP ] [ Bản đồ ] [ Mừng cưới ]
```

Rules:

-   Only visible on mobile
-   Safe-area aware
-   `padding-bottom: env(safe-area-inset-bottom)`
-   Large touch targets
-   Semi-transparent elegant background
-   Subtle backdrop blur
-   Avoid covering important content

Do not make it visually dominant.

------------------------------------------------------------------------

# 17. Scroll Animations

Use motion carefully.

Recommended effects:

-   Fade up
-   Fade in
-   Small image reveal
-   Gentle scale
-   Text stagger

Avoid:

-   Excessive parallax
-   Large rotations
-   Bouncing
-   Constant animations
-   Heavy blur animations

## Accessibility

Respect:

``` text
prefers-reduced-motion
```

If enabled:

-   Disable decorative animation
-   Keep transitions minimal
-   Preserve all functionality

------------------------------------------------------------------------

# 18. Section Transition Design

Avoid abrupt section changes.

Use:

-   whitespace
-   subtle separators
-   botanical shapes
-   thin lines
-   small decorative ornaments

Possible motif:

``` text
        ✦
──────────────
```

or botanical SVG line art.

Keep decorations subtle.

------------------------------------------------------------------------

# 19. Responsive Design

## Mobile --- primary

Target:

``` text
360px
375px
390px
414px
```

Must work correctly on:

-   iPhone SE-sized screens
-   modern iPhones
-   Android phones

## Tablet

Target:

``` text
768px+
```

## Desktop

Target:

``` text
1280px+
1440px+
1920px+
```

Desktop should not simply be a stretched mobile layout.

Use wider editorial compositions.

------------------------------------------------------------------------

# 20. Accessibility

Minimum requirements:

-   Semantic HTML
-   Proper heading hierarchy
-   Alt text
-   Keyboard navigation
-   Visible focus states
-   `aria-label` for icon-only buttons
-   Color contrast
-   Reduced motion
-   Form labels
-   Accessible modal/lightbox
-   Escape key closes modal
-   Focus management

Target:

``` text
WCAG 2.1 AA
```

------------------------------------------------------------------------

# 21. Performance Strategy

Target Lighthouse:

``` text
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

## Performance rules

-   Compress images
-   Lazy load gallery
-   Preload only critical hero assets
-   Minimize JavaScript
-   Avoid unnecessary third-party libraries
-   Use CSS animations where possible
-   Dynamic import heavy components
-   Optimize fonts
-   Avoid large background videos
-   Compress audio
-   Prevent layout shift

------------------------------------------------------------------------

# 22. Component Architecture

Suggested structure:

``` text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── ...
│
├── components/
│   ├── wedding/
│   │   ├── WeddingOpening.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InvitationSection.tsx
│   │   ├── Countdown.tsx
│   │   ├── EventSection.tsx
│   │   ├── EventCard.tsx
│   │   ├── Gallery.tsx
│   │   ├── Lightbox.tsx
│   │   ├── RSVPForm.tsx
│   │   ├── WishesSection.tsx
│   │   ├── GiftSection.tsx
│   │   ├── ThankYouSection.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── MusicController.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ...
│
├── config/
│   └── wedding.ts
│
├── data/
│   ├── gallery.ts
│   └── events.ts
│
├── hooks/
│   ├── useCountdown.ts
│   ├── useLockBodyScroll.ts
│   └── useReducedMotion.ts
│
├── lib/
│   ├── maps.ts
│   └── rsvp.ts
│
└── types/
    └── wedding.ts
```

------------------------------------------------------------------------

# 23. Configuration-Driven Content

Do not hard-code wedding content across components.

Create:

``` text
config/wedding.ts
```

Example conceptual model:

``` ts
export const wedding = {
  couple: {
    groom: "Tú Văn",
    bride: "Hường Nguyễn",
  },

  date: "2026-12-12",

  hero: {
    image: "...",
  },

  events: [
    {
      type: "family",
      title: "Lễ Gia Tiên",
      date: "...",
      time: "...",
      venue: "...",
      address: "...",
      mapsUrl: "...",
    },
    {
      type: "reception",
      title: "Tiệc Cưới",
      date: "...",
      time: "...",
      venue: "...",
      address: "...",
      mapsUrl: "...",
    },
  ],

  music: {
    src: "...",
  },
};
```

This makes future editing extremely easy.

------------------------------------------------------------------------

# 24. SEO / Social Sharing

Add:

-   Page title
-   Description
-   Open Graph image
-   Twitter/X card
-   Canonical URL
-   Favicon
-   Wedding-specific metadata

Example:

``` text
Tú Văn & Hường Nguyễn — 12.12.2026
```

When shared through Messenger/Zalo/Facebook, the preview should show:

-   Couple photo
-   Couple names
-   Wedding date
-   Elegant description

------------------------------------------------------------------------

# 25. GitHub Pages Deployment

Because the website is a static export, verify:

``` text
output: export
```

Configure:

-   `basePath`
-   `assetPrefix` if required
-   trailing slash behavior
-   static asset paths
-   GitHub Pages routing

Avoid features that require a persistent Node.js server unless a
separate backend is introduced.

------------------------------------------------------------------------

# 26. Data / Backend Strategy

Separate the website into:

### Static content

-   Couple names
-   Wedding date
-   Event information
-   Photos
-   Music
-   QR codes

### Dynamic content

-   RSVP
-   Wishes
-   Guest messages

The frontend should expose interfaces:

``` text
RSVPService
WishService
```

so the backend provider can be replaced later.

------------------------------------------------------------------------

# 27. Recommended MVP

MVP should contain:

-   [ ] Opening invitation
-   [ ] Music
-   [ ] Hero
-   [ ] Invitation message
-   [ ] Countdown
-   [ ] Wedding events
-   [ ] Google Maps
-   [ ] Gallery
-   [ ] Lightbox
-   [ ] RSVP
-   [ ] Gift QR
-   [ ] Thank-you section
-   [ ] Mobile bottom navigation
-   [ ] Responsive design
-   [ ] SEO/social metadata
-   [ ] GitHub Pages deployment

------------------------------------------------------------------------

# 28. Phase 2 --- Premium Experience

After MVP is stable:

-   [ ] Guest-specific invitation URL
-   [ ] Personalized guest name
-   [ ] Personalized RSVP
-   [ ] Digital envelope animation
-   [ ] More advanced gallery transitions
-   [ ] Guest wishes wall
-   [ ] QR bank information copy
-   [ ] RSVP confirmation animation
-   [ ] Calendar event download
-   [ ] Add-to-calendar button
-   [ ] Elegant cursor effects on desktop
-   [ ] More sophisticated scroll storytelling

------------------------------------------------------------------------

# 29. Phase 3 --- Advanced Wedding Experience

Optional future features:

-   Personalized invitation: `/invite/nguyen-van-a`

-   QR check-in at venue

-   Guest attendance dashboard

-   RSVP statistics

-   Admin dashboard

-   Export guest list

-   SMS/Zalo reminder integration

-   Wedding day schedule

-   Live photo upload

-   Guest photo wall

These should not delay the initial launch.

------------------------------------------------------------------------

# 30. Animation System

Define a small motion system instead of manually creating animations
everywhere.

Example:

``` text
fade-in
fade-up
fade-down
scale-in
image-reveal
stagger
```

Recommended duration:

``` text
200ms — micro interaction
400ms — standard transition
600ms — section reveal
1000ms — cinematic opening
```

Use easing similar to:

``` text
ease-out
cubic-bezier(...)
```

Avoid animation duration that makes navigation feel slow.

------------------------------------------------------------------------

# 31. Opening Animation Detailed Storyboard

The opening experience should be treated as a mini cinematic sequence.

### Scene 01

Black/ivory background.

Small date appears.

``` text
12 . 12 . 2026
```

### Scene 02

Couple names appear:

``` text
Tú Văn
&
Hường Nguyễn
```

### Scene 03

Small text:

``` text
Trân trọng kính mời bạn
đến chung vui cùng chúng mình
```

### Scene 04

Button:

``` text
MỞ THIỆP
```

### Scene 05

On click:

-   Button disappears
-   Card opens
-   Music fades in
-   Hero image reveals
-   Opening screen fades out

Total interaction:

``` text
~1.5 seconds
```

------------------------------------------------------------------------

# 32. Photo Storytelling

Do not treat the gallery as a random image dump.

Arrange photos as a story:

1.  Couple portrait
2.  Detail / rings / bouquet
3.  Couple walking
4.  Close-up
5.  Candid moment
6.  Romantic portrait
7.  Wide environmental shot
8.  Final emotional image

The final image should transition naturally into the thank-you section.

------------------------------------------------------------------------

# 33. Wedding Page Rhythm

Recommended rhythm:

``` text
OPEN
 ↓
HERO
 ↓
MESSAGE
 ↓
COUNTDOWN
 ↓
EVENTS
 ↓
STORY
 ↓
GALLERY
 ↓
RSVP
 ↓
WISHES
 ↓
GIFT
 ↓
THANK YOU
```

The page should alternate:

``` text
image-heavy
→
text-heavy
→
minimal
→
image-heavy
```

This prevents visual fatigue.

------------------------------------------------------------------------

# 34. Mobile UX Rules

Every interactive element must be comfortable for touch.

Minimum:

``` text
44 × 44 px
```

Important:

-   Avoid tiny close buttons
-   Avoid small text links
-   Avoid elements too close together
-   Keep bottom navigation above the safe area
-   Keep RSVP CTA visible
-   Make Maps easy to access
-   Make QR codes large enough to scan

------------------------------------------------------------------------

# 35. Loading Experience

Initial loading should feel intentional.

Use:

``` text
Wedding loading screen
```

only when necessary.

Avoid showing a generic spinner.

Better:

``` text
Tú Văn & Hường Nguyễn

12 . 12 . 2026
```

Then transition naturally into the invitation.

------------------------------------------------------------------------

# 36. Error Handling

Gracefully handle:

-   Music cannot autoplay
-   Image fails to load
-   RSVP submission fails
-   Network unavailable
-   Invalid invitation URL
-   Countdown date passed
-   Lightbox loading delay

User-facing errors should be human-friendly.

Avoid exposing technical errors.

------------------------------------------------------------------------

# 37. Testing Plan

## Functional

-   [ ] Opening animation works
-   [ ] Music starts after user interaction
-   [ ] Music toggle works
-   [ ] Countdown works
-   [ ] Maps links work
-   [ ] Gallery works
-   [ ] Swipe works
-   [ ] Lightbox works
-   [ ] RSVP validation works
-   [ ] RSVP submission works
-   [ ] QR opens correctly
-   [ ] Copy account number works
-   [ ] Navigation scroll works

## Responsive

Test:

-   [ ] 360px
-   [ ] 375px
-   [ ] 390px
-   [ ] 414px
-   [ ] 768px
-   [ ] 1024px
-   [ ] 1280px
-   [ ] 1440px
-   [ ] 1920px

## Browser

-   [ ] Chrome Android
-   [ ] Safari iOS
-   [ ] Chrome Desktop
-   [ ] Edge
-   [ ] Firefox

------------------------------------------------------------------------

# 38. Performance Testing

Before release:

``` text
Lighthouse
PageSpeed Insights
Chrome DevTools Performance
Chrome DevTools Network
```

Check:

-   LCP
-   CLS
-   INP
-   Total Blocking Time
-   Image payload
-   JavaScript payload
-   Font loading
-   Audio loading

Target:

``` text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

------------------------------------------------------------------------

# 39. Content Preparation

Before coding, prepare:

### Photos

-   [ ] Select 1 hero photo
-   [ ] Select 15--30 gallery photos
-   [ ] Select 1 final thank-you photo
-   [ ] Crop/resize
-   [ ] Compress
-   [ ] Rename semantically

### Audio

-   [ ] Select background music
-   [ ] Confirm usage rights
-   [ ] Compress audio
-   [ ] Test mobile playback

### Wedding information

-   [ ] Date
-   [ ] Ceremony time
-   [ ] Reception time
-   [ ] Venue
-   [ ] Addresses
-   [ ] Google Maps URLs
-   [ ] Dress code
-   [ ] RSVP deadline

### Banking / gift

-   [ ] QR code
-   [ ] Bank name
-   [ ] Account holder
-   [ ] Account number

------------------------------------------------------------------------

# 40. Implementation Order

Build in this exact order:

## Step 1 --- Foundation

-   [ ] Create Next.js project
-   [ ] Configure TypeScript
-   [ ] Configure Tailwind
-   [ ] Configure static export
-   [ ] Configure GitHub Pages
-   [ ] Create global CSS variables
-   [ ] Configure fonts

## Step 2 --- Content model

-   [ ] Create wedding config
-   [ ] Create event data
-   [ ] Create gallery data
-   [ ] Create media asset structure

## Step 3 --- Core layout

-   [ ] Header
-   [ ] Navigation
-   [ ] Page sections
-   [ ] Footer

## Step 4 --- Opening experience

-   [ ] Opening cover
-   [ ] Animation
-   [ ] Open invitation CTA
-   [ ] Music controller

## Step 5 --- Hero + invitation

-   [ ] Hero image
-   [ ] Couple typography
-   [ ] Invitation message

## Step 6 --- Wedding information

-   [ ] Countdown
-   [ ] Event cards
-   [ ] Maps

## Step 7 --- Gallery

-   [ ] Responsive gallery
-   [ ] Lazy loading
-   [ ] Lightbox
-   [ ] Swipe gestures

## Step 8 --- RSVP

-   [ ] Form
-   [ ] Validation
-   [ ] Submission abstraction
-   [ ] Success/error states

## Step 9 --- Gift

-   [ ] QR cards
-   [ ] Account information
-   [ ] Copy button

## Step 10 --- Polish

-   [ ] Scroll animations
-   [ ] Responsive refinement
-   [ ] Accessibility
-   [ ] SEO
-   [ ] Open Graph

## Step 11 --- Performance

-   [ ] Compress media
-   [ ] Optimize fonts
-   [ ] Reduce JS
-   [ ] Lighthouse audit

## Step 12 --- Deployment

-   [ ] Production build
-   [ ] Test static output
-   [ ] GitHub Pages deployment
-   [ ] Test production URL
-   [ ] Test social sharing

------------------------------------------------------------------------

# 41. Definition of Done

The website is considered complete only when:

### Visual

-   [ ] Looks premium on mobile
-   [ ] Looks premium on desktop
-   [ ] Wedding photos are the visual focus
-   [ ] Typography feels elegant
-   [ ] Colors feel cohesive
-   [ ] No section looks like a generic template

### UX

-   [ ] Opening experience is smooth
-   [ ] Music is easy to control
-   [ ] Navigation is intuitive
-   [ ] RSVP is easy
-   [ ] Maps are one tap away
-   [ ] QR codes are easy to use
-   [ ] Gallery is comfortable on mobile

### Technical

-   [ ] Static export succeeds
-   [ ] GitHub Pages deployment succeeds
-   [ ] No hydration errors
-   [ ] No console errors
-   [ ] Images are optimized
-   [ ] Lighthouse targets are met
-   [ ] Accessibility basics are met

### Final emotional test

A first-time visitor should understand within approximately 5 seconds:

> Who is getting married, when the wedding is, and what action they
> should take.

After scrolling through the page, the visitor should feel:

> "This is their story, not just another wedding website."

------------------------------------------------------------------------

# 42. Agent Coding Instructions

When implementing with an AI coding agent, work in small verified
milestones.

For every milestone:

1.  Inspect the existing project.
2.  Understand current architecture.
3.  Implement only the requested milestone.
4.  Run TypeScript/type checking.
5.  Run lint.
6.  Run production build.
7.  Fix errors.
8.  Review responsive behavior.
9.  Review accessibility.
10. Commit only when the milestone is stable.

Never blindly rewrite the entire project.

## Agent priorities

Priority 1:

``` text
Correctness
```

Priority 2:

``` text
Mobile UX
```

Priority 3:

``` text
Visual quality
```

Priority 4:

``` text
Performance
```

Priority 5:

``` text
Desktop polish
```

------------------------------------------------------------------------

# 43. Suggested Agent Prompt

Use the following instruction as the master prompt for a coding agent:

> You are a senior frontend engineer and UI/UX designer specializing in
> premium wedding invitation websites.
>
> Build the wedding invitation website for Tú Văn & Hường Nguyễn,
> wedding date 12.12.2026.
>
> Technology: - Next.js - TypeScript - Tailwind CSS - Static export -
> GitHub Pages
>
> Design: - Mobile-first - Minimalist - Elegant - Editorial - Romantic -
> Cinematic - White + botanical green + charcoal
>
> The website must feel like opening a premium physical wedding
> invitation.
>
> Required experiences: - Full-screen invitation opening - "MỞ THIỆP"
> interaction - Music starts after user interaction - Cinematic hero -
> Wedding invitation message - Live countdown - Lễ Gia Tiên - Tiệc
> Cưới - Google Maps - Editorial wedding gallery - Full-screen
> lightbox - RSVP - Guest wishes - Wedding gift QR - Copy bank account -
> Thank-you section - Mobile bottom navigation - Smooth but restrained
> animations - Reduced-motion support - SEO/social sharing
>
> Important: - Do not create a generic wedding template. - Prioritize
> typography, photography, whitespace and composition. - Keep every
> interactive element at least 44x44px. - Optimize all images for
> mobile. - Avoid unnecessary libraries. - Avoid excessive animation. -
> Maintain clean component architecture. - Keep wedding content
> configuration-driven. - Test static export and GitHub Pages
> compatibility.
>
> Work incrementally.
>
> After every milestone: 1. Type check 2. Lint 3. Production build 4.
> Fix errors 5. Verify mobile layout 6. Continue only when stable.
>
> Do not mark the project complete until all Definition of Done
> requirements in the project plan are satisfied.

------------------------------------------------------------------------

# 44. Final Creative Direction

The most important principle:

**Do not try to make the website impressive by adding more features.**

Make it impressive through:

``` text
Photography
+
Typography
+
Whitespace
+
Micro-interactions
+
Music
+
Storytelling
```

The ideal experience should feel like:

``` text
Physical wedding invitation
        ↓
Digital opening ceremony
        ↓
Wedding photo editorial
        ↓
Simple RSVP
        ↓
Emotional closing
```

The website should be beautiful enough that guests naturally want to
scroll through the entire invitation, while remaining fast, accessible,
and effortless to use on a phone.
