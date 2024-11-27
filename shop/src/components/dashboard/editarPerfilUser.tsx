import Avatar from "@/components/common/avatar";
import { CloseIcon } from "@/components/icons/close-icon";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { siteSettings } from "@/data/static/site-settings";
import { useChangePassMutation, useMe, useOneClientsQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { ChangePasswordInput } from "@/types";
import { searchModalInitialValues } from "@/utils/constants";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import Form from "../ui/forms/form";
import * as yup from "yup";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";

const loginFormSchema = yup.object().shape({
  currentpassword: yup.string().required("Contraseña es requerida"),
  newpassword: yup.string().required("Contraseña es requerida"),
  repeatpassword: yup.string().required("Contraseña es requerida"),
});

export default function EditarPerfilComponent() {
  const { me: client, isAuthorized, isLoading, error } = useMe();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { openModal } = useModalAction();

  const { mutate: chagePassuser, isLoading: loadingChange } =
    useChangePassMutation();
  function onSubmit({
    currentpassword,
    newpassword,
    repeatpassword,
  }: ChangePasswordInput) {
    setErrorMessage(null);
    if (newpassword !== repeatpassword) {
      setErrorMessage("Las nueva contraseña es distinta a la confirmacion");
    }
    chagePassuser(
      {
        userId: client!.id,
        variables: {
          currentpassword,
          newpassword,
          repeatpassword,
        },
      },
      {
        onSuccess(data, variables, context) {

        },
        onError(error: any) {
          setErrorMessage(error.response.data.message);
        },
      }
    );
  }

  function handleClick() {
    openModal("EDITAR_USER_PROFILE");
  }

  if (isLoading) return <Loader text="Cargando" />;

  return (
    <>
      <div className="w-full  flex flex-col gap-6 sm:flex-row">
        <div className="w-full h-full sm:w-1/2 bg-white flex text-black rounded-xl">
          <div className="flex flex-col py-6 w-[300px] items-center justify-around border-r-2">
            <Avatar
              src={siteSettings?.avatar?.placeholder}
              rounded="full"
              name={client!.name}
              size="2xl"
              className="shrink-0 grow-0 basis-auto drop-shadow"
            />
            <span className="text-brand text-lg text-center font-bold">
              {client?.name}
            </span>
            <div className="w-full flex justify-center flex-col items-center text-center">
              <p>Documento de identidad</p>
              <span className="font-bold text-sm">{client?.documento}</span>
            </div>

            <div className="w-full  flex justify-center flex-col items-center text-center">
              <p>Cargo</p>
              <span className="font-bold text-lg uppercase">
                {client?.permissions[0].name}
              </span>
            </div>
          </div>
          <div className="flex px-4 py-6 flex-col w-full gap-4">
            <div className="w-full">
              <span className="font-light">Correo Electronico</span>
              <p className="w-full border-b-2 border-light-800 font-bold">
                {client?.email}
              </p>
            </div>
            <div className="flex justify-between gap-3">
              <div className="w-1/2">
                <span>Telefono</span>
                <p className="w-full border-b-2 border-light-800 font-bold">
                  {client?.telefono}
                </p>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex justify-end mt-11">
                <Button
                  className="py-1 px-2 border-2 border-[#FFB422] rounded-xl text-[#FFB422] flex items-center justify-center"
                  onClick={handleClick}
                  variant="outline"
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-between sm:w-1/2 bg-white rounded-xl py-4 px-7">
          <p className="font-bold text-black text-2xl mb-5">
            Cambio de Contraseña
          </p>

          <Form<ChangePasswordInput>
            validationSchema={loginFormSchema}
            onSubmit={onSubmit}
          >
            {({ register, formState: { errors } }) => (
              <>
                <PasswordInput
                  label="Contraseña Actual"
                  {...register("currentpassword")}
                  error={errors?.currentpassword?.message!}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                />
                <PasswordInput
                  label="Nueva Contraseña"
                  {...register("newpassword")}
                  error={errors?.newpassword?.message!}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                />
                <PasswordInput
                  label="Confirmar Contraseña"
                  {...register("repeatpassword")}
                  error={errors?.repeatpassword?.message!}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                />
                <Button
                  className="w-full uppercase"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Cambiar Contraseña
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
        </div>
      </div>
    </>
  );
}
