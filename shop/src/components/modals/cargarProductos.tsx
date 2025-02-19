import React, { useState } from "react";
import * as yup from "yup";
import { useModalAction } from "../ui/modal/modal.context";
import { CategorieInput } from "@/types";
import Input from "../ui/input";
import Form from "../ui/forms/form";
import Button from "../ui/button";
import { useRegisterCategorieMutation, useRegisterProductsCargaMasivaMutation } from "@/data/user";
import Alert from "../ui/alert";

const FormSchema = yup.object().shape({
    file: yup
        .mixed()
        .required()
        .test(
            "fileFormat",
            "Debe ser un archivo válido excel ó (xlsx)",
            (value) => {
                if (!value || value.length === 0) return false;
                return (
                    value &&
                    ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(
                        value[0]?.type
                    )
                );
            }
        )
})

const BulkProductUploadModal = () => {
    const { closeModal } = useModalAction();
    const { mutate: cargaMasiva, isLoading } = useRegisterProductsCargaMasivaMutation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const onSubmit = (data: unknown) => {
        const fileConverted = data as { file: FileList };
        const formData = new FormData();
        formData.append("file", fileConverted.file[0]);

        cargaMasiva(formData, {
            onSuccess(data, variables, context) {
                closeModal();
            },
            onError(error: any) {
                setErrorMessage(error.response.data.error);
            },
        });
    }


    return (
        <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
            <h3 className="text-brand text-2xl font-bold uppercase mb-5">
                Carga Masiva de Productos
            </h3>
            <>
                <Form<{ file:unknown }>
                    validationSchema={FormSchema}
                    onSubmit={onSubmit}
                >
                    {({ register, formState: { errors } }) => (
                        <>
                            <div className="mb-4">
                                <span className="text-gray-600">Seleccionar archivo Excel</span>
                                <Input
                                    type="file"
                                    accept=".xlsx"
                                    {...register("file")}
                                    variant="outline"
                                    className="my-4"
                                    error={errors?.file?.message!}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full uppercase"
                            >
                                Subir Productos
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

export default BulkProductUploadModal;
