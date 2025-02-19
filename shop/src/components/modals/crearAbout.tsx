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
  useRegisterMutation,
  useUpdateAboutMutation,
  useUpdateConfigMutation,
  useUpdatePlataformaMutation,
  useUpdateProductoMutation,
} from "@/data/user";
import DatePickerInput from "../ui/date-picker";
import { format, parseISO } from "date-fns";

const createConfiguracionFormSchema = yup.object().shape({
  description: yup.string().required("El titulo es requerido"),
  video_url: yup
    .string()
    .url("Debe ser una URL válida")
    .required("El enlace de Instagram es requerido"),
  image_url: yup
    .mixed()
    .test(
      "fileFormat",
      "La imagen debe ser un archivo válido (jpeg, jpg, gif, png)",
      (value) => {
        if (!value || value.length === 0) return true;
        return (
          value &&
          ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
            value[0]?.type
          )
        );
      }
    )
    .test("fileSize", "La imagen no puede ser mayor a 1MB", (value) => {
      if (!value || value.length === 0) return true;
      return value && value[0]?.size <= 1 * 1024 * 1024; // 1MB
    }),
});

function CrearAboutModal({ about }: { about?: IAbout }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placeholderDate, setPlaceholderDate] = useState<string>("");
  const { mutate: registerProduct, isLoading } = useProductConfigMutation();
  const [plataformaDefault, setPlataformaDefault] = useState<string | null>();

  console.log(about?.image_url);
  

  const [previewImage, setPreviewImage] = useState<string | null>(
    about?.image_url || null
  );

  const { mutate: createPlataforma } = useRegisterAboutMutation();
  const { mutate: updatePlataforma, isLoading: isLoadingUpdate } =
  useUpdateAboutMutation();

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({ description, image_url, video_url }: IAboutSinId) {
    const formData = new FormData();
    formData.append("description", description);

    if (image_url && image_url[0]) {
      formData.append("image_url", image_url[0]);
    }
    formData.append("video_url", video_url);

    if (!about) {
      createPlataforma(formData, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response.data.error);
        },
      });
    } else {
      updatePlataforma(
        { aboutId: about.id, params: formData },
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

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        {about ? "Actualizar" : "Crear"} Configuracion
      </h3>

      <>
        <Form<IAboutSinId>
          validationSchema={createConfiguracionFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors }, control, reset }) => (
            // eslint-disable-next-line react-hooks/rules-of-hooks

            <>
              <Input
                label="Descipcion Sobre Nosotros"
                {...register("description")}
                type="text"
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.description?.message}
                defaultValue={about?.description}
                isRequired
              />
              <Input
                label="Video URl"
                {...register("video_url")}
                error={errors?.video_url?.message!}
                variant="outline"
                type="text"
                isEditar={true}
                className="mb-4"
                defaultValue={about?.video_url}
                isRequired
              />

              <div className="flex flex-col mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Imagen
                  {!about && <span className="text-red-500 px-1">*</span>}
                </label>

                {previewImage && (
                  <Image
                    src={previewImage}
                    width={150}
                    height={52}
                    quality={100}
                    alt="img banner"
                    className="mb-4"
                  />
                )}

                <Input
                  type="file"
                  {...register("image_url", { onChange: handleImageChange })}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  error={errors?.image_url?.message!}
                />
              </div>

              <Button className="w-full uppercase">
                {about ? "Update" : "Register"}
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

export default CrearAboutModal;
