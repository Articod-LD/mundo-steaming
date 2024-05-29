import { useState } from "react";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";

const categorias = [1, 2, 3, 4, 5, 6, 7, 8];

export const ListCategorias: React.FC<{}> = () => {
  const [verTodas, setVerTodas] = useState(false);

  const handleVerTodas = () => {
    setVerTodas(true);
  };

  const categoriasParaMostrar = verTodas ? categorias : categorias.slice(0, 4);

  return (
    <section>
      <Title title="Categorias" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
        {categoriasParaMostrar.map((i) => (
          <div
            key={i}
            className="bg-white h-[300px] rounded-xl overflow-hidden relative"
          >
            <Image
              src="/categorias/cat-entretenimiento.png"
              layout="fill"
              objectFit="cover"
              quality={100}
              alt="img banner"
            />
            <div className="absolute uppercase left-0 bottom-4 bg-white px-5 py-3 text-black font-bold text-xl rounded-tr-lg rounded-br-lg">
              entretenimiento
            </div>
          </div>
        ))}
      </div>
      {!verTodas && (
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
