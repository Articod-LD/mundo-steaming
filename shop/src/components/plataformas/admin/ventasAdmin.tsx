import { CloseIcon } from "@/components/icons/close-icon";
import { NoDataFound } from "@/components/icons/no-data-found";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Table } from "@/components/ui/table";
import TitleWithSort from "@/components/ui/title-with-sort";
import {
  useDeleteClientMutation,
  useDeletePlataformaMutation,
} from "@/data/user";
import {
  ISuscrption,
  MappedPaginatorInfo,
  Plataforma,
  SortOrder,
} from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

type IProps = {
  plataformas: Plataforma[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const SuscriptionAdmin = ({
  suscriptions,
}: {
  suscriptions: ISuscrption[];
}) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {suscriptions.length > 0 ? (
            <>
              {/* Encabezados de la Tabla */}
              <div className="min-w-[800px] grid grid-cols-10 gap-4 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
                <div className="col-span-1 text-lg">id</div>
                <div className="col-span-1 text-lg">Orden</div>
                <div className="col-span-1 text-lg">Fecha Inicio</div>
                <div className="col-span-1 text-lg">Fecha Fin</div>
                <div className="col-span-1 text-lg">Precio</div>
                <div className="col-span-1 text-lg">Usuario</div>
                <div className="col-span-1 text-lg">Plataforma</div>
                <div className="col-span-1 text-lg">Estado</div>
                <div className="col-span-1 text-lg">Dias</div>
                <div className="col-span-1 text-lg">Credencial</div>
              </div>

              {/* Filas de Datos */}
              {suscriptions.map((suscripcion) =>
                suscripcion.productos.map((prod) => (
                  <div
                    key={suscripcion.id}
                    className="min-w-[800px] grid grid-cols-10 gap-4 px-6 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <div className="col-span-1 text-center text-sm font-semibold text-gray-800">
                      {suscripcion.id}
                    </div>
                    <div className="col-span-1 text-center text-sm font-semibold text-gray-800">
                      #{suscripcion.order_code}
                    </div>
                    <div className="col-span-1 text-center text-sm  text-gray-800">
                      {suscripcion.start_date}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-800">
                      {suscripcion.end_date}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-800">
                      {suscripcion.price}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-800">
                      {suscripcion.user.name}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-800">
                      {prod.plataforma.name}
                    </div>
                    <div className="col-span-1 text-center text-sm  text-gray-800">
                      {prod.status}
                    </div>
                    <div className="col-span-1 text-center text-sm  text-gray-800">
                      {prod.months}
                    </div>
                    <div className="col-span-1 text-center text-sm  text-gray-800">
                      {prod.credencial.email}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
              <div className="text-center text-xl font-semibold text-gray-700">
                <p>No tenemos Ventas registradas en este momento</p>
                <p className="text-sm text-gray-500">
                  registra ventas para verlas en esta seccion.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuscriptionAdmin;
