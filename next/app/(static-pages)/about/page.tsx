import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <section className="text-md ">
      <figure className="bg-bermuda mb-8 ">
        <Image
          src="https://res.cloudinary.com/derfbfm9n/image/upload/v1758317507/reminder-good-morning-drawing-01_pjpq9u.jpg"
          width="400"
          height="422"
          alt="a new day full of new perspectives illustration"
          className="w-60 mix-blend-overlay m-auto"
        />
      </figure>
      <div className="max-w-2xl mb-4">
        <h1 className="text-2xl">About "Planskop"</h1>
        <p className="my-4">
          Planskop is an open source web app actively design and developed by
          <a href="https://github.com/kuyucakli" className="underline">
            Burak Kuyucaklı
          </a>
        </p>
        <p className="my-4">
          Planskop is a minimal daily habits app. It is more about habit
          creation than simply managing “to-dos.” The focus is on building
          routines that last, not just checking boxes. Over time, I plan to add
          habit creation sources, inspirational examples, and gentle guidance to
          make starting easier. Right now, Planskop helps by sending gentle
          reminders of your daily goals. And you can attach images to your
          actions — as motivation, reminders, or just personal meaning. We know
          that actions repeated day after day slowly shape who we are, forming
          patterns that become visible in our lives. Planskop is here to help
          you notice those patterns — and design the ones you want to live by.
        </p>
        <p className="text-xs my-4">
          © {year} Burak Kuyucaklı.{" "}
          <Link
            href="https://github.com/kuyucakli/planskop"
            target="_blank"
            className="underline"
          >
            This web app is open source!
          </Link>{" "}
        </p>
      </div>
    </section>
  );
}
