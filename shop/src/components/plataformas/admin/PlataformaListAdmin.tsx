import { CloseIcon } from "@/components/icons/close-icon";
import { NoDataFound } from "@/components/icons/no-data-found";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Table } from "@/components/ui/table";
import TitleWithSort from "@/components/ui/title-with-sort";
import { useDeleteClientMutation, useDeletePlataformaMutation } from "@/data/user";
import { MappedPaginatorInfo, Plataforma, SortOrder } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

type IProps = {
  plataformas: Plataforma[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const PlataformasAdmin = ({ plataformas }: { plataformas: Plataforma[] }) => {
  const { mutate: deleteClientMutation } = useDeletePlataformaMutation()
  const { openModal } = useModalAction();
  function handleUpdateClick(plataforma: Plataforma) {
    openModal("CREAR_PLATAFORMA", plataforma);
  }

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: `Eliminar una Plataforma`,
      text: `Vas a eliminar un plataforma estas seguro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {

        deleteClientMutation({ plataformaId: id }, {
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
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {plataformas.length > 0 ? (
            <>
              {/* Encabezados de la Tabla */}
              <div className="min-w-[800px] grid grid-cols-9 gap-4 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
                <div className="col-span-1 text-lg"></div>
                <div className="col-span-1 text-lg">Item</div>
                <div className="col-span-1 text-lg">Nombre</div>
                <div className="col-span-1 text-lg">Precio publico</div>
                <div className="col-span-1 text-lg">Precio distribuidor</div>
                <div className="col-span-1 text-lg">Tipo</div>
                <div className="col-span-1 text-lg">N° Credenciales</div>
                <div className="col-span-1 text-lg">N° Productos</div>
                <div className="col-span-1 text-lg">Acciones</div>
              </div>

              {/* Filas de Datos */}
              {plataformas.map((plataforma, i) => (
                <div
                  key={i}
                  className="min-w-[800px] grid grid-cols-9 gap-4 px-6 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <div className="col-span-1 flex justify-center items-center">
                    <button
                      onClick={() => handleDelete(plataforma.id)}
                      className="border-2 border-red-500 text-red-500 hover:bg-red-100 p-1 rounded-full transition duration-300"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Imagen */}
                  <div className="col-span-1 flex justify-center items-center">
                    <div className="relative w-[80px] h-[40px] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                      <Image
                        src={plataforma.image_url}
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        alt={`Plataforma ${plataforma.name}`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Nombre */}
                  <div className="col-span-1 text-center text-sm font-semibold text-gray-800">
                    {plataforma.name}
                  </div>

                  {/* Public Price */}
                  <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                    ${parseFloat(plataforma.public_price).toLocaleString()}
                  </div>

                  {/* Provider Price */}
                  <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                    ${parseFloat(plataforma.provider_price).toLocaleString()}
                  </div>

                  {/* Type */}
                  <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                    {plataforma.type}
                  </div>

                  {/* Credenciales */}
                  <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                    {plataforma.count_avaliable}
                  </div>

                  {/* Productos */}
                  <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                    {plataforma.productos.length}
                  </div>

                  {/* Estado */}
                  <div className="col-span-1 flex justify-center items-center flex-col gap-2">
                    <Button
                      variant="outline"
                      className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] hover:bg-[#FFB422] hover:text-white transition-colors duration-300"
                      onClick={() => handleUpdateClick(plataforma)}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
              <div className="text-center text-xl font-semibold text-gray-700">
                <p>No tenemos plataformas registradas en este momento</p>
                <p className="text-sm text-gray-500">registra plataformas para verlas en esta seccion.</p>
              </div>
            </div>
          )}
        </div>


        {/* Botón para Agregar Plataforma */}
        {/* <div className="flex items-center justify-end p-6">
          <button
            className="p-3 bg-brand rounded-xl text-white text-lg font-semibold uppercase transition ease-in-out hover:scale-105 hover:bg-red-800 duration-300"
            
          >
            + Agregar Plataforma
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PlataformasAdmin;
