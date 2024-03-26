import RegistrationForm from "@/components/auth/registration-form";
import AuthLayout from "@/layouts/_auth_layout";
import { NextPageWithLayout } from "@/types";
import { getAuthCredentials } from "@/utils/auth";
import { GetServerSideProps } from "next";

const Registro: NextPageWithLayout = () => {
  return <RegistrationForm />;
};

Registro.getLayout = function getLayout(page) {
  return <AuthLayout showMenu={false}>{page}</AuthLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { permissions } = getAuthCredentials(ctx);

  return {
    props: {
      userPermissions: permissions,
    },
  };
};

export default Registro;
