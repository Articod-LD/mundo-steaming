import { CloseIcon } from "@/components/icons/close-icon";
import { NoDataFound } from "@/components/icons/no-data-found";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Table } from "@/components/ui/table";
import TitleWithSort from "@/components/ui/title-with-sort";
import { Title } from "@/components/ui/tittleSections";
import { Categorie, MappedPaginatorInfo, Plataforma, SortOrder } from "@/types";
import { useState } from "react";

type IProps = {
  plataformas: Plataforma[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const CategoriasAdmin = ({ categorias }: { categorias: Categorie[] }) => {
  const { openModal } = useModalAction();
  function handleClick() {
    openModal("CREAR_CATEGORIA");
  }

  function handleUpdateClick(categoria: Categorie) {
    openModal("CREAR_CATEGORIA", categoria);
  }

  return (
    <div className="w-full flex justify-start">
      <div className="overflow-hidden rounded shadow bg-white w-full">
        <div className="grid grid-cols-8 grid-rows-1 gap-4 mt-6 text-brand text-center font-bold">
          <div></div>
          <div className="col-span-3">Item</div>
          <div className="col-span-2 col-start-5">Titulo</div>

          <div className="col-span-2 col-start-7">Estado</div>
        </div>
        {categorias.map((categoria, i) => (
          <div key={i} className="grid grid-cols-8 gap-4 text-black my-6">
            <div className="flex justify-center items-center text-brand">
              <div className="border-2 rounded-full border-brand flex justify-center items-center">
                <CloseIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="col-span-3 flex justify-center">
              <Image
                src={categoria.imagen_url}
                width={150}
                height={52}
                quality={100}
                alt="image netflix"
              />
            </div>
            <div className="col-span-2 col-start-5 row-start-1 flex justify-center items-center font-bold">
              {categoria.titulo}
            </div>
            <div className="col-span-2 col-start-7 flex justify-center items-center">
              <Button
                variant="outline"
                className="py-1 px-2 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] flex items-center justify-center w-20"
                onClick={() => handleUpdateClick(categoria)}
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-end p-3">
          <button
            className={
              "p-2 bg-brand rounded-xl mt-4 transition ease-in-out hover:scale-105 hover:bg-red-800 duration-30 uppercase text-white flex"
            }
            onClick={handleClick}
          >
            + Agregar Categoria
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasAdmin;
