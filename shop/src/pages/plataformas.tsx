import PlataformasAdmin from "@/components/plataformas/admin/PlataformaListAdmin";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useClientsQuery, usePlataformasQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { plataformas, error, loading } = usePlataformasQuery({
    limit: 20,
  });

  const { openModal } = useModalAction();
  function handleClick() {
    openModal("CREAR_PLATAFORMA");
  }

  if (loading) return <Loader text="Cargando" />;

  return (
    <>
      <Title title="Plataformas" buttonText="Agregar Plataforma" onClick={handleClick}/>
      <PlataformasAdmin plataformas={plataformas} />
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
