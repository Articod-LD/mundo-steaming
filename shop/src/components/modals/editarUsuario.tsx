import { Permission, RegisterInputType, User } from "@/types";
import RegistrationForm from "../auth/registration-form";
import Form from "../ui/forms/form";
import * as yup from "yup";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Alert from "../ui/alert";
import { useState } from "react";
import { useMe, useRegisterAdminMutation, useRegisterMutation, useRegisterProviderMutation, useUpdateAdministradortMutation, useUpdateCategoriaMutation, useUpdateClientMutation, useUpdateProvidertMutation } from "@/data/user";
import toast from "react-hot-toast";
import { useModalAction } from "../ui/modal/modal.context";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";

const registrationFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("Formato de Correo Incorrecto")
        .required("Correo es requerido"),
    password: yup.string().nullable(),
    name: yup.string().required("form:error-name-required"),
    phone: yup
        .string()
        .nullable() // Permitir que sea null
        .transform((value) => (value === "" ? undefined : value)) // Transformar "" a undefined
        .optional(), // Permitir undefined (y null) como valor válido
    permission: yup.string().default("customer").oneOf(["customer"]),
});


function EditarUsuarioModal({ data }: { data: { type: string, user: User } }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { mutate: registerUser, isLoading } = useRegisterMutation();
    const { mutate: registerAdmin, isLoading: isLoadingAdmin } = useRegisterAdminMutation();
    const { mutate: registerProvider, isLoading: isLoadingProvider } = useRegisterProviderMutation();
    const { closeModal } = useModalAction();
    const queryClient = useQueryClient();

    const { mutate: updateClient, isLoading: isLoadingUpdate } = useUpdateClientMutation();
    const { mutate: updateAdmin, isLoading: isLoadingUpdateAdmin } = useUpdateAdministradortMutation();
    const { mutate: updateProvider, isLoading: isLoadingUpdateProvider } = useUpdateProvidertMutation();

    const { me } = useMe()
    async function onSubmit({
        name,
        email,
        password,
        permission,
        phone,
    }: RegisterInputType) {


        const dataSubmit:any = {
            name,
            email,
            phone,
        }

        if (dataSubmit.email === data.user.email) {
            delete dataSubmit.email
        }

        if (data.type === 'Cliente') {
            updateClient({ clientId: data.user.id, params: dataSubmit }, {
                onSuccess(data, variables, context) {
                    closeModal();
                },
                onError(error: any) {
                    setErrorMessage(error.response?.data?.message || "Error al actualizar el banner");
                },
            });
        }
        if (data.type === 'Administrador') {
            if (me?.id === data.user.id) {
                if (me.email !== dataSubmit.email) {
                    toast.error('No puedes cambiar tu correo.');
                }
                return
              }

            updateAdmin({ adminId: data.user.id, params: dataSubmit }, {
                onSuccess(data, variables, context) {
                    closeModal();
                },
                onError(error: any) {
                    setErrorMessage(error.response?.data?.message || "Error al actualizar el banner");
                },
            });
        }

        if (data.type === 'Distribuidor') {
            updateProvider({ providerId: data.user.id, params: dataSubmit }, {
                onSuccess(data, variables, context) {
                    closeModal();
                },
                onError(error: any) {
                    setErrorMessage(error.response?.data?.message || "Error al actualizar el banner");
                },
            });
        }
    }

    const constructErrorMessage = (errorObject: any) => {
        let errorMessage = "";
        for (const key in errorObject) {
            if (errorObject.hasOwnProperty(key)) {
                errorMessage += `${errorObject[key].join(", ")}\n`; // Concatenar mensajes de error para cada clave
            }
        }
        return errorMessage.trim(); // Eliminar espacios en blanco al inicio y al final
    };

    return (
        <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
            <h3 className="text-brand text-2xl font-bold uppercase mb-5">
                Editar {data.type}
            </h3>

            <>
                <Form<RegisterInputType>
                    validationSchema={registrationFormSchema}
                    onSubmit={onSubmit}
                >
                    {({ register, formState: { errors } }) => (
                        <>
                            <Input
                                label="Correo Electronico"
                                {...register("email")}
                                type="email"
                                variant="outline"
                                className="mb-4"
                                isEditar={true}
                                error={errors?.email?.message}
                                defaultValue={data.user.email}
                            />

                            <Input
                                label="Nombre Completo"
                                {...register("name")}
                                variant="outline"
                                className="mb-4"
                                isEditar={true}
                                error={errors?.name?.message!}
                                defaultValue={data.user.name}
                            />
                            <Input
                                label="Telefono"
                                type="Number"
                                {...register("phone")}
                                variant="outline"
                                className="mb-4"
                                isEditar={true}
                                error={errors?.phone?.message!}
                                defaultValue={data.user.phone}
                            />

                            <Button
                                type="submit"
                                className="w-full uppercase"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Editar
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

export default EditarUsuarioModal;
