import AdminsList from "@/components/clients/clientes-lista";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useAdminsQuery, useClientsQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { openModal } = useModalAction();

  const { admins, error, loading, paginatorInfo } = useAdminsQuery({
    limit: 20,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text="Cargando" />;

  function handlePagination(current: any) {
    setPage(current);
  }

  function handleClick() {
    openModal("AGREGAR_PLATAFORMA_CLIENTE",'Administrador');
  }

  return (
    <>
      <Title
        title="Administradores"
        buttonText="Agregar Administrador"
        onClick={handleClick}
      />
      {loading ? null : (
        <AdminsList
          modulo="Administrador"
          admins={admins}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
