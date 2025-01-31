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
  CategorieInput,
  CreateProductoForm,
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
  useRegisterMutation,
  useUpdateConfigMutation,
  useUpdatePlataformaMutation,
  useUpdateProductoMutation,
} from "@/data/user";
import DatePickerInput from "../ui/date-picker";
import { format, parseISO } from "date-fns";

const createConfiguracionFormSchema = yup.object().shape({
  title: yup.string().required("El titulo es requerido"),
  cel: yup
    .number()
    .typeError("El número de celular debe ser un valor numérico")
    .integer("Debe ser un número entero")
    .positive("Debe ser un número positivo")
    .required("El número de celular es requerido"),

  insta_url: yup
    .string()
    .url("Debe ser una URL válida")
    .required("El enlace de Instagram es requerido"),

  whatsapp_url: yup
    .string()
    .required("la url de whatsapp es requerida")
    .default(null)
    .url("Debe ser una URL válida"),
  plataforma: yup.string().required("el @ de redes sociales es requerido"),
});

function CrearConfigModal({ config }: { config?: IConfig }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placeholderDate, setPlaceholderDate] = useState<string>("");
  const { mutate: registerProduct, isLoading } = useProductConfigMutation();
  const [plataformaDefault, setPlataformaDefault] = useState<string | null>();

  const { mutate: updatePlataforma, isLoading: isLoadingUpdate } =
    useUpdateConfigMutation();

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({
    cel,
    insta_url,
    plataforma,
    title,
    whatsapp_url,
  }: IConfigSinID) {
    if (!config) {
      registerProduct(
        {
          cel: String(cel),
          insta_url,
          plataforma,
          title,
          whatsapp_url,
        },
        {
          onSuccess: (data) => {
            closeModal();
          },
          onError: (error: any) => {
            toast.error("ha ocurrido un error");
          },
        }
      );
    } else {
      updatePlataforma(
        {
          configId: config.id,
          params: {
            cel: String(cel),
            insta_url,
            plataforma,
            title,
            whatsapp_url,
          },
        },
        {
          onSuccess(data, variables, context) {
            closeModal();
          },
          onError(error: any) {
            setErrorMessage(error.response.data.message);
          },
        }
      );
    }
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        {config ? "Actualizar" : "Crear"} Configuracion
      </h3>

      <>
        <Form<IConfigSinID>
          validationSchema={createConfiguracionFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors }, control, reset }) => (
            // eslint-disable-next-line react-hooks/rules-of-hooks

            <>
              <Input
                label="Titulo Aplicacion"
                {...register("title")}
                type="text"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.title?.message}
                defaultValue={config?.title}
                isRequired
              />
              <Input
                label="Celular"
                {...register("cel")}
                error={errors?.cel?.message!}
                variant="outline"
                type="number"
                isEditar={true}
                className="mb-4"
                defaultValue={config?.cel}
                isRequired
              />
              <Input
                label="Url Instagram"
                {...register("insta_url")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={config?.insta_url}
                error={errors?.insta_url?.message}
              />

              <Input
                label="Url Whatsapp"
                {...register("whatsapp_url")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={config?.whatsapp_url}
                error={errors?.whatsapp_url?.message}
              />

              <Input
                label="@Plataforma"
                {...register("plataforma")}
                type="text"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.plataforma?.message}
                defaultValue={config?.plataforma}
              />

              <Button className="w-full uppercase">
                {config ? "Update" : "Register"}
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

export default CrearConfigModal;
