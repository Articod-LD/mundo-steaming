import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useState } from "react";
import {
  useRegisterBannerMutation,
  useRegisterPlataformaMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import { Banner, BannerInput, Plataforma, PlataformaInput } from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";

const createBannerFormSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("El título es requerido")
    .max(255, "El título no puede tener más de 255 caracteres"),
  texto: yup.string().required("El texto es requerido"),
  logo: yup.string().default("netflix"),
  imagen: yup
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
});

function CrearBannerModal({ banner }: { banner?: Banner }) {
  console.log(banner);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createBanner, isLoading } = useRegisterBannerMutation();

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({ imagen, logo, texto, titulo }: BannerInput) {
    if (!banner) {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("texto", texto);
      formData.append("logo", logo);
      formData.append("imagen", imagen[0]);

      createBanner(formData, {
        onSuccess(data, variables, context) {
          toast.success("Banner creado correctamente");
          queryClient.invalidateQueries([API_ENDPOINTS.BANNER_LIST]);
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
        {banner ? "Actualizar" : "Crear"} Banner
      </h3>

      <>
        <Form<BannerInput>
          validationSchema={createBannerFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors } }) => (
            <>
              <Input
                label="Titulo"
                {...register("titulo")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={banner?.titulo}
                error={errors?.titulo?.message!}
              />
              <Input
                label="Imagen"
                type="file"
                {...register("imagen")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.imagen?.message!}
              />
              <Input
                label="Texto"
                {...register("texto")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={banner?.texto}
                error={errors?.texto?.message!}
              />
              <Button
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {banner ? "Update" : "Register"}
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

export default CrearBannerModal;
