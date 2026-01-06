import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
         <div>
  <fieldset>
    <form action="#" method="post">
        <label htmlFor="nom">Nom:</label>
        <input id="nom" name="nom" type="text" />
        <br />
        <label htmlFor="password">Mot de Passe :</label>
        <input id="password" name="password" type="password" />
        <br />
        <button type="submit">submit</button>
        <br />
    </form>
  </fieldset>
  <p>mot passe oublier?</p>
  <a href="#"> contacter l'administrateur</a>
</div>
      </main>
    </div>
  );
}
