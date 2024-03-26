import React, { useState } from "react";
import Image from "../ui/image";
import { EyeIcon } from "../icons/category/eyes-icon";
import { EyeOff } from "../icons/eye-off-icon";

function VerInfoPlataforma({ data }: any) {
  const [verPass, setVerPass] = useState(false);

  return (
    <div className="relative w-80 sm:w-[512px] xl:w-[710px] bg-white rounded-lg py-6 px-8 text-black">
      <h3 className="text-brand text-2xl font-bold uppercase mb-5">
        Informacion Plataforma {data.tipo.name}
      </h3>
      <div className="w-full flex justify-center">
        <Image
          src={data.tipo.image_url}
          width={400}
          height={52}
          quality={100}
          alt="img banner"
        />
      </div>

      <div className="w-full flex justify-center">
        <div className="mt-5 w-1/2 flex flex-col items-center">
          <div className="flex flex-col text-center">
            <h5>Usuario</h5>
            <p className="font-bold">{data.email}</p>
          </div>
          <div className="flex flex-col text-center w-full items-center">
            <h5>Contraseña</h5>
            <div className="w-1/2 flex justify-around ">
              <p className="font-bold">
                {verPass ? data.password : "*".repeat(data.password.length)}
              </p>
              <button onClick={() => setVerPass(!verPass)}>
                {!verPass ? (
                  <EyeIcon className="w-7" />
                ) : (
                  <EyeOff className="w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerInfoPlataforma;
