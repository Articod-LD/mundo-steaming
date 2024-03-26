import type { LoginInput } from "@/types";
import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import routes from "@/config/routes";
import Button from "../ui/button";
import { useState } from "react";
import Link from "@/components/ui/links/anchor-link";
import Alert from "../ui/alert";
import { useLogin } from "@/data/user";
import { allowedRoles, hasAccess, setAuthCredentials } from "@/utils/auth";
import { useRouter } from "next/router";
import useAuth from "./use-auth";

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de Correo Incorrecto")
    .required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerida"),
});

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isLoading, error } = useLogin();
  const { authorize } = useAuth();
  const router = useRouter();

  function onSubmit({ email, password }: LoginInput) {
    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              console.log("correcto");
              authorize(data?.token, data?.permissions);
              router.push(routes.home);
              return;
            }
            setErrorMessage("form:error-enough-permission");
          } else {
            console.log("no llego token");

            setErrorMessage("Revisa tu correo o contraseña");
          }
        },
        onError: () => {},
      }
    );
  }
  return (
    <>
      <Form<LoginInput> validationSchema={loginFormSchema} onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label="Email"
              {...register("email")}
              type="email"
              variant="outline"
              className="mb-4"
              error={errors?.email?.message!}
            />
            <PasswordInput
              label="password"
              {...register("password")}
              error={errors?.password?.message!}
              variant="outline"
              className="mb-4"
            />
            <Button
              className="w-full uppercase"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Iniciar Sesión
            </Button>

            <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
            </div>

            <div className="text-center text-sm text-body sm:text-base">
              No tienes Cuenta?
              <Link
                href={routes.register}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                Registrarse
              </Link>
            </div>
          </>
        )}
      </Form>
      {errorMessage ? (
        <Alert
          message={errorMessage}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default LoginForm;
