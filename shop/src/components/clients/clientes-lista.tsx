import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { Table } from "@/components/ui/table";
// import ActionButtons from '@/components/common/action-buttons';
import TitleWithSort from "@/components/ui/title-with-sort";
import { MappedPaginatorInfo, SortOrder, User } from "@/types";
import { useAdminClientMutation, useAdminProvedorMutation, useDeleteCategoriaMutation, useDeleteClientMutation, useMe } from "@/data/user";
import { useState } from "react";
import { NoDataFound } from "@/components/icons/no-data-found";
import Avatar from "../common/avatar";
import AnchorLink from "../ui/links/anchor-link";
import routes from "@/config/routes";
import { useModalAction } from "../ui/modal/modal.context";
import classNames from "classnames";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from "react-hot-toast";
import Button from "../ui/button";

const MySwal = withReactContent(Swal)

type IProps = {
  admins: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  modulo: string;
};

const AdminsList = ({
  admins,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  modulo
}: IProps) => {
  const { openModal } = useModalAction();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });



  const { mutate: deleteClientMutation } = useDeleteClientMutation()
  const { mutate: deleteaAdminMutation } = useAdminClientMutation()
  const { mutate: deleteProveedorMutation } = useAdminProvedorMutation()

  const { me } = useMe()

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: `Eliminar un ${modulo}`,
      text: `Vas a eliminar un ${modulo} estas seguro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        if (modulo === 'Cliente') {
          deleteClientMutation({ clientId: id }, {
            onSuccess(data, variables, context) {
              MySwal.fire({
                title: "Deleted!",
                icon: "success"
              });
            }, onError(error, variables, context) {
              toast.error('ha ocurrido un error')
              console.error(error);
            },
          })
        }
        if (modulo === 'Administrador') {
          if (me?.id === id) {
            toast.error('No puedes eliminar tu propia cuenta.');
            return
          }

          deleteaAdminMutation({ adminId: id }, {
            onSuccess(data, variables, context) {
              MySwal.fire({
                title: "Deleted!",
                icon: "success"
              });
            }, onError(error, variables, context) {
              toast.error('ha ocurrido un error')
              console.error(error);
            },
          })
        }

        if (modulo === 'Distribuidor') {
          deleteProveedorMutation({ providerId: id }, {
            onSuccess(data, variables, context) {
              MySwal.fire({
                title: "Deleted!",
                icon: "success"
              });
            }, onError(error, variables, context) {
              toast.error('ha ocurrido un error')
              console.error(error);
            },
          })
        }

      }
    });
  }

  const handleEdit = (item: User) => {
    openModal("EDITAR_USUARIO", { type: modulo, user: item });
  }

  const columns = [
    {
      title: (
        <TitleWithSort
          title="Nombre"
          className="text-brand text-lg font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "",
      key: "name",
      align: "center" as "center",  // Ajuste aquí: 'center' como valor válido de AlignType
      width: 200,
      render: ({ id, name }: any) => (
        <div className="flex items-center text-center w-full">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            {
              modulo === 'Cliente' ? (
                <AnchorLink
                  href={`${routes.infoUsuario}/${id}`}
                  className="text-lg text-black font-bold hover:text-brand transition duration-300"
                >
                  {name}
                </AnchorLink>
              ) :
                (
                  <span className="text-lg text-black font-bold">{name}</span>
                )
            }

          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Correo"
          className="text-brand text-lg font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "email",
      key: "email",
      align: "center" as "center", // Ajuste aquí también
      width: 200,
      render: (email: string) => (
        <div className="flex items-center">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <span className="text-[13px] font-normal text-gray-500/80 ">{email}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Telefono"
          className="text-brand text-lg font-bold"
        />
      ),
      className: "cursor-pointer",
      dataIndex: "phone",
      key: "phone",
      align: "center" as "center", // Ajuste aquí también
      width: 200,
      render: (phone: string) => (
        <div className="flex items-center">
          <div className="flex flex-col whitespace-nowrap font-medium ms-2 justify-center 0 w-full">
            <span className="text-[13px] font-normal text-gray-500/80 ">
              <span className="text-sm text-gray-500">{phone || "No disponible"}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Acciones"
          className="text-brand text-lg font-bold"
        />
      ),
      key: "actions",
      align: "center" as "center", // Alineación centrada para las acciones
      width: 200, // Establecer un ancho fijo para las acciones
      render: (user: User) => (
        <div className="flex justify-center space-x-2">

          <Button
            variant="outline"
            className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-brand hover:bg-brand hover:text-white transition-colors duration-300"
            onClick={() => handleEdit(user)}
          >
            Editar
          </Button>

          {/* Botón de Eliminar */}
          <Button
            variant="outline"
            className="py-2 px-4 border-2 border-red-500 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
            onClick={() => handleDelete(user.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded-lg shadow-lg bg-white">
        {admins && admins.length > 0 ? (
          // Si hay datos, renderizamos la tabla
          <Table
            columns={columns}
            data={admins}
            rowKey="id"
            scroll={{ x: 1000 }}
          />
        ) : (
          // Si no hay datos, mostramos el mensaje y ocultamos los encabezados
          <div className="flex flex-col items-center justify-center py-10 -z-10 text-center">
            {/* Ícono de "NoDataFound" */}
            <NoDataFound className="w-40 mb-4 text-gray-500" />

            {/* Mensaje mejorado de "Tabla vacía" */}
            <div className="text-lg font-semibold text-gray-700 mb-2">
              No hay datos disponibles
            </div>
            <p className="text-sm text-gray-500">
              Aún no has agregado elementos a esta tabla. <br />
              Puedes intentar cargar o agregar datos para comenzar.
            </p>
          </div>
        )}
      </div>

      {!!paginatorInfo?.total && admins && admins.length > 0 && (
        <div className="flex items-center justify-end mt-4">
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
