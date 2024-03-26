import Image from "@/components/ui/image";
import Layout from "./_layout";
import { siteSettings } from "@/data/static/site-settings";

export default function AuthLayout({
  children,
  showMenu = true,
}: React.PropsWithChildren<{ subFooter?: boolean; showMenu?: boolean }>) {
  const { lightLogo } = siteSettings;
  return (
    <Layout showMenu={showMenu}>
      <div className="w-full h-full flex justify-center items-center p-5">
        <div className="w-full min-w-96 sm:w-1/3 h-auto">
          <div className="w-full flex justify-center items-center mb-10">
            <Image
              className="w-[200px] h-auto"
              src={lightLogo}
              alt="Logo Mundo Streaming"
            />
          </div>
          {children}
        </div>
      </div>
    </Layout>
  );
}
