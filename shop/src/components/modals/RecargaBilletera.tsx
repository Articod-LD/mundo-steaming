import { Permission, RecargeManual, RegisterInputType, User } from "@/types";
import RegistrationForm from "../auth/registration-form";
import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";
import {
  useMe,
  useRegisterAdminMutation,
  useRegisterMutation,
  useRegisterProviderMutation,
  useRegisterWallet,
  useRegisterWalletManual,
  useUpdateAdministradortMutation,
  useUpdateCategoriaMutation,
  useUpdateClientMutation,
  useUpdateProvidertMutation,
} from "@/data/user";
import toast from "react-hot-toast";
import { useModalAction } from "../ui/modal/modal.context";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";

const registrationFormSchema = yup.object().shape({
  amount: yup
    .number()
    .required("form:error-name-required")
    .min(50000, (value) => "El valor minimo debe ser " + value.min),
  user_id: yup.number(),
});

function RecargarBilletera({ data }: { data: { user: User } }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { closeModal } = useModalAction();

  const {
    mutate: rechargeAccount,
    isLoading,
    error,
  } = useRegisterWalletManual();
  const queryClient = useQueryClient();

  async function onSubmit({ amount }: RecargeManual) {
    rechargeAccount(
      {
        user_id: data.user?.id,
        amount: amount,
      },
      {
        onSuccess(data: any, variables, context) {
          toast.success("Cambio Correcto");
          queryClient.invalidateQueries([API_ENDPOINTS.PROVIDERS_LIST]);
          closeModal();
        },
        onError(error, variables, context) {
          error;
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
        Editar Billetera {data.user.name}
      </h3>
      <p className="text-light-900 text-sm">
        Esto es el total de la billetera no se suma ni se resta solo se modifica
        la billetera
      </p>

      <>
        <Form<RecargeManual>
          validationSchema={registrationFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors } }) => (
            <>
              <Input
                label="Monto"
                {...register("amount")}
                type="email"
                variant="outline"
                className="mb-4"
                isEditar={true}
                min={1000}
                error={errors?.amount?.message}
                defaultValue={data.user.wallet}
              />

              <Button
                type="submit"
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Actualizar
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

export default RecargarBilletera;
