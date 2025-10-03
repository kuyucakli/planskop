import Image from "next/image";

export default function Page() {
  return (
    <section>
      <figure className="bg-blue-600 mb-8">
        <Image
          src="https://res.cloudinary.com/derfbfm9n/image/upload/v1759418431/newsletter_n9ryos.png"
          alt="A happy newsletter"
          width="723"
          height="567"
          className="w-80 mix-blend-overlay m-auto "
        />
      </figure>
      <h1>Newsletter</h1>
      <form>
        <input
          type="email"
          disabled
          className="border-2 border-neutral-500 rounded w-90 h-12 p-2 mt-4"
          placeholder="Our newsletter will be raedy soon"
        />
      </form>
    </section>
  );
}
