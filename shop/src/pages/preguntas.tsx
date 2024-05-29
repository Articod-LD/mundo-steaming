import PreguntasList from "@/components/preguntas/preguntas-list";
import SolicitudesList from "@/components/solicitudes/solicitudes-lista";
import Loader from "@/components/ui/loader/loader";
import { Title } from "@/components/ui/tittleSections";
import {
  useClientsQuery,
  usePreguntasQuery,
  useSolicitudesQuery,
} from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Solicitudes({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { solicitudes, error, loading, paginatorInfo } = usePreguntasQuery({
    limit: 20,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

  console.log(solicitudes);

  function handlePagination(current: any) {
    setPage(current);
  }

  if (loading) return <Loader text="Cargando" />;

  return (
    <>
      <Title title="Preguntas" />
      {loading ? null : (
        <PreguntasList
          solicitudes={solicitudes}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}
    </>
  );
}

Solicitudes.authorization = true;

Solicitudes.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
