import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const AuthGuard = ({ children, adminOnly }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (adminOnly && !session?.user.admin && status !== "loading") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      {status === "loading" ? (
        <LoadingOverlay visible={true} />
      ) : session ? (
        children
      ) : null}
    </>
  );
};
