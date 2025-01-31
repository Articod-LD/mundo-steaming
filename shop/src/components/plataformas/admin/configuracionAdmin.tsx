import { CloseIcon } from "@/components/icons/close-icon";
import { NoDataFound } from "@/components/icons/no-data-found";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Table } from "@/components/ui/table";
import TitleWithSort from "@/components/ui/title-with-sort";
import { Title } from "@/components/ui/tittleSections";
import { useDeleteBannerMutation, useDeleteConfigMutation, useDeletePlataformaMutation } from "@/data/user";
import {
  Banner,
  Beneficio,
  Categorie,
  IConfig,
  MappedPaginatorInfo,
  Plataforma,
  SortOrder,
} from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type IProps = {
  plataformas: Plataforma[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const MySwal = withReactContent(Swal);

const ConfiguracionAdmin = ({ configuracion }: { configuracion: IConfig }) => {
  const { openModal } = useModalAction();
  const { mutate: deleteClientMutation } = useDeleteConfigMutation()

  function handleClick() {
    openModal("CONFIGURACIONES");
  }

  function handleUpdateClick(categoria: IConfig) {
    openModal("CONFIGURACIONES", categoria);
  }

  function deleteBanner(id: any) {
    MySwal.fire({
      title: `Eliminar la configuracion`,
      text: `Vas a eliminar tu configuiracion estas seguro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {

        deleteClientMutation({ configId: id }, {
          onSuccess(data, variables, context) {
            MySwal.fire({
              title: "Deleted!",
              icon: "success"
            });
          }, onError(error:any) {
            toast.error(error.response.data.error)
          },
        })


      }
    });

  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden pb-10">
        {Object.keys(configuracion).length > 0 ? (
          <>
            <div className="grid grid-cols-9 gap-6 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
              <div className="col-span-1 text-lg"></div>
              <div className="col-span-1 text-lg">Titulo</div>
              <div className="col-span-1 text-lg">Celular</div>
              <div className="col-span-2 text-lg">Url Instagram</div>
              <div className="col-span-2 text-lg">Url Whatsapp</div>
              <div className="col-span-1 text-lg">@ redes</div>
              <div className="col-span-1 text-lg">Acciones</div>
            </div>

            <div className="grid grid-cols-9 gap-6 items-center py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
              <div className="col-span-1 flex justify-center items-center">
                <button
                  onClick={() => deleteBanner(configuracion!.id)}
                  className="border-2 border-red-500 text-red-500 hover:bg-red-100 p-1 rounded-full transition duration-300"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
              {/* Título */}
              <div className="col-span-1 flex justify-center items-center text-sm font-semibold text-gray-800">
                {configuracion.title}
              </div>

              {/* Texto */}
              <div className="col-span-1 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {configuracion.cel}
              </div>

              <div className="col-span-2 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {configuracion.insta_url}
              </div>

              <div className="col-span-2 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {configuracion.whatsapp_url}
              </div>

              <div className="col-span-1 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {configuracion.plataforma}
              </div>
              <div className="col-span-1 flex justify-center items-center flex-col gap-2">
                <Button
                  variant="outline"
                  className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] hover:bg-[#FFB422] hover:text-white transition-colors duration-300"
                  onClick={() => handleUpdateClick(configuracion)}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
            <div className="text-center text-xl font-semibold text-gray-700">
              <p>No hay Configuraciones registradas!</p>
              <p className="text-sm text-gray-500 mb-10">
                registra alguna para poder visualizarlo.
              </p>
              <div className="col-span-1 flex justify-center items-center flex-col gap-2">
                <Button
                  variant="outline"
                  className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] hover:bg-[#FFB422] hover:text-white transition-colors duration-300"
                  onClick={() => handleClick()}
                >
                  Crear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionAdmin;
