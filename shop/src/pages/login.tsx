import LoginForm from "@/components/auth/login-form";
import AuthLayout from "@/layouts/_auth_layout";
import { NextPageWithLayout } from "@/types";

const Login: NextPageWithLayout = () => {
  return <LoginForm />;
};

Login.getLayout = function getLayout(page) {
  return <AuthLayout showMenu={false}>{page}</AuthLayout>;
};

export default Login;
