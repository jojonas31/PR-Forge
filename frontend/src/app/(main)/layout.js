import MobileMenuWrapper from "@/components/MobileMenuWrapper";
import { cookies } from "next/headers";
import { getUserProfileService } from "@/services/user";

export default async function MainLayout({ children }) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("jwt_token")?.value;

  let user = null;

  if (token) {
    try {
      user = await getUserProfileService(token);
    } catch (error) {
      user = null;
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <MobileMenuWrapper user={user} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
