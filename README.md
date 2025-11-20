# Planskop

**Planskop** is a small, focused app for planning your day around a few meaningful habits or actions. It’s built for personal use — simple enough to stay out of your way, but structured enough to help you follow through.

---

## What It Does

- Plan your day using short, time-based action slots
- Define habits that repeat (3day, 1month, etc...)
- Timezone-aware reminder emails, adjust to your local time
- Validates overlapping or duplicate actions
- User login via [Clerk.js](https://clerk.dev)
- Media uploads (e.g. avatars, icons) via [Cloudinary](https://cloudinary.com/)

---

## Built With

| Feature            | Stack                               |
| ------------------ | ----------------------------------- |
| Frontend           | Next.js 15 (App Router), React 19   |
| Styling            | Tailwind CSS                        |
| Forms & Validation | Server Actions + Zod                |
| Database           | Drizzle ORM + PostgreSQL (via Neon) |
| Authentication     | Clerk.js                            |
| Repeating Logic    | Rust + WebAssembly (RRULE)          |
| Media Storage      | Cloudinary                          |
| Testing            | Jest + Cypress                      |
| Cron Jobs          | Upstash/Qstash                      |
| Mail               | Resend                              |

---

## To Do's

- [] Main nav bar can use compact version with only icons without text labels
- [] Daily plans list is slow?

- [] Better information on uploading media in order to complete the daily actions
- [] Indicate filled hours section on daily planner as preview only
- [] Make the design of filled hours section consistent with the design system
- [] Refine famous routine detail page
- [] Add public user detail page
- [] Add more tests with cypress and jest
- [] Order of action slots
- [] Allow a check box option as well as adding an image for marking as completed
- [] Show ending time in action slot field when the user selects duration
- [] Integrate settings of a daily plan with the calendar
