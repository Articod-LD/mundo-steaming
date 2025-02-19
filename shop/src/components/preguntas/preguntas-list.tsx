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
  solicitudes: any[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PreguntasList = ({
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
          title="Nombre"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 150,
      render: (name: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            {name}
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Correo"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "email",
      key: "email",
      align: "center",
      width: 150,
      render: (email: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            {email}
          </div>
        </div>
      ),
    },

    {
      title: (
        <TitleWithSort
          title="Telefono"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "telefono",
      key: "telefono",
      align: "center",
      width: 150,
      render: (telefono: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            {telefono}
          </div>
        </div>
      ),
    },

    {
      title: (
        <TitleWithSort
          title="Pregunta"
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "pregunta",
      key: "pregunta",
      align: "center",
      width: 150,
      render: (pregunta: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            {pregunta}
          </div>
        </div>
      ),
    },
  ];

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

export default PreguntasList;
