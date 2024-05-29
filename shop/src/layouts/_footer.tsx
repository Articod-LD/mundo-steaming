import classNames from "classnames";
import { useState } from "react";

const Footer = () => {
  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);
  return (
    <footer
      className={classNames(
        "bg-brand  flex flex-col justify-between items-center",
        plataforma === "COMBO" ? "text-black" : "text-white"
      )}
    >
      <div className="w-full flex justify-center font-bold py-3">
        {plataforma === "COMBO" ? "CombiPremium" : "Mundo Streaming"} © 2024.
        Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
