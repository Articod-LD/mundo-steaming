import { useState } from "react";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import { useCategoriesQuery, usePlataformasQuery } from "@/data/user";

export const ListCategorias: React.FC<{}> = () => {
  const [verTodas, setVerTodas] = useState(false);

  const { categories, error, loading } = useCategoriesQuery({
    limit: 20,
  });

  const handleVerTodas = () => {
    setVerTodas(true);
  };

  const categoriasParaMostrar = verTodas ? categories : categories.slice(0, 6);

  return (
    <section>
      <Title title="Categorias" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
        {categoriasParaMostrar.length > 0 ? (
          categoriasParaMostrar.map((data, i) => (
            <div
              key={i}
              className="bg-white h-[300px] rounded-xl overflow-hidden relative"
            >
              <Image
                src={data.imagen_url}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt={data.titulo}
              />
              <div className="absolute uppercase left-0 bottom-4 bg-white px-5 py-3 text-black font-bold text-xl rounded-tr-lg rounded-br-lg">
                {data.titulo}
              </div>
            </div>
          ))
        ) : (
          <h1>No hay categorias registradas</h1>
        )}
      </div>
      {!verTodas && categories.length > 6 && (
        <div className="w-full flex justify-center items-center mt-3">
          <button
            onClick={handleVerTodas}
            className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300 hover:bg-red-900"
          >
            Ver todas
          </button>
        </div>
      )}
    </section>
  );
};
