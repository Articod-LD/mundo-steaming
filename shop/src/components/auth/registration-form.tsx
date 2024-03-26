import { Permission, RegisterInput, RegisterInputType } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { FieldError, useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";
import { useRegisterMutation } from "@/data/user";
import AnchorLink from "../ui/links/anchor-link";
import routes from "@/config/routes";
import Form from "../ui/forms/form";
import { allowedRoles, hasAccess } from "@/utils/auth";
import AuthorizedMenu from "@/layouts/navigation/authorized-menu";
import useAuth from "./use-auth";

const registrationFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de Correo Incorrecto")
    .required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerida"),
  name: yup.string().required("form:error-name-required"),
  documento: yup.string().required("form:error-name-required"),
  telefono: yup.string().required("form:error-name-required"),
  direccion: yup.string().required("form:error-name-required"),
  permission: yup.string().default("customer").oneOf(["customer"]),
});

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading } = useRegisterMutation();

  const router = useRouter();
  const { authorize } = useAuth();
  async function onSubmit({
    name,
    email,
    password,
    permission,
    direccion,
    documento,
    telefono,
  }: RegisterInputType) {
    registerUser(
      {
        name,
        email,
        password,
        permission,
        direccion,
        documento,
        telefono,
      },
      {
        onSuccess: (data) => {
          if (hasAccess(allowedRoles, data?.permissions)) {
            authorize(data?.token, data?.permissions);
            router.push(routes.login);
            return;
          }
        },
        onError: (error: any) => {
          setErrorMessage(constructErrorMessage(error.response.data));
        },
      }
    );
  }

  const constructErrorMessage = (errorObject: any) => {
    let errorMessage = "";
    for (const key in errorObject) {
      if (errorObject.hasOwnProperty(key)) {
        errorMessage += `${errorObject[key].join(", ")}\n`; // Concatenar mensajes de error para cada clave
      }
    }
    return errorMessage.trim(); // Eliminar espacios en blanco al inicio y al final
  };

  return (
    <>
      <Form<RegisterInputType>
        validationSchema={registrationFormSchema}
        onSubmit={onSubmit}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label="Name"
              {...register("name")}
              variant="outline"
              className="mb-4"
              error={errors?.name?.message!}
            />
            <Input
              label="Documento"
              type="Number"
              {...register("documento")}
              variant="outline"
              className="mb-4"
              error={errors?.documento?.message!}
            />
            <Input
              label="Telefono"
              type="Number"
              {...register("telefono")}
              variant="outline"
              className="mb-4"
              error={errors?.telefono?.message!}
            />
            <Input
              label="Direccion"
              {...register("direccion")}
              variant="outline"
              className="mb-4"
              error={errors?.direccion?.message!}
            />
            <Input
              label="Email"
              {...register("email")}
              type="email"
              variant="outline"
              className="mb-4"
              error={errors?.email?.message}
            />
            <PasswordInput
              label="Password"
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
              Register
            </Button>
            <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
            </div>
            <div className="text-center text-sm text-body sm:text-base">
              Ya tienes una cuenta?
              <AnchorLink
                href={routes.login}
                className="ms-1 font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                Login
              </AnchorLink>
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

export default RegistrationForm;
