import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { Table } from "@/components/ui/table";
// import ActionButtons from '@/components/common/action-buttons';
import TitleWithSort from "@/components/ui/title-with-sort";
import {
  ISolicitud,
  MappedPaginatorInfo,
  Plataforma,
  SortOrder,
  User,
} from "@/types";
import { useMe } from "@/data/user";
import { useState } from "react";
import { NoDataFound } from "@/components/icons/no-data-found";
import Avatar from "../common/avatar";
import AnchorLink from "../ui/links/anchor-link";
import routes from "@/config/routes";
import { useModalAction } from "../ui/modal/modal.context";

import { format } from "date-fns";
import Button from "../ui/button";

type IProps = {
  solicitudes: ISolicitud[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const SolicitudesList = ({
  solicitudes,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const { openModal } = useModalAction();

  const columns: any = [
    {
      title: (
        <TitleWithSort
          title="Cliente"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "user",
      key: "name",
      align: "center",
      width: 150,
      render: ({ name }: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <AnchorLink
              href={`${routes.infoUsuario}/`}
              className="text-sm text-black font-bold"
            >
              {name}
            </AnchorLink>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Plataforma"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "tipo",
      key: "name",
      align: "center",
      width: 150,
      render: ({ name }: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <AnchorLink
              href={`${routes.infoUsuario}/`}
              className="text-sm text-black font-bold"
            >
              {name}
            </AnchorLink>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Fecha solicitud"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 150,
      render: (created_at: any) => {
        let fecha_formateada = format(new Date(created_at), "dd/MM/yyyy");
        return (
          <div className="flex items-center text-center w-full">
            <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
              <AnchorLink
                href={`${routes.infoUsuario}/`}
                className="text-sm text-black font-bold"
              >
                {fecha_formateada}
              </AnchorLink>
            </div>
          </div>
        );
      },
    },

    {
      title: (
        <TitleWithSort
          title="Acciones"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "",
      key: "",
      align: "",
      width: 150,
      render: (solicitud: ISolicitud) => (
        <div className="flex gap-4 w-full justify-center">
          <Button
            variant="outline"
            className="py-1 px-2 border-2 border-green-600 rounded-2xl text-green-600 flex items-center justify-center"
            onClick={() => aceptarPlataforma(solicitud)}
          >
            Aceptar
          </Button>

          <Button
            variant="outline"
            className="py-1 px-2 border-2 border-brand rounded-2xl text-brand flex items-center justify-center"
            onClick={() => detelePlataforma(+solicitud.id)}
          >
            Rechazar
          </Button>
        </div>
      ),
    },
  ];

  function detelePlataforma(id: number) {
    openModal("ELIMINAR_SOLICITUD", id);
  }

  function aceptarPlataforma(solicitud: ISolicitud) {
    openModal("ACEPTAR_SOLICITUD", { IsSolicitud: true, solicitud });
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7 -z-10">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                Tabla vacia
              </div>
            </div>
          )}
          data={solicitudes}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default SolicitudesList;
