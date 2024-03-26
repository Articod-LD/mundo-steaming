import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { Table } from "@/components/ui/table";
// import ActionButtons from '@/components/common/action-buttons';
import TitleWithSort from "@/components/ui/title-with-sort";
import { MappedPaginatorInfo, SortOrder, User } from "@/types";
import { useMe } from "@/data/user";
import { useState } from "react";
import { NoDataFound } from "@/components/icons/no-data-found";
import Avatar from "../common/avatar";
import AnchorLink from "../ui/links/anchor-link";
import routes from "@/config/routes";
import { useModalAction } from "../ui/modal/modal.context";

type IProps = {
  admins: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const AdminsList = ({
  admins,
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

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title="Nombre"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "id"
          }
          isActive={sortingObj.column === "id"}
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "",
      key: "name",
      align: "center",
      width: 150,
      onHeaderCell: () => onHeaderClick("id"),
      render: ({ id, name }: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <AnchorLink
              href={`${routes.infoUsuario}/${id}`}
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
          title="Correo"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "id"
          }
          isActive={sortingObj.column === "id"}
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "email",
      key: "email",
      width: 150,
      align: "center",
      onHeaderCell: () => onHeaderClick("id"),
      render: (email: string) => (
        <div className="flex items-center">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <span className="text-[13px] font-normal text-gray-500/80 ">
              {email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Telefono"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "id"
          }
          isActive={sortingObj.column === "id"}
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "telefono",
      key: "telefono",
      width: 150,
      align: "center",
      onHeaderCell: () => onHeaderClick("id"),
      render: (telefono: string) => (
        <div className="flex items-center">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <span className="text-[13px] font-normal text-gray-500/80 ">
              {telefono}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Domicilio"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "id"
          }
          isActive={sortingObj.column === "id"}
          className="text-brand text-xl font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "direccion",
      key: "direccion",
      align: "center",
      width: 150,
      onHeaderCell: () => onHeaderClick("id"),
      render: (direccion: string) => (
        <div className="flex items-center">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <span className="text-[13px] font-normal text-gray-500/80 ">
              {direccion}
            </span>
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
          data={admins}
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

export default AdminsList;
