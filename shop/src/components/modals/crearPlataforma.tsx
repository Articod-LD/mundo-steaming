import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useState } from "react";
import {
  useRegisterPlataformaMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import { Plataforma, PlataformaInput } from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";

const createPlataformaFormSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  image_url: yup
    .mixed()
    .required("La imagen es requerida")
    .test(
      "fileFormat",
      "La imagen debe ser un archivo válido (jpeg, jpg, gif, png)",
      (value) => {
        return (
          value &&
          ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
            value[0]?.type
          )
        );
      }
    )
    .test("fileSize", "La imagen no puede ser mayor a 2MB", (value) => {
      return value && value[0]?.size <= 2 * 1024 * 1024; // 2MB
    }),
  precio: yup
    .string()
    .required("El precio es requerido")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "El precio debe ser un número válido con hasta 2 decimales"
    ),
  precio_provider: yup
    .string()
    .required("El precio es requerido")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "El precio debe ser un número válido con hasta 2 decimales"
    ),
});

function CrearPlataformaModal({ plataforma }: { plataforma?: Plataforma }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createPlataforma, isLoading } =
    useRegisterPlataformaMutation();

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({
    image_url,
    name,
    precio,
    precio_provider,
  }: PlataformaInput) {
    if (!plataforma) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image_url", image_url[0]);
      formData.append("precio", precio);
      formData.append("precio_provider", precio_provider);

      createPlataforma(formData, {
        onSuccess(data, variables, context) {
          toast.success("Plataforma creada correctamente");
          queryClient.invalidateQueries([API_ENDPOINTS.PLATAFORMA_LIST]);
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response.data.message);
        },
      });
      return;
    }
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        {plataforma ? "Actualizar" : "Crear"} Plataforma
      </h3>

      <>
        <Form<PlataformaInput>
          validationSchema={createPlataformaFormSchema}
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
                defaultValue={plataforma?.name}
                error={errors?.name?.message!}
              />
              <Input
                label="Imagen Url"
                type="file"
                {...register("image_url")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.image_url?.message!}
              />
              <Input
                label="Precio"
                type="Number"
                {...register("precio")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={plataforma?.precio}
                error={errors?.precio?.message!}
              />
              <Input
                label="Precio Proveedor"
                type="Number"
                {...register("precio_provider")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={plataforma?.precio_provider}
                error={errors?.precio?.message!}
              />
              <Button
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {plataforma ? "Update" : "Register"}
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

export default CrearPlataformaModal;
