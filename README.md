This project is maintained by Burak Kuyucaklı in order to keep up with the latest advancements in frontend world.

I am using auth.js (next-auth v5 beta ) with keycloak provider for authentication.

For the job que and sending email reminders I've used upstash account with redis. On the client side bullmq, ioredis was used.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## History

- Decided to use auth.js (next.js auth 5.0 ) with keycloak
- Downloaded keycloak-25.0.2 used "bin/kc.sh start-dev" in terminal
- Created a realm ( other than master realm ) and a client via keycloak interface at localhost:8080
- I can't get user profile image from social logins.
- Tried to add image attribute to user profile using keycloack interface at localhost:8080

## To do

- [] Learn React 19 new features
- [x] Create vercel postgres db
- [x] Integrate drizzle
- [x] Create authentication using nextAuth ( auth 5.0 )
- [x] Use keycloak as the provider of auth 5.0
- [] Keycloak profile picture problem
- [x] Solve ActionPlan recurring settings (rrule)
- [] Show upcoming actions
- [] Edit and update an actionPlan
- [] Solve cron job and sending informative messages to users
- [] Upload to vercel
- [] Learn rust + wasm ( integrate )
