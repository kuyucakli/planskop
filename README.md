# Planskop

**Planskop** is a small, focused app for planning your day around a few meaningful habits or actions. It’s built for personal use — simple enough to stay out of your way, but structured enough to help you follow through.

---

## What It Does

- Plan your day using short, time-based action slots
- Define habits that repeat (e.g. every weekday, or every Monday)
- Timezone-aware — reminders adjust to your local time
- Validates overlapping or duplicate actions
- User login via [Clerk.js](https://clerk.dev)
- Media uploads (e.g. avatars, icons) via [Cloudinary](https://cloudinary.com/)
- Data stored per user in a [Neon](https://neon.tech/) PostgreSQL database

---

## Built With

| Feature            | Stack                               |
| ------------------ | ----------------------------------- |
| Frontend           | Next.js 14 (App Router), React 19   |
| Forms & Validation | Server Actions + Zod                |
| Database           | Drizzle ORM + PostgreSQL (via Neon) |
| Authentication     | Clerk.js                            |
| Repeating Logic    | Rust + WebAssembly (RRULE)          |
| Styling            | Tailwind CSS                        |
| Media Storage      | Cloudinary                          |
| Testing            | Jest + ts-jest                      |

---

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/planskop.git
cd planskop

pnpm install
cp .env.example .env   # Add Clerk, Cloudinary, and Neon credentials

pnpm dev
```

## To Do's

- Form Submit Button
- Fade on date change refresh slots
- Home page get latest public user's routine content
- Intro
- Home Page, one famous routine.
- Home Page one famous detail page + summary popup on hover
- Home Recent user habits
- Add more dummy users
- Add media table
- Add like table
- [X] Countdown for day and hours
- Add image
- Rewards
- Levels
