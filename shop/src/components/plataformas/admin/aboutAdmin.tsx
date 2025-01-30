import { CloseIcon } from "@/components/icons/close-icon";
import { NoDataFound } from "@/components/icons/no-data-found";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Table } from "@/components/ui/table";
import TitleWithSort from "@/components/ui/title-with-sort";
import { Title } from "@/components/ui/tittleSections";
import { useDeleteBannerMutation } from "@/data/user";
import {
  Banner,
  Beneficio,
  Categorie,
  IAbout,
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

const AboutAdmin = ({ about }: { about: IAbout }) => {
  const { openModal } = useModalAction();
  const { mutate: deleteBannerMutation } = useDeleteBannerMutation();

  function handleClick() {
    openModal("CREAR_BANNER");
  }

  function handleUpdateClick(categoria: Banner) {
    openModal("CREAR_BANNER", categoria);
  }

  function deleteBanner(id: number) {
    MySwal.fire({
      title: "Eliminar Banner",
      text: "Vas a eliminar un banner estas seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBannerMutation(
          { bannerId: id },
          {
            onSuccess(data, variables, context) {
              MySwal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            },
            onError(error, variables, context) {
              toast.error("ha ocurrido un error");
              console.error(error);
            },
          }
        );
      }
    });
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden pb-10">
        {Object.keys(about).length > 0 ? (
          <>
            <div className="grid grid-cols-9 gap-6 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
              <div className="col-span-3 text-lg">Descripcion</div>
              <div className="col-span-3 text-lg">Image Url</div>
              <div className="col-span-3 text-lg">Video Url</div>
            </div>

            <div className="grid grid-cols-9 gap-6 items-center py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
              {/* Título */}
              <div className="col-span-3 flex justify-center items-center text-sm font-semibold text-gray-800">
                {about.description}
              </div>

              {/* Texto */}
              <div className="col-span-3 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {about.image_url}
              </div>

              <div className="col-span-3 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                {about.video_url}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
            <div className="text-center text-xl font-semibold text-gray-700">
              <p>No hay Beneficios registrados!</p>
              <p className="text-sm text-gray-500">
                registra alguno para poder visualizarlo.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AboutAdmin;
