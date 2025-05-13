This project is maintained by Burak Kuyucaklı in order to keep up with the latest advancements in frontend world.

~~ I am using auth.js (next-auth v5 beta ) with keycloak provider for authentication.

For the job que and sending email reminders I've used upstash account with redis. On the client side bullmq, ioredis was used. ~~

Switching to Clerk.js allowed me to move forward with core features of Planskop without getting blocked by auth infrastructure.

## To do

- [] Learn React 19 new features
- [x] Create vercel postgres db
- [x] Integrate drizzle
- [x] Zod form validation
- [x] Unit tests
- [x] Create authentication using nextAuth ( auth 5.0 )
- [x] Use keycloak as the provider of auth 5.0
- [] Keycloak profile picture problem
- [x] Solve ActionPlan recurring settings (rrule)
- [] Show upcoming actions
- [] Edit and update an actionPlan
- [] Solve cron job and sending informative messages to users
- [] Upload to vercel
- [] Learn rust + wasm ( integrate )
