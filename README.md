# The Algerian Reader

Core idea
This is an Algerian online bookstore where users can browse trending books, search, filter by genre, request unavailable books, and place orders. Admin manages inventory and orders from a dashboard.

Frontend Pages (User Side)

Home Page
Purpose: conversion + discovery.

Sections:

Hero section: warm brown gradient background, subtle paper grain texture. Large serif heading like “Discover Your Next Story”. CTA button: “Shop Now”.

Trending Books section: dynamic grid (fetched from backend). Each book card includes:

Cover image

Title

Author

Price (in DZD)

“View Details” button

Small animated hover effect: book slightly lifts + soft shadow expands.

Short “Why Choose Us” section (fast delivery across Algeria, curated titles, request feature).

Animation:
Fade-in on scroll. Smooth transitions using something like Framer Motion or CSS transitions.

Shop Page
Purpose: browse + filter + search.

Layout:

Left sidebar (or top bar for mobile):

Filter by Genre (tags: Fiction, Philosophy, Self-help, History, etc.)

Possibly price range slider (optional for MVP but nice).

Search bar at top (live filtering or backend search query).

Grid layout of all books.

Each book card:

Cover

Title

Price

Genre tag badges

Clickable

Book Details Page (/book/:id)

Full page view:

Large cover image

Title

Author

Price

Description

Genre tags (clickable, filtering redirect)

“Add to Cart” button

Possibly “Related Books” (same genre — optional for MVP if easy).

This page should feel like opening a book. Subtle parchment background, smooth page-like transition animation when navigating.

Request Book Page

Purpose: capture demand for unavailable books.

Simple clean form:

Name

Email

Book Title

Author (optional)

Message

Submit button

On submission → stored in database → visible in admin dashboard.

Checkout (Simple MVP version)

Keep it minimal:

Cart page

Name

Phone number

Wilaya selection

Delivery type:

Home delivery

Wilaya pickup

Confirm order

No payment gateway needed for MVP. Just Cash on Delivery.

Backend (Core Logic)

Database Models

User (optional for MVP, can skip accounts initially)

Book:

id

title

author

description

price

genre (array of tags)

coverImageURL

isTrending (boolean)

Order:

id

books[]

totalPrice

customerName

phone

wilaya

deliveryType

status (pending, completed)

RequestedBook:

id

name

email

requestedTitle

author

message

resolved (boolean)

Admin Dashboard (/admin)

Protected route (simple password auth for MVP).

Sections:

Orders:

Table view:

Customer name

Phone

Wilaya

Order items

Status

Button to mark as completed

Reset orders (clear all completed or all — be careful with this one)

Requested Books:

List of requests

Option to mark as resolved

Add Book:

Form:

Title

Author

Price

Genre tags

Description

Upload cover

Mark as trending toggle

Submit → saves to DB → auto appears in shop

Design System : Core Concept
An Algerian online bookstore that feels like browsing physical shelves. Discovery-focused. Clean navigation. Calm reading energy.

Home Page

Purpose: discovery and emotional hook.

The hero section feels like opening a hardcover book. Large elegant typography. Spacious layout. Minimal clutter. Soft entrance animation when the page loads — content fades in like a curtain lifting.

Trending Books section:
Books appear in a structured grid. Cards feel tactile — like small book covers resting on a wooden table. On hover, the card gently lifts and casts a deeper shadow, mimicking picking up a book.

Scrolling should feel smooth and slightly cinematic. Elements reveal themselves gradually rather than snapping into view.

Shop Page

Purpose: organized browsing.

The layout is structured and clean. It feels like walking down neatly labeled shelves.

Left sidebar (or top filter on mobile) is subtle and refined. Genre tags look like stamped labels rather than loud buttons.

Search bar is centered and calm — not aggressive. It feels like whispering a title to a librarian.

Book cards are consistent and evenly spaced. Nothing crowded. White space is treated as breathing room.

Filtering transitions are animated smoothly — books fade out and rearrange instead of jumping abruptly.

Book Details Page

This page should feel intimate.

Large book cover at the top. Clear typography hierarchy. Description laid out like the first page of a novel — comfortable line spacing, readable, almost inviting you to sit down.

Tags appear as refined labels beneath the description. Clicking a tag gently transitions you back to the shop filtered view.

Add to Cart button is present but not loud. This is a bookstore, not a flash sale warehouse.

Request Book Page

This page feels personal.

A simple form centered on the page. Generous spacing. Clear fields. Subtle animation when focusing on inputs.

Submitting the form gives soft feedback — confirmation message fades in instead of a harsh alert popup.

Admin Dashboard

Functionally modern, visually restrained.

Clean table layout. No decorative noise. Clear order statuses. Buttons feel purposeful, not playful.

It feels like the quiet back office of the bookstore — efficient, organized, slightly minimalist.

Animations

Use motion to simulate physicality:

Gentle fade-ins on scroll.

Smooth page transitions.

Hover elevation on book cards.

Soft scaling on button interactions.

Nothing flashy. No bouncing. No aggressive transitions. Everything should feel intentional and calm.

Design Philosophy

Modern structure, nostalgic emotion.

Grid-based layout. Clean alignment. Strong typography hierarchy.
But emotionally: reflective, thoughtful, literary.

The site should feel like it respects books — not like it’s trying to gamify them.

The subtle psychological goal:
Users should feel slightly smarter just by being on the website.

And that’s the real trick of good product design — it doesn’t scream. It whispers confidence.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bookberries.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/412cdaaa-18f1-4ccb-82ee-d48b612bcb70).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
