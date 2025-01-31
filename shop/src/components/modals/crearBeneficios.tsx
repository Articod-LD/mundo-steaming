import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useEffect, useState } from "react";
import Alert from "../ui/alert";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";
import Image from "next/image";
import {
  Beneficio,
  BeneficioSinId,
  CategorieInput,
  CreateProductoForm,
  IAbout,
  IAboutSinId,
  IConfig,
  IConfigSinID,
  Plataforma,
  Product,
} from "@/types";
import PasswordInput from "../ui/password-input";
import SelectInput from "../ui/select-input";
import {
  usePlataformasQuery,
  useProductConfigMutation,
  useProductRegisterMutation,
  useRegisterAboutMutation,
  useRegisterBeneficioMutation,
  useRegisterMutation,
  useUpdateAboutMutation,
  useUpdateBeneficioMutation,
  useUpdateConfigMutation,
  useUpdatePlataformaMutation,
  useUpdateProductoMutation,
} from "@/data/user";
import DatePickerInput from "../ui/date-picker";
import { format, parseISO } from "date-fns";

const createConfiguracionFormSchema = yup.object().shape({
  beneficio: yup.string().required("El Beneficio es requerido"),
});

function CrearBeneficioModal({ beneficios }: { beneficios?: Beneficio }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placeholderDate, setPlaceholderDate] = useState<string>("");
  const { mutate: registerProduct, isLoading } = useProductConfigMutation();
  const [plataformaDefault, setPlataformaDefault] = useState<string | null>();

  const { mutate: createPlataforma } = useRegisterBeneficioMutation();
  const { mutate: updatePlataforma, isLoading: isLoadingUpdate } =
    useUpdateBeneficioMutation();

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({ beneficio }: BeneficioSinId) {
    if (!beneficios) {
      createPlataforma(
        { beneficio },
        {
          onSuccess(data, variables, context) {
            closeModal();
          },
          onError(error: any) {
            setErrorMessage(error.response.data.error);
          },
        }
      );
    } else {
      updatePlataforma(
        { beneficioId: beneficios!.id, params: {beneficio} },
        {
          onSuccess(data, variables, context) {
            closeModal();
          },
          onError(error: any) {
            setErrorMessage(error.response.data.error);
          },
        }
      );
    }
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        {beneficios ? "Actualizar" : "Crear"} Configuracion
      </h3>

      <>
        <Form<BeneficioSinId>
          validationSchema={createConfiguracionFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors }, control, reset }) => (
            // eslint-disable-next-line react-hooks/rules-of-hooks

            <>
              <Input
                label="Beneficio"
                {...register("beneficio")}
                type="text"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.beneficio?.message}
                defaultValue={beneficios?.beneficio}
                isRequired
              />

              <Button className="w-full uppercase">
                {beneficios ? "Update" : "Register"}
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

export default CrearBeneficioModal;
