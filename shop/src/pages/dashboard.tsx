import AdminsList from "@/components/clients/clientes-lista";
import SuscriptionAdmin from "@/components/plataformas/admin/ventasAdmin";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import { useClientsQuery, useSuscriptionQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { getAuthCredentials } from "@/utils/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { openModal } = useModalAction();

  const { suscripcions, error, loading } = useSuscriptionQuery();

  if (loading) return <Loader text="Cargando" />;

  if (
    userPermissions.includes("customer") ||
    userPermissions.includes("provider")
  ) {
    router.push(routes.plataformasClientes);
  }

  function handlePagination(current: any) {
    setPage(current);
  }


  return (
    <>
      <Title title="Dashboard - Ventas" />
      {loading ? null : (
        <SuscriptionAdmin
        suscriptions={suscripcions}
        />
      )}
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { permissions } = getAuthCredentials(ctx);

  return {
    props: {
      userPermissions: permissions,
    },
  };
};
