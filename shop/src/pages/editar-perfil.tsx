import EditarPerfilComponent from "@/components/dashboard/editarPerfilUser";
import { Title } from "@/components/ui/tittleSections";
import AdminLayout from "@/layouts/admin";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  return (
    <>
      <Title title="EDITAR PERFIL" />
      <EditarPerfilComponent />
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
