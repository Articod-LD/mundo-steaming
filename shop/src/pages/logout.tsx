import { useEffect } from "react";
import Loader from "@/components/ui/loader/loader";
import { useLogoutMutation } from "@/data/user";

function SignOut() {
  const { mutate: logout } = useLogoutMutation();

  useEffect(() => {
    logout();
  }, []);

  return <Loader text="Iniciar sesion" />;
}

export default SignOut;
