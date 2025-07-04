# 🧭 Planskop

**Planskop** is a small, focused app for planning your day around a few meaningful habits or actions. It’s built for personal use — simple enough to stay out of your way, but structured enough to help you follow through.

---

## ✨ What It Does

- 🗓️ Plan your day using short, time-based action slots
- 🔁 Define habits that repeat (e.g. every weekday, or every Monday)
- 🌍 Timezone-aware — reminders adjust to your local time
- ✅ Validates overlapping or duplicate actions
- 🙋‍♀️ User login via [Clerk.js](https://clerk.dev) (email or OAuth)

---

## 💡 Inspiration

Planskop is influenced by how many artists, writers, and thinkers shaped their days around a few key actions.

> _“I write every morning. That’s when I’m freshest. The rest of the day is for walking, reading, and not ruining the morning.”_  
> — **Haruki Murakami**

> _“Routine, in an intelligent man, is a sign of ambition.”_  
> — **W.H. Auden**

You won’t find endless checklists here — just a quiet space to repeat what matters, one day at a time.

## 🧰 Built With

| Feature            | Stack                             |
| ------------------ | --------------------------------- |
| Frontend           | Next.js 14 (App Router), React 19 |
| Forms & Validation | Server Actions + Zod              |
| Database           | Drizzle ORM + PostgreSQL          |
| Authentication     | Clerk.js                          |
| Repeating Logic    | Rust + WebAssembly (RRULE)        |
| Styling            | Tailwind CSS                      |

---

## 🧪 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/planskop.git
cd planskop

pnpm install
cp .env.example .env   # Add Clerk and DB credentials

pnpm dev
```
