import LoginForm from "@/components/auth/login-form";
import { MovieIcon } from "@/components/icons/movie";
import BannerBack from "@/components/ui/banner/BannerBack";
import Image from "@/components/ui/image";
import VideoPlayer from "@/components/ui/videoPlayer";
import routes from "@/config/routes";
import { useAboutQuery, useBeneficiosQuery, useMe } from "@/data/user";
import AuthLayout from "@/layouts/_auth_layout";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout } from "@/types";
import Router from "next/router";
import { useState } from "react";

const Login: NextPageWithLayout = () => {
  const { me } = useMe();

  const { beneficios } = useBeneficiosQuery({
    limit: 20,
  });

  const { about, error, loading } = useAboutQuery({
    limit: 20,
  });

  if (loading) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full border-4 border-t-4 border-brand-dark w-16 h-16 border-t-brand"></div>
          <p className="text-xl font-semibold text-gray-200">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
        <p className="text-xl font-semibold text-gray-700">
          Ocurrió un error al cargar las categorías.
        </p>
      </div>
    );
  }

  if (Object.keys(beneficios).length === 0) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
        <div className="text-center text-xl font-semibold text-gray-200">
          <p>No tenemos Beneficios disponibles en este momento</p>
          <p className="text-sm text-gray-500">
            Vuelve más tarde o explora otras secciones.
          </p>
        </div>
      </div>
    );
  }

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
            src={about.image_url}
            layout="fill"
            objectFit="cover"
            quality={100}
            alt="Banner sobre nosotros"
          />
        </div>
        <div className="w-full lg:w-1/2 sm:pl-12 lg:py-28 bg-gradient-to-t from-black via-transparent to-transparent p-8 rounded-lg">
          <h3 className="text-4xl font-bold text-white">SOBRE NOSOTROS</h3>
          <p className="text-base mt-3 text-white">{about.description}</p>
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
          {beneficios.map(({ beneficio }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 text-center"
            >
              <MovieIcon className="text-brand h-16 w-16" />
              <p className="text-sm text-white">{beneficio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video de presentación */}
      <div className="mt-48 mb-14 lg:mt-24 lg:px-20 w-full flex justify-center relative">
        <div className="w-full h-[505px] lg:h-[740px] relative rounded-xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src={about.video_url}
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
