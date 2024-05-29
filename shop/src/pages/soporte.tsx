import LoginForm from "@/components/auth/login-form";
import { FacebookIcon } from "@/components/icons/social";
import BannerBack from "@/components/ui/banner/BannerBack";
import { useLogin, useSoporte } from "@/data/user";
import AuthLayout from "@/layouts/_auth_layout";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
type Inputs = {
  name: string;
  email: string;
  telefono: string;
  pregunta: string;
  isAcepted: any;
};

const Login: NextPageWithLayout = () => {
  const { mutate, isLoading, error } = useSoporte();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data, {
      onSuccess: (succes) => {
        console.log("salio bien", succes);
      },
      onError: () => {
        toast.error("ha ocurrido un error");
      },
    });

    reset({
      email: "",
      isAcepted: false,
      name: "",
      pregunta: "",
      telefono: "",
    });
  };

  return (
    <div className="w-full">
      <BannerBack
        title="SOPORTE"
        isBack={true}
        textBack="SOPORTE"
        img="/contacto.png"
      />
      <div className="mt-24 px-5 lg:px-28 w-full flex h-auto lg:flex-row flex-col">
        <div className="w-full lg:w-1/2 h-full lg:pr-56">
          <span className="text-base">CONTÁCTENOS</span>
          <h3 className="text-4xl font-bold">
            ¿TIENES PREGUNTAS? ¡PONTE EN CONTACTO!
          </h3>
          <p className="text-base mt-3">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <FacebookIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 text-brand" />
            <p>info@info.com.co</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <FacebookIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 text-brand" />
            <p>+57 300 300 9090</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-full pb-10">
          <div className="w-full">
            <form
              className="border border-black shadow-md rounded-xl px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-4">
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="full-name"
                >
                  Nombre Completo
                </label>
                <input
                  className="appearance-none border-2 border-white bg-transparent w-full text-white py-2 px-3 leading-tight focus:outline-none focus:border-brand"
                  type="text"
                  placeholder="Nombre Completo"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p role="alert" className="text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4 flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-2">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="appearance-none border-2 border-white bg-transparent w-full text-white py-2 px-3 leading-tight focus:outline-none focus:border-brand"
                    type="email"
                    placeholder="Correo Electrónico"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p role="alert" className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2 md:pl-2">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    className="appearance-none border-2 border-white bg-transparent w-full text-white py-2 px-3 leading-tight focus:outline-none focus:border-brand"
                    placeholder="Teléfono"
                    {...register("telefono", { required: true })}
                  />
                  {errors.telefono && (
                    <p role="alert" className="text-sm text-red-600">
                      {errors.telefono.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  ¿Cómo podemos ayudarte?
                </label>
                <textarea
                  className="appearance-none border-2 border-white bg-transparent w-full text-white py-2 px-3 leading-tight focus:outline-none focus:border-brand"
                  id="message"
                  placeholder="Cuéntanos cómo podemos ayudarte"
                  {...register("pregunta", { required: true })}
                ></textarea>
                {errors.pregunta && (
                  <p role="alert" className="text-sm text-red-600">
                    {errors.pregunta.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    className="mr-2 leading-tight"
                    type="checkbox"
                    {...register("isAcepted", { required: true })}
                  />
                  <span className="text-white text-sm">
                    Estoy de acuerdo con los términos y condiciones
                  </span>
                </label>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-brand  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Ponerse en Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return <Layout subFooter={true}>{page}</Layout>;
};

export default Login;
