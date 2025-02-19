import React, { useState } from "react";
import Image from "../ui/image";
import { EyeIcon } from "../icons/category/eyes-icon";
import { EyeOff } from "../icons/eye-off-icon";
import { Credencial, Product } from "@/types";
import { useMe } from "@/data/user";

function VerInfoPlataforma({ producto }: { producto: Product }) {
  const [verPass, setVerPass] = useState(false);
  const [verPass2, setVerPass2] = useState(false);
  const { me } = useMe()


  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black shadow-lg">
      <h3 className="text-brand text-2xl font-bold uppercase mb-6 text-center">
        Información Plataforma {producto.plataforma.name}
      </h3>

      <div className="w-full flex justify-center mb-6">
        <Image
          src={producto.plataforma.image_url}
          width={400}
          height={52}
          quality={100}
          alt="img banner"
          className="rounded-lg"
        />
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Credenciales */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-3">
            <h5 className="text-gray-500 text-sm font-semibold uppercase">Usuario</h5>
            <p className="font-bold text-center truncate" title={producto.credencial.email}>
              {producto.credencial.email}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h5 className="text-gray-500 text-sm font-semibold uppercase">Contraseña</h5>
            <div className="flex items-center justify-center gap-3">
              <p className="font-bold text-center truncate" title={producto.credencial.password}>
                {verPass ? producto.credencial.password : "*".repeat(producto.credencial.password.length)}
              </p>
              <button
                onClick={() => setVerPass(!verPass)}
                className="text-gray-500 hover:text-brand focus:outline-none"
              >
                {!verPass ? (
                  <EyeIcon className="w-6 h-6" />
                ) : (
                  <EyeOff className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {producto.plataforma.type === "pantalla" && (
            <>
              <div className="mt-4 flex gap-3 items-center">
                <h5 className="text-gray-500 text-sm font-semibold uppercase">Nombre Perfil</h5>
                <p className="font-bold text-center truncate" title={producto.profile_name}>
                  {producto.profile_name || "No disponible"}
                </p>
              </div>

              <div className="mt-4 flex gap-3 items-center">
                <h5 className="text-gray-500 text-sm font-semibold uppercase">PIN Pantalla</h5>
                <p className="font-bold text-center truncate flex gap-3" title={producto.profile_pin}>
                  <p className="font-bold text-center truncate" title={producto.credencial.password}>
                    {verPass2 ? producto.profile_pin : "*".repeat(producto.profile_pin ? producto.profile_pin.length : 0)}
                  </p>
                  <button
                    onClick={() => setVerPass2(!verPass2)}
                    className="text-gray-500 hover:text-brand focus:outline-none"
                  >
                    {!verPass2 ? (
                      <EyeIcon className="w-6 h-6" />
                    ) : (
                      <EyeOff className="w-6 h-6" />
                    )}
                  </button>
                </p>
              </div>
            </>


          )}
        </div>

        {/* Tipo Pantalla */}

      </div>
    </div>

  );
}

export default VerInfoPlataforma;
