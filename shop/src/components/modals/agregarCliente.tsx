import { Permission, RegisterInputType } from "@/types";
import RegistrationForm from "../auth/registration-form";
import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";
import { useRegisterAdminMutation, useRegisterMutation, useRegisterProviderMutation } from "@/data/user";
import toast from "react-hot-toast";
import { useModalAction } from "../ui/modal/modal.context";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";

const registrationFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de Correo Incorrecto")
    .required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerida"),
  name: yup.string().required("form:error-name-required"),
  phone: yup
  .string()
  .nullable() // Permitir que sea null
  .transform((value) => (value === "" ? undefined : value)) // Transformar "" a undefined
  .optional(), // Permitir undefined (y null) como valor válido
  permission: yup.string().default("customer").oneOf(["customer"]),
});


function AgregateClienteModal({type}:{type:string}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading } = useRegisterMutation();
  const { mutate: registerAdmin, isLoading:isLoadingAdmin } = useRegisterAdminMutation();
  const { mutate: registerProvider, isLoading:isLoadingProvider} = useRegisterProviderMutation();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();

  async function onSubmit({
    name,
    email,
    password,
    permission,
    phone,
  }: RegisterInputType) {
    if (type === 'Cliente') {
      registerUser(
        {
          name,
          email,
          password: password as string,
          permission:Permission.Customer,
          phone: phone === null ? undefined : phone,
        },
        {
          onSuccess: (data) => {
            closeModal();
          },
          onError: (error: any) => {
            setErrorMessage(constructErrorMessage(error.response.data));
          },
        }
      );
    }
    if (type === 'Administrador') {
      registerAdmin(
        {
          name,
          email,
          password: password as string,
          permission:Permission.super_admin,
          phone: phone === null ? undefined : phone,
        },
        {
          onSuccess: (data) => {
            closeModal();
          },
          onError: (error: any) => {
            setErrorMessage(constructErrorMessage(error.response.data));
          },
        }
      );
    }

    if (type === 'Distribuidor') {
      registerProvider(
        {
          name,
          email,
          password: password as string,
          permission:Permission.provider,
          phone: phone === null ? undefined : phone,
        },
        {
          onSuccess: (data) => {
            closeModal();
          },
          onError: (error: any) => {
            setErrorMessage(constructErrorMessage(error.response.data));
          },
        }
      );
    }
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
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Agregar {type}
      </h3>

      <>
        <Form<RegisterInputType>
          validationSchema={registrationFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors } }) => (
            <>
              <Input
                label="Correo Electronico"
                {...register("email")}
                type="email"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.email?.message}
                isRequired
              />
              <PasswordInput
                label="Contraseña"
                {...register("password")}
                error={errors?.password?.message!}
                variant="outline"
                isEditar={true}
                className="mb-4"
                isRequired
              />
              <Input
                label="Nombre Completo"
                {...register("name")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.name?.message!}
                isRequired
              />
              <Input
                label="Telefono"
                type="Number"
                {...register("phone")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.phone?.message!}
              />

              <Button
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Registrar
              </Button>
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
    </div>
  );
}

export default AgregateClienteModal;
