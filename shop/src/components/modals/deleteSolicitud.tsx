import React from "react";
import Button from "../ui/button";
import { useModalAction } from "../ui/modal/modal.context";
import { useDeleteSolicitudMutation } from "@/data/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/data/client/api-endpoints";

function DeleteSolicitud({ id }: { id: number }) {
  const { closeModal } = useModalAction();
  const { mutate: deleteSolicitudById } = useDeleteSolicitudMutation();
  const queryClient = useQueryClient();

  function deleteSolicitud() {
    deleteSolicitudById(
      { solicitud_id: `${id}` },
      {
        onError(error, variables, context) {
          toast.error("hubo un error inesperado");
        },
        onSuccess(data, variables, context) {
          closeModal();
        },
      }
    );
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Rechazar Solicitud
      </h3>
      <p>Deseas rechazar esta solicitud?, esta accion no tiene vuelta atras!</p>

      <div className="mt-5 flex gap-4 justify-end">
        <Button
          variant="outline"
          className="py-1 px-2 border-2 border-green-600 rounded-2xl text-green-600 flex items-center justify-center"
          onClick={deleteSolicitud}
        >
          Aceptar
        </Button>

        <Button
          variant="outline"
          className="py-1 px-2 border-2 border-brand rounded-2xl text-brand flex items-center justify-center"
          onClick={closeModal}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export default DeleteSolicitud;
