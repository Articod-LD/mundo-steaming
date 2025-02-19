import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useState } from "react";
import {
  useRegisterBannerMutation,
  useRegisterCategorieMutation,
  useRegisterPlataformaMutation,
  useUpdateCategoriaMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import {
  Banner,
  BannerInput,
  Categorie,
  CategorieInput,
  Plataforma,
  PlataformaInput,
} from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";
import Image from "next/image";

const createCategoriaFormSchema = yup.object().shape({
  titulo: yup
    .string()
    .required("El título es requerido")
    .max(255, "El título no puede tener más de 255 caracteres"),
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
    }),
});

function CrearCategoriaModal({ categorie }: { categorie?: Categorie }) {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createBanner, isLoading } = useRegisterCategorieMutation();
  const { mutate: updateBanner, isLoading:isLoadingUpdate } = useUpdateCategoriaMutation();


  const [previewImage, setPreviewImage] = useState<string | null>(
    categorie?.imagen_url || null
  );

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({ imagen, titulo }: CategorieInput) {

    const formData = new FormData();
    formData.append("titulo", titulo);


    if (imagen && imagen[0]) {
      formData.append("imagen", imagen[0]); // Solo si se seleccionó una imagen nueva
    } 
    
    if (!categorie && imagen.length===0) {
      setErrorMessage("La imagen es requerida");
      return;
    }

    if (!categorie) {
      createBanner(formData, {
        onSuccess(data, variables, context) {
          toast.success("Banner creado correctamente");
          queryClient.invalidateQueries([API_ENDPOINTS.CATEGORIE_LIST]);
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response.data.message);
        },
      });
    }else{

      updateBanner({ categoriaId: categorie.id, params:formData }, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response?.data?.message || "Error al actualizar el banner");
        },
      });
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
        {categorie ? "Actualizar" : "Crear"} Categoria
      </h3>

      <>
        <Form<CategorieInput>
          validationSchema={createCategoriaFormSchema}
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
                defaultValue={categorie?.titulo}
                error={errors?.titulo?.message!}
                isRequired={!categorie}
              />
       <div className="flex flex-col mb-3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Imagen
                    {
                      !categorie &&
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

              <Button
                className="w-full uppercase"
                isLoading={isLoading || isLoadingUpdate}
                disabled={isLoading ||isLoadingUpdate }
              >
                {categorie ? "Update" : "Register"}
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

export default CrearCategoriaModal;
