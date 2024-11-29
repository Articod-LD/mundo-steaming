import { AceptarSolicitudInput } from "@/types";
import Form from "../ui/forms/form";

import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import DatePickerInput from "../ui/date-picker";
import Checkbox from "../ui/checkbox";
import Button from "../ui/button";
import Alert from "../ui/alert";
import {
  useAceptarSolicitudMutation,
  useCreateSuscripcionMutation,
  usePlataformasQuery,
} from "@/data/user";
import { useState } from "react";
import SelectInput from "../ui/select-input";
import { useModalAction } from "../ui/modal/modal.context";
import toast from "react-hot-toast";

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

function AgregatePlataformaModal({ id }: { id: string }) {
  const { mutate: crearSuscripcion, isLoading } =
    useCreateSuscripcionMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { plataformas, error, loading } = usePlataformasQuery({
    limit: 20,
  });

  const { closeModal } = useModalAction();

  async function onSubmit({
    email,
    fecha_fin,
    fecha_inicio,
    password,
    precio,
    pagado,
    plataforma,
  }: AceptarSolicitudInput) {

  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Agregar Plataforma
      </h3>

      <>
        <Form<AceptarSolicitudInput>
          validationSchema={AceptarSolicitudSchema}
          onSubmit={onSubmit}
        >
          {({ control, register, formState: { errors }, setValue }) => (
            <>
              <div>
                <SelectInput
                  label="Plataforma"
                  name="plataforma"
                  control={control}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  options={plataformas}
                  placeholder="Selecionar"
                  isClearable={true}
                  isLoading={loading}
                />
              </div>

              <Input
                label="Precio"
                type="number"
                {...register("precio")}
                variant="outline"
                className="mb-4"
                isEditar={true}
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

export default AgregatePlataformaModal;
