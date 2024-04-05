import { Plataforma } from "@/types";
import React, { useEffect } from "react";
import Button from "../ui/button";
import Image from "../ui/image";
import {
  useMe,
  useRegisterSolicitudMutation,
  useUpdateWalletMutation,
} from "@/data/user";
import { useModalAction } from "../ui/modal/modal.context";
import toast from "react-hot-toast";

function SolicitarPlataforma({ plataforma }: { plataforma: Plataforma }) {
  const { me } = useMe();
  const { mutate: createSolicitudMutation } = useRegisterSolicitudMutation();
  const { mutate: updateWallet } = useUpdateWalletMutation();

  const { closeModal } = useModalAction();

  function CreateSolicitud() {
    createSolicitudMutation(
      { tipo_id: plataforma.id, usuario_id: me!.id },
      {
        onSuccess(data, variables, context) {
          closeModal();

          updateWallet(
            {
              variables: {
                operation: "add",
                userId: me!.id,
                amount: +getPrecio(),
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
        onError(error: any) {
          toast.error(error.response.data.error);
          closeModal();
        },
      }
    );
  }

  function getPrecio() {
    const permissions = me!.permissions;

    const isProvider = permissions.some(
      (permission) => permission.name === "provider"
    );

    return isProvider ? plataforma.precio_provider : plataforma.precio;
  }

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-black text-2xl font-bold uppercase mb-5">
        Sucribirme a {plataforma.name}
      </h3>
      <div className="w-full flex items-center flex-col">
        <Image
          src={plataforma.image_url}
          width={400}
          height={52}
          quality={100}
          alt="img banner"
        />
        <p className="text-sm text-brand mt-2">
          El Precio de la plataforma es de ${getPrecio()}
        </p>
      </div>

      <div className="w-full flex gap-4 justify-between items-center mt-5">
        <p className="text-2xl font-bold">
          ¿Estás seguro que deseas suscribirte?
        </p>
        <Button variant="solid" onClick={CreateSolicitud}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}

export default SolicitarPlataforma;
