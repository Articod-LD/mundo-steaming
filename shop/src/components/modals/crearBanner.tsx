import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useEffect, useState } from "react";
import {
  useRegisterBannerMutation,
  useRegisterPlataformaMutation,
  useUpdateBannerMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import { Banner, BannerInput, Plataforma, PlataformaInput } from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";
import Image from "next/image";

const createBannerFormSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("El título es requerido")
    .max(255, "El título no puede tener más de 255 caracteres"),
  texto: yup.string().required("El texto es requerido"),
  imagen: yup
    .mixed()
    .nullable()
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
    .test("fileSize", "La imagen no puede ser mayor a 2MB", (value) => {
      if (!value || value.length === 0) return true; 
      return value && value[0]?.size <= 2 * 1024 * 1024; // 2MB
    })
});

function CrearBannerModal({ banner }: { banner?: Banner }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createBanner, isLoading } = useRegisterBannerMutation();
  const { mutate: updateBanner, isLoading:isLoadingUpdate } = useUpdateBannerMutation();

  const [previewImage, setPreviewImage] = useState<string | null>(
    banner?.imagen_url || null
  );

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

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({ imagen, texto, titulo }: BannerInput) {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("texto", texto);
  
    // Solo agregar la imagen si hay una nueva imagen seleccionada
    if (imagen && imagen[0]) {
      formData.append("imagen", imagen[0]); // Solo si se seleccionó una imagen nueva
    } 
    console.log({banner, imagen});
    
    if (!banner && imagen.length===0) {
      setErrorMessage("La imagen es requerida");
      return;
    }
  
    // Crear o actualizar el banner según el caso
    if (!banner) {
      // Si es creación, asegurarse de que la imagen esté presente
      createBanner(formData, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response?.data?.message || "Error al crear el banner");
        },
      });
    } else {
      // Si es actualización, enviamos los datos incluso si no se incluye una imagen

      console.log({imagen});
      

      updateBanner({ bannerId: banner.id, params:formData }, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response?.data?.message || "Error al actualizar el banner");
        },
      });
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
          {({ register, formState: { errors } }) => {
            return (
              <>
                <Input
                  label="Titulo"
                  {...register("titulo")}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  defaultValue={banner?.titulo}
                  error={errors?.titulo?.message!}
                  isRequired = {!banner}
                />
                <div className="flex flex-col mb-3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Imagen
                    {
                      !banner &&
                      <span className="text-red-500 px-1">*</span>
                    }
                  </label>

                  {
                    previewImage &&
                    <Image
                      src={previewImage}
                      width={150}
                      height={52}
                      quality={100}
                      alt="img banner"
                      className="mb-4"
                    />
                  }

                  <Input
                    className="border-dashed border border-brand"
                    type="file"
                    {...register("imagen", { onChange: handleImageChange })}
                    variant="outline"
                    error={errors?.imagen?.message!}
                  />
                </div>
                <Input
                  label="Texto"
                  {...register("texto")}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  defaultValue={banner?.texto}
                  error={errors?.texto?.message!}
                  isRequired ={!banner}
                />
                <Button
                  className="w-full uppercase"
                  isLoading={isLoading || isLoadingUpdate}
                  disabled={isLoading ||isLoadingUpdate }
                >
                  {banner ? "Update" : "Register"}
                </Button>
              </>
            )
          }}
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
