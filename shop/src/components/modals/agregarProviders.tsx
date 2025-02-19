import { RegisterInputType } from "@/types";
import RegistrationForm from "../auth/registration-form";
import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";
import { useRegisterMutation } from "@/data/user";
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
  phone: yup.string().required("form:error-name-required"),
  permission: yup.string().default("provider").oneOf(["provider"]),
});

function AgregateProvidersModal() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading } = useRegisterMutation();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();

  async function onSubmit({
    name,
    email,
    password,
    permission,
    phone,
  }: RegisterInputType) {
    registerUser(
      {
        name,
        email,
        password: password as string,
        permission,
        phone
      },
      {
        onSuccess: (data) => {
          toast.success("Registrado Correctamente");
          queryClient.invalidateQueries([API_ENDPOINTS.CLIENT_LIST]);
          closeModal();
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
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Agregar Proveedor
      </h3>

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
                isEditar={true}
                error={errors?.name?.message!}
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
              <Input
                label="Email"
                {...register("email")}
                type="email"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.email?.message}
              />
              <PasswordInput
                label="Password"
                {...register("password")}
                error={errors?.password?.message!}
                variant="outline"
                isEditar={true}
                className="mb-4"
              />
              <Button
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Register
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

export default AgregateProvidersModal;
