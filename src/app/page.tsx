import Hero from "@/components/landing/hero";
import { getSession } from "@/server/actions/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <Hero session={!!session?.user}  />
    </>
  );
}
