import Image from "@/components/ui/image";
import Layout from "./_layout";
import { siteSettings } from "@/data/static/site-settings";
import { useState } from "react";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";

export default function AuthLayout({
  children,
  showMenu = true,
}: React.PropsWithChildren<{ subFooter?: boolean; showMenu?: boolean }>) {
  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);
  const { lightLogo, darkLogo } = siteSettings;
  return (
    <Layout showMenu={showMenu}>
      <div className="w-full h-full flex justify-center items-center p-5">
        <div className="w-full min-w-96 sm:w-1/3 h-auto">
          <div className="w-full flex flex-col items-center">
            <Image
              className="w-[200px] h-auto"
              src={plataforma === "COMBO" ? darkLogo : lightLogo}
              alt="Logo Mundo Streaming"
            />

            <div className="w-full mb-5">
              <AnchorLink
                className="text-3xl text-brand line underline transform scale-150 "
                href={routes.home}
              >
                Ir al inicio
              </AnchorLink>
            </div>
          </div>
          {children}
        </div>
      </div>
    </Layout>
  );
}
