import { useState } from "react";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import { useCategoriesQuery } from "@/data/user";

export const ListCategorias: React.FC<{}> = () => {
  const [verTodas, setVerTodas] = useState(false);

  const { categories, error, loading } = useCategoriesQuery({
    limit: 20,
  });

  const handleVerTodas = () => {
    setVerTodas(true);
  };

  const categoriasParaMostrar = verTodas ? categories : categories.slice(0, 6);

  if (loading) {
    return <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full border-4 border-t-4 border-brand-dark w-16 h-16 border-t-brand"></div>
        <p className="text-xl font-semibold text-gray-200">Cargando...</p>
      </div>
    </div>
  }


  if (error) {
    return <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
      <p className="text-xl font-semibold text-gray-700">Ocurrió un error al cargar las categorías.</p>
    </div>
  }
  return (
    <section>
      <Title title="Categorias" />

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
          {categoriasParaMostrar.map((data, i) => (
            // transition duration-300 ease-in-out transform hover:scale-105
            <div
              key={i}
              className="bg-black h-[300px] rounded-xl overflow-hidden relative shadow-lg"
            >
              <Image
                src={data.imagen_url}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt={data.titulo}
              />
              <div className="absolute bottom-4 left-0 bg-white px-5 py-3 text-black font-bold text-xl rounded-tr-lg rounded-br-lg shadow-lg opacity-80">
                {data.titulo}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
          <div className="text-center text-xl font-semibold text-gray-200">
            <p>No tenemos categorias disponibles en este momento</p>
            <p className="text-sm text-gray-500">Vuelve más tarde o explora otras secciones.</p>
          </div>
        </div>
      )}

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
