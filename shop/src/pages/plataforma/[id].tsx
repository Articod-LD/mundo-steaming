import PlataformasAdmin from "@/components/plataformas/admin/PlataformaListAdmin";
import Loader from "@/components/ui/loader/loader";
import { Title } from "@/components/ui/tittleSections";
import { usePlataformasQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { plataformas, error, loading } = usePlataformasQuery({
    limit: 20,
  });

  if (loading) return <Loader text="Cargando" />;

  return (
    <>
      <Title title="Plataformas" />
      <PlataformasAdmin plataformas={plataformas} />
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
