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
    "Variedad de plataformas de streaming.",
    "Acceso a contenido en cualquier momento y lugar.",
    "Pantallas personalizadas.",
    "Precios razonables.",
    "Contenido original exclusivo.",
    "Atención al cliente 7 días a la semana.",
    "Garantía durante todo el tiempo contratado.",
  ]);

  return (
    <div className="w-full">
      {/* Banner de sección */}
      <BannerBack
        title="SOBRE NOSOTROS"
        isBack={true}
        textBack="SOBRE NOSOTROS"
        img="/sobreNosotrospng.png"
      />

      {/* Sección sobre nosotros con imagen */}
      <div className="mt-24 px-5 lg:px-20 w-full flex flex-col lg:flex-row">
        <div className="w-full md:w-1/2 h-[500px] relative">
          <Image
            src={`/contacto/banner.png`}
            layout="fill"
            objectFit="cover"
            quality={100}
            alt="Banner sobre nosotros"
          />
        </div>
        <div className="w-full lg:w-1/2 sm:pl-12 lg:py-28 bg-gradient-to-t from-black via-transparent to-transparent p-8 rounded-lg">
          <h3 className="text-4xl font-bold text-white">SOBRE NOSOTROS</h3>
          <p className="text-base mt-3 text-white">
            COMBIPREMIUM es una tienda online de plataformas de streaming, con más de 5 años de trayectoria, ofreciendo una experiencia de entretenimiento sin igual. Con más de 200 proveedores, garantizamos una selección incomparable de contenido para todos los gustos.
          </p>
          {me ? (
            <button
              className="p-3 bg-brand text-white rounded mt-4 uppercase transition ease-in-out hover:bg-red-900"
              onClick={() => Router.push(routes.dashboard)}
            >
              Suscribirme
            </button>
          ) : (
            <button
              className="p-3 bg-brand text-white rounded mt-4 uppercase transition ease-in-out hover:bg-red-900"
              onClick={() => Router.push(routes.login)}
            >
              Suscribirme
            </button>
          )}
        </div>
      </div>

      {/* Sección de beneficios */}
      <div className="mt-24 px-5 lg:px-20 w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3">
          <h3 className="text-4xl font-bold text-brand">NUESTROS BENEFICIOS</h3>
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
          {Beneficios.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <MovieIcon className="text-brand h-16 w-16" />
              <p className="text-sm text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video de presentación */}
      <div className="mt-48 lg:mt-24 lg:px-20 w-full flex justify-center relative">
        <div className="w-full h-[505px] lg:h-[640px] relative rounded-xl overflow-hidden shadow-lg">
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
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return <Layout subFooter={true}>{page}</Layout>;
};

export default Login;
