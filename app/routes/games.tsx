import { Outlet } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Games() {
  const user = useOptionalUser();

  return <Outlet />;
}
