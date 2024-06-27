import LoginForm from "@/components/auth/login-form";
import { MovieIcon } from "@/components/icons/movie";
import BannerBack from "@/components/ui/banner/BannerBack";
import Image from "@/components/ui/image";
import VideoPlayer from "@/components/ui/videoPlayer";
import routes from "@/config/routes";
import { useMe } from "@/data/user";
import AuthLayout from "@/layouts/_auth_layout";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout } from "@/types";
import Router from "next/router";
import { useState } from "react";

const Login: NextPageWithLayout = () => {
  const { me } = useMe();

  const [Beneficios, setBeneficios] = useState([
    "Ofrecemos variedad de plataformas de streaming.",
    "Los usuarios pueden acceder al contenido en cualquier momento y en cualquier lugar, siempre que tengan un conexión a Internet.",
    "Nuestras pantallas son personalizadas.",
    "Nuestros precios son razonables.",
    "Ofrecemos contenido original lo que proporciona a los usuarios tengan acceso a programas y películas que no pueden encontrar en ningún otro lugar.",
    "Atención al cliente los 7 días de la semana.",
    "Garantía durante todo el tiempo contratado.",
  ]);

  return (
    <div className="w-full">
      <BannerBack
        title="SOBRE NOSOTROS"
        isBack={true}
        textBack="SOBRE NOSOTROS"
        img="/sobreNosotrospng.png"
      />

      <div className="mt-24 px-5 lg:px-20 w-full flex h-[560px] flex-col lg:flex-row">
        <div className="w-full sm:w-1/2 h-full relative">
          <Image
            src={`/contacto/banner.png`}
            layout="fill"
            objectFit="cover"
            quality={100}
            alt="img banner"
          />
        </div>
        <div className="w-full lg:w-1/2 sm:pl-12 lg:py-28">
          {/* <span className="text-base">Lorem ipsum dolor sit</span> */}
          <h3 className="text-4xl font-bold">SOBRE NOSOTROS</h3>
          <p className="text-base mt-3 ">
            MUNDO STREAMING JM es una tienda online de plataformas de streaming.
            Con una trayectoria de más de 5 años, nos enorgullecemos de ofrecer
            a nuestros más de 7 mil clientes una experiencia de entretenimiento
            sin igual. Como pioneros en la industria, hemos establecido
            asociaciones con más de 200 proveedores líderes en el mercado,
            garantizando así una selección incomparable de contenido para todos
            los gustos y preferencias. Tenemos todo lo que necesitas para llevar
            tu experiencia de entretenimiento al siguiente nivel.
          </p>
          {me ? (
            <button
              className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300  hover:bg-red-900"
              onClick={() => Router.push(routes.dashboard)}
            >
              Suscribirme
            </button>
          ) : (
            <button
              className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300  hover:bg-red-900"
              onClick={() => Router.push(routes.login)}
            >
              Suscribirme
            </button>
          )}
        </div>
      </div>

      <div className="mt-24 px-5 lg:px-20 w-full flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-1/3">
          {/* <span className="text-base">Lorem ipsum dolor sit</span> */}
          <h3 className="text-4xl font-bold">NUESTROS BENEFICIOS</h3>
          {/* <p className="text-base mt-3 sm:mr-32">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p> */}
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Beneficios.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 h-full">
              <MovieIcon className="text-brand h-16 w-16" />
              <div className="flex-grow flex items-center">
                <h5 className="text-sm text-center">{item}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-48 lg:mt-24 lg:px-20 w-full flex h-[505px] relative">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/73_1biulkYk?si=gyIurToe91pnELpB"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </div>
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return <Layout subFooter={true}>{page}</Layout>;
};

export default Login;
