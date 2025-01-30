import { useConfiguracionQuery } from "@/data/user";
import classNames from "classnames";
import { useState } from "react";

const Footer = () => {
  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);

    const { configuracion, error, loading } = useConfiguracionQuery({
      limit: 20,
    });
  return (
    <footer
      className={classNames(
        "bg-brand  flex flex-col justify-between items-center",
        plataforma === "COMBO" ? "text-black" : "text-white"
      )}
    >
      <div className="w-full flex justify-center font-bold py-3">
        {configuracion.title} © {new Date().getFullYear()}.
        Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
