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
  Plataforma,
  Product,
} from "@/types";
import PasswordInput from "../ui/password-input";
import SelectInput from "../ui/select-input";
import {
  usePlataformasQuery,
  useProductRegisterMutation,
  useRegisterMutation,
  useUpdatePlataformaMutation,
  useUpdateProductoMutation,
} from "@/data/user";
import DatePickerInput from "../ui/date-picker";
import { format, parseISO } from "date-fns";

const createProductoFormSchema = yup.object().shape({
  plataforma: yup
    .object()
    .shape({
      id: yup.number().required(),
      name: yup.string().required(),
      type: yup.string().required(),
    })
    .typeError("Debe seleccionar una plataforma")
    .required("La plataforma es requerida"),
  correo: yup
    .string()
    .email("Debe ser un correo válido")
    .required("El correo es requerido"),
  contrasena: yup.string().required("La contraseña es requerida"),
  perfil: yup
    .string()
    .nullable()
    .when("plataforma.type", {
      is: "pantalla",
      then: yup
        .string()
        .required("El perfil es obligatorio para plataformas tipo pantalla"),
      otherwise: yup.string().nullable(),
    }),
  pin_perfil: yup
    .string()
    .typeError("El PIN del perfil debe ser un número")
    .nullable()
    .when("plataforma.type", {
      is: "pantalla",
      then: yup
        .string()
        .required(
          "El PIN del perfil es obligatorio para plataformas tipo pantalla"
        ),
      otherwise: yup.string().nullable(),
    }),
  fecha_compra: yup
    .date()
    .typeError("Debe ser una fecha válida")
    .required("La fecha de compra es requerida"),
  meses: yup
    .number()
    .typeError("Debe ser al menos 1 mes")
    .min(1, "Debe ser al menos 1 mes")
    .required("Debe ser al menos 1 mes"),
});

type PlataformaTransformed = {
  id: number;
  name: string;
};

function CrearProductoModal({ producto }: { producto?: Product }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plataformasTransformed, setPlataformasTransformed] = useState<
    PlataformaTransformed[] | null
  >(null);
  const [placeholderDate, setPlaceholderDate] = useState<string>("");

  const { mutate: registerProduct, isLoading } = useProductRegisterMutation();
  const [plataformaDefault, setPlataformaDefault] = useState<string | null>();
  const { mutate: updatePlataforma, isLoading: isLoadingUpdate } =
    useUpdateProductoMutation();

  const { plataformas, error, loading } = usePlataformasQuery({
    limit: 20,
  });

  useEffect(() => {
    if (plataformas && Array.isArray(plataformas)) {
      const transformedData = plataformas.map((plataforma) => ({
        id: plataforma.id,
        name: `${plataforma.name || ""} - ${plataforma.type || ""}`,
        type: plataforma.type,
      }));

      setPlataformasTransformed(transformedData);
    } else {
      console.error("La variable 'plataformas' no es un array válido.");
    }
  }, []); // Solo depende de plataformas

  // Efecto para configurar datos del producto
  useEffect(() => {
    if (producto) {
      const placeholderDate = format(
        parseISO(producto.purchase_date),
        "dd/MM/yyyy"
      );

      setPlaceholderDate(placeholderDate);
    }
  }, [producto]); // Solo depende de producto

  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  function onSubmit({
    contrasena,
    correo,
    fecha_compra,
    meses,
    plataforma,
    perfil,
    pin_perfil,
  }: CreateProductoForm) {
    if (!producto) {
      registerProduct(
        {
          plataforma_id: plataforma.id,
          email: correo,
          password: contrasena,
          perfil,
          pin_perfil,
          meses,
          fecha_compra,
        },
        {
          onSuccess: (data) => {
            closeModal();
          },
          onError: (error: any) => {
            toast.error("ha ocurrido un error");
          },
        }
      );
    } else {
      updatePlataforma(
        {
          productoId: producto.id,
          params: {
            plataforma_id: plataforma.id,
            email: correo,
            password: contrasena,
            perfil,
            pin_perfil,
            meses,
            fecha_compra,
          },
        },
        {
          onSuccess(data, variables, context) {
            closeModal();
          },
          onError(error: any) {
            setErrorMessage(error.response.data.message);
          },
        }
      );
    }
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        {producto ? "Actualizar" : "Crear"} Producto
      </h3>

      <>
        <Form<CreateProductoForm>
          validationSchema={createProductoFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors }, control, reset }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (producto) {
                const plataformaDefaultCampo = `${
                  producto.plataforma.name || ""
                } - ${producto.plataforma.type || ""}`;
                const transformedData = plataformas.map((plataforma) => ({
                  id: plataforma.id,
                  name: `${plataforma.name || ""} - ${plataforma.type || ""}`,
                  type: plataforma.type,
                }));

                reset({
                  plataforma: transformedData.find(
                    (pla) => pla.name === plataformaDefaultCampo
                  ),
                });
              }
            }, [producto]);
            return (
              <>
                <div className="mb-4">
                  <SelectInput
                    label="Plataforma"
                    name="plataforma"
                    control={control}
                    getOptionLabel={(option: any) => {
                      return option.name;
                    }}
                    getOptionValue={(option: any) => {
                      return option.name;
                    }}
                    defaultValue={
                      plataformasTransformed
                        ? (plataformasTransformed.filter(
                            (pla) => pla.name === plataformaDefault
                          ) as unknown as object[])
                        : undefined
                    }
                    options={plataformasTransformed as any}
                    placeholder="seleccionar"
                    isClearable={true}
                  />
                  <p className="my-2 text-xs text-red-500 text-start">
                    {errors?.plataforma?.message!}
                  </p>
                </div>

                <Input
                  label="Correo Electronico"
                  {...register("correo")}
                  type="email"
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  error={errors?.correo?.message}
                  defaultValue={producto?.credencial.email}
                  isRequired
                />
                <PasswordInput
                  label="Contraseña"
                  {...register("contrasena")}
                  error={errors?.contrasena?.message!}
                  variant="outline"
                  isEditar={true}
                  className="mb-4"
                  defaultValue={producto?.credencial.password}
                  isRequired
                />
                <Input
                  label="Nombre Perfil"
                  {...register("perfil")}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  defaultValue={producto?.profile_name}
                  error={errors?.perfil?.message}
                />

                <Input
                  label="Contraseña Perfil"
                  {...register("pin_perfil")}
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  defaultValue={producto?.profile_pin}
                  error={errors?.pin_perfil?.message}
                />

                <DatePickerInput
                  defaultValue={
                    producto ? parseISO(producto.purchase_date) : new Date()
                  }
                  control={control}
                  name="fecha_compra"
                  className="w-full mb-4 text-gray-600"
                  error={errors?.fecha_compra?.message}
                  label="Fecha De Compra"
                  startDate={
                    producto ? parseISO(producto.purchase_date) : new Date()
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholder={placeholderDate}
                />

                <Input
                  label="Dias Comprados"
                  {...register("meses")}
                  type="number"
                  variant="outline"
                  className="mb-4"
                  isEditar={true}
                  error={errors?.meses?.message}
                  defaultValue={producto?.months}
                />

                <Button className="w-full uppercase">
                  {producto ? "Update" : "Register"}
                </Button>
              </>
            );
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

export default CrearProductoModal;
