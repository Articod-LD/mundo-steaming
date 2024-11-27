import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import Button from "../ui/button";
import { useState } from "react";
import {
  useRegisterCategorieMutation,
  useRegisterPlataformaMutation,
  useUpdateCategoriaMutation,
  useUpdatePlataformaMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import { Plataforma, PlataformaInput } from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";
import { useModalAction } from "../ui/modal/modal.context";
import SelectInput from "../ui/select-input";
import Image from "next/image";

const createPlataformaFormSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
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
    .test("fileSize", "La imagen no puede ser mayor a 2MB", (value) => {
      if (!value || value.length === 0) return true;
      return value && value[0]?.size <= 2 * 1024 * 1024; // 2MB
    }),
  public_price: yup
    .string()
    .required("El precio público es requerido")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "El precio debe ser un número válido con hasta 2 decimales"
    ),
  provider_price: yup
    .string()
    .required("El precio del proveedor es requerido")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "El precio debe ser un número válido con hasta 2 decimales"
    ),
  type: yup
    .object().required('el tipo es requerido')
});


function CrearPlataformaModal({ plataforma }: { plataforma?: Plataforma }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(
    plataforma?.image_url || null
  );

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  const { mutate: createPlataforma, isLoading } = useRegisterPlataformaMutation();
  const { mutate: updatePlataforma, isLoading: isLoadingUpdate } = useUpdatePlataformaMutation();

  function onSubmit({
    image_url,
    name,
    provider_price,
    public_price,
    type
  }: PlataformaInput) {
    const typeConverted = type as unknown as { name: string };
    const typeName = typeConverted.name;
    const formData = new FormData();
    formData.append("name", name);

    if (image_url && image_url[0]) {
      formData.append("image_url", image_url[0]); // Solo si se seleccionó una imagen nueva
    }

    formData.append("provider_price", provider_price);
    formData.append("public_price", public_price);
    formData.append("type", typeName);


    

    if (!plataforma) {
      createPlataforma(formData, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          setErrorMessage(error.response.data.error);
        },
      });
    } else {

      updatePlataforma({ plataformaId: plataforma.id, params: formData }, {
        onSuccess(data, variables, context) {
          closeModal();
        },
        onError(error: any) {
          console.log(error);
          
          setErrorMessage(error.response.data.error);
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
        {plataforma ? "Actualizar" : "Crear"} Plataforma
      </h3>

      <>
        <Form<PlataformaInput>
          validationSchema={createPlataformaFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors }, control }) => (
            <>
              <Input
                label="Nombre"
                {...register("name")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={plataforma?.name}
                error={errors?.name?.message!}
              />

              <div className="flex flex-col mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Imagen
                  {
                    !plataforma &&
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
                  type="file"
                  {...register("image_url", { onChange: handleImageChange })}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  error={errors?.image_url?.message!}
                />
              </div>


              <Input
                label="Precio Publico"
                type="Number"
                {...register("public_price")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={plataforma?.public_price}
                error={errors?.public_price?.message!}
              />
              <Input
                label="Precio Distribuidor"
                type="Number"
                {...register("provider_price")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={plataforma?.provider_price}
                error={errors?.provider_price?.message!}
              />

              <div className="mb-4">
                <SelectInput
                  label="tipo"
                  name="type"
                  control={control}
                  getOptionLabel={(option: any) => {
                    return option.name
                  }}
                  getOptionValue={(option: any) => {

                    return option.name
                  }}
                  defaultValue={[{ id: 1, name: 'completa' }, { id: 2, name: 'pantalla' }].filter(value => value.name === plataforma?.type)}
                  options={[{ id: 1, name: 'completa' }, { id: 2, name: 'pantalla' }]}
                  placeholder="Selecionar"
                  isClearable={true}
                />
                <p className="my-2 text-xs text-red-500 text-start">{errors?.type?.message!}</p>
              </div>

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
