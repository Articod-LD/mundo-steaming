import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import AdminLayout from "@/layouts/admin";
import { getAuthCredentials } from "@/utils/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const router = useRouter();
  if (userPermissions.includes("customer")) {
    router.push(routes.plataformasClientes);
  }

  return (
    <>
      <Title title="Ventas" />
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
