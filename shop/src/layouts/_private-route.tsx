import Loader from "@/components/ui/loader/loader";
import routes from "@/config/routes";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { userClient } from "@/data/client/user";
import { useMe } from "@/data/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";

function UnAuthorizedView() {
  const router = useRouter();
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden py-5 px-4 md:py-8">
      <button
        onClick={() => router.push(routes.home)}
        className="sx:mb-10 left-4 z-10 mb-8 flex items-center justify-center sm:absolute sm:mb-0"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default function PrivateRoute({
  children,
}: React.PropsWithChildren<{}>) {
  const { me, isAuthorized } = useMe();

  const isUser = !!me;
  if (!isUser && !isAuthorized) {
    return <UnAuthorizedView />;
  }
  if (isUser && isAuthorized) {
    return <>{children}</>;
  }
  return <Loader showText={false} />;
}
