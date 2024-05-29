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

const Login: NextPageWithLayout = () => {
  const { me } = useMe();

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
          <span className="text-base">Lorem ipsum dolor sit</span>
          <h3 className="text-4xl font-bold">SOBRE NOSOTROS</h3>
          <p className="text-base mt-3">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi.
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
          <span className="text-base">Lorem ipsum dolor sit</span>
          <h3 className="text-4xl font-bold">NUESTROS BENEFICIOS</h3>
          <p className="text-base mt-3 sm:mr-32">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex justify-center items-center flex-col">
            <MovieIcon className="text-brand h-20 w-20" />
            <div>
              <h5 className="font-bold text-base">
                LOREM IPSUM DOLOR SIT AMET
              </h5>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <MovieIcon className="text-brand h-20 w-20" />
            <div>
              <h5 className="font-bold text-base">
                LOREM IPSUM DOLOR SIT AMET
              </h5>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <MovieIcon className="text-brand h-20 w-20" />
            <div>
              <h5 className="font-bold text-base">
                LOREM IPSUM DOLOR SIT AMET
              </h5>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <MovieIcon className="text-brand h-20 w-20" />
            <div>
              <h5 className="font-bold text-base">
                LOREM IPSUM DOLOR SIT AMET
              </h5>
            </div>
          </div>
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
