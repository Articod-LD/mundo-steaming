import { RegisterInputType, UpdateProfileInputType } from "@/types";
import Button from "../ui/button";
import Form from "../ui/forms/form";
import Input from "../ui/input";
import * as yup from "yup";
import { useState } from "react";
import {
  useMe,
  useRegisterMutation,
  useUpdateProfileMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";

const editarPerfilFormSchema = yup.object().shape({
  email: yup.string().optional(),
  name: yup.string().required("form:error-name-required"),
  documento: yup.string().required("form:error-name-required"),
  telefono: yup.string().required("form:error-name-required"),
  direccion: yup.string().required("form:error-name-required"),
});

function EditarPerfilModal() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: updateProfile, isLoading } = useUpdateProfileMutation();
  const { me } = useMe();
  const queryClient = useQueryClient();
  async function onSubmit({
    direccion,
    documento,
    name,
    telefono,
  }: UpdateProfileInputType) {
    updateProfile(
      {
        userId: me!.id,
        variables: {
          direccion,
          documento,
          name,
          telefono,
        },
      },
      {
        onSuccess(data, variables, context) {

          queryClient.invalidateQueries([API_ENDPOINTS.ME]);
        },
        onError(error: any) {


          setErrorMessage(error.response.data.message);
        },
      }
    );
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Editar Perfil
      </h3>

      <>
        <Form<UpdateProfileInputType>
          validationSchema={editarPerfilFormSchema}
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
                defaultValue={me?.name}
                error={errors?.name?.message!}
              />
              <Input
                label="Documento"
                type="Number"
                {...register("documento")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={me?.documento}
                error={errors?.documento?.message!}
              />
              <Input
                label="Telefono"
                type="Number"
                {...register("telefono")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={me?.telefono}
                error={errors?.telefono?.message!}
              />
              <Input
                label="Direccion"
                {...register("direccion")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={me?.direccion}
                error={errors?.direccion?.message!}
              />
              <Input
                label="Email"
                {...register("email")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={me?.email}
                error={errors?.direccion?.message!}
                disabled={true}
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

export default EditarPerfilModal;
