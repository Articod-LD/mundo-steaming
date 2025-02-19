import { useState } from "react";
import { MovieIcon } from "../icons/movie";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import { useBeneficiosQuery, useCategoriesQuery } from "@/data/user";

export const ListBeneficios: React.FC<{}> = () => {
  const { beneficios, error, loading } = useBeneficiosQuery({
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

  return (
    <section>
      <Title title="NUESTROS BENEFICIOS" />

      <div className="w-full min-h-96 h-auto bg-cover bg-no-repeat mt-4 flex justify-start sm:justify-end items-center sm:px-28 rounded-lg relative pt-[445px] pb-14  sm:py-14 px-5 sm:text-left">
        <Image
          className="-z-10"
          src="/beneficios.png"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="img banner"
        />
        <div className="w-[400px]">
          {beneficios.length > 0 ? (
            <ul className="flex flex-col">
              {beneficios.map(({ beneficio }, i) => (
                <li
                  key={i}
                  className="flex gap-4 justify-start items-center my-2 h-max"
                >
                  <MovieIcon className="text-brand flex-shrink-0 h-12 w-12" />
                  <div>
                    <p className="font-normal text-sm">{beneficio}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
              <div className="text-center text-xl font-semibold text-gray-200">
                <p>No tenemos Beneficios disponibles en este momento</p>
                <p className="text-sm text-gray-500">
                  Vuelve más tarde o explora otras secciones.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
