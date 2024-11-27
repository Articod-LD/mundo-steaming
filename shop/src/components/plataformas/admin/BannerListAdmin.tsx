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
  Categorie,
  MappedPaginatorInfo,
  Plataforma,
  SortOrder,
} from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type IProps = {
  plataformas: Plataforma[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const MySwal = withReactContent(Swal)

const BannerAdmin = ({ Banners }: { Banners: Banner[] }) => {
  const { openModal } = useModalAction();
  const { mutate: deleteBannerMutation } = useDeleteBannerMutation()

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
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBannerMutation({ bannerId: id }, {
          onSuccess(data, variables, context) {
            MySwal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }, onError(error, variables, context) {
            toast.error('ha ocurrido un error')
            console.error(error);

          },
        })
      }
    });

  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">


        {
          Banners.length > 0 ?
            <>
              <div className="grid grid-cols-8 gap-6 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
                <div></div>
                <div className="col-span-2 text-lg">Item</div>
                <div className="col-span-1 text-lg">Titulo</div>
                <div className="col-span-2 text-lg">Texto</div>
                <div className="col-span-2 text-lg">Estado</div>
              </div>
              {
                Banners.map((banner, i) => (
                  <div key={i} className="grid grid-cols-8 gap-6 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                    {/* Botón de Eliminar */}
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="border-2 border-red-500 text-red-500 hover:bg-red-100 p-1 rounded-full transition duration-300"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Imagen */}
                    <div className="col-span-2 flex justify-center items-center">
                      <div className="relative w-[400px] h-[150px] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                        <Image
                          src={banner.imagen_url}
                          layout="fill"
                          objectFit="cover"
                          quality={100}
                          alt={banner.titulo || 'Banner Image'}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Título */}
                    <div className="col-span-1 flex justify-center items-center text-xl font-semibold text-gray-800">
                      {banner.titulo}
                    </div>

                    {/* Texto */}
                    <div className="col-span-2 flex justify-center items-center text-gray-600 text-sm px-4 text-justify">
                      {banner.texto}
                    </div>

                    {/* Botón de Editar */}
                    <div className="col-span-2 flex justify-center items-center">
                      <Button
                        variant="outline"
                        className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] hover:bg-[#FFB422] hover:text-white transition-colors duration-300"
                        onClick={() => handleUpdateClick(banner)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))
              }
            </>
            :
            <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
              <div className="text-center text-xl font-semibold text-gray-700">
                <p>No hay Banners registrados!</p>
                <p className="text-sm text-gray-500">registra alguno para poder visualizarlo.</p>
              </div>
            </div>

        }

        {/* Botón para Agregar Banner */}
        <div className="flex items-center justify-end p-6">
          <button
            className="p-3 bg-brand rounded-xl text-white text-lg font-semibold uppercase transition ease-in-out hover:scale-105 hover:bg-red-800 duration-300"
            onClick={handleClick}
          >
            + Agregar Banner
          </button>
        </div>
      </div>
    </div>
  );



};

export default BannerAdmin;
