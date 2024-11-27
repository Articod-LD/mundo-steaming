import React, { useState } from "react";
import Form from "../ui/forms/form";
import { AceptarSolicitudInput } from "@/types";
import Button from "../ui/button";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import {
  useAceptarSolicitudMutation,
  useRegisterPlataformaMutation,
  useUpdateWalletMutation,
} from "@/data/user";
import Alert from "../ui/alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import DatePickerInput from "../ui/date-picker";
import { Switch } from "@headlessui/react";
import Checkbox from "../ui/checkbox";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { useModalAction } from "../ui/modal/modal.context";

const AceptarSolicitudSchema = yup.object().shape({
  fecha_inicio: yup.date().required("La fecha de inicio es requerida"),
  fecha_fin: yup.date().required("La fecha de fin es requerida"),
  precio: yup.string().required("El precio es requerido"),
  pagado: yup.boolean(),
  email: yup
    .string()
    .email("El email no es válido")
    .required("El email es requerido"),
  password: yup.string().required("La contraseña es requerida"),
  plataforma: yup.object(),
});

function AceptarSolicitud({ data }: { data?: any }) {

  const { mutate: createPlataforma, isLoading } = useAceptarSolicitudMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { closeModal } = useModalAction();

  const { mutate: updateWallet } = useUpdateWalletMutation();

  function getPrice() {
    const precio = data.solicitud.user.permissions.some(
      (permission: any) => permission.name === "provider"
    )
      ? data.solicitud.tipo.precio_provider
      : data.solicitud.tipo.precio;

    return precio;
  }

  function onSubmit({
    email,
    fecha_fin,
    fecha_inicio,
    password,
    precio,
    pagado,
  }: AceptarSolicitudInput) {
    createPlataforma(
      {
        variables: {
          email,
          fecha_fin,
          fecha_inicio,
          password,
          precio,
          pagado,
        },
        solicitud_id: data.solicitud.id,
      },
      {
        onError(error, variables, context) {
          toast.error("ha ocurrido un error");
        },
        onSuccess(data, variables, context) {
          toast.success("usuario suscrito");
          closeModal();

          updateWallet(
            {
              variables: {
                operation: "subtract",
                userId: data.solicitud.user.id,
                amount: getPrice(),
              },
            },
            {
              onSuccess(data, variables, context) {
                toast.success("billetera actualizada correctamente");
              },
              onError(error, variables, context) {
                toast.error("error actualizando billetera");
              },
            }
          );
        },
      }
    );
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Aceptar Solicitud
      </h3>

      <>
        <Form<AceptarSolicitudInput>
          validationSchema={AceptarSolicitudSchema}
          onSubmit={onSubmit}
        >
          {({ control, register, formState: { errors }, setValue }) => (
            <>
              <Input
                label="Precio"
                type="number"
                {...register("precio")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                defaultValue={getPrice()}
                error={errors?.precio?.message!}
              />

              <Input
                label="Email"
                {...register("email")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.email?.message!}
              />

              <PasswordInput
                label="Password"
                {...register("password")}
                variant="outline"
                className="mb-4"
                isEditar={true}
                error={errors?.password?.message!}
              />

              <DatePickerInput
                control={control}
                name="fecha_inicio"
                className="w-full mb-4"
                error={errors?.fecha_inicio?.message}
                label="Fecha Inicio"
                startDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholder="Fecha Inicio"
              />

              <DatePickerInput
                control={control}
                name="fecha_fin"
                className="w-full mb-4"
                error={errors?.fecha_fin?.message}
                label="Fecha Fin"
                startDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholder="Fecha Fin"
              />

              <Checkbox
                label="Pagado?"
                {...register("pagado")}
                className="mb-4"
              />

              <Button
                className="w-full uppercase"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Aceptar
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

export default AceptarSolicitud;
