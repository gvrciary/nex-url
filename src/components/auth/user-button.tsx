import { getSession } from "@/server/actions/auth";
import UserMenu from "./user-menu";
import LoginButton from "./login-button";

export default async function UserButton() {
  const session = await getSession();
  
  if (!session?.user) return <LoginButton />;

  return <UserMenu name={session.user.name} />;
}
