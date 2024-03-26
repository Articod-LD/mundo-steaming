import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "./_header";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import classNames from "classnames";
import { Sidebar } from "./_layout-sidebar";
import { useBreakpoint } from "@/lib/hooks/use-breackpoints";
import HeroCarousel from "@/components/banner/banner-carousel";
import Image from "@/components/ui/image";
import { siteSettings } from "@/data/static/site-settings";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social";
import { LinkedlnIcon } from "@/components/icons/social/linkedln";
import Footer from "./_footer";

export default function Layout({
  children,
  subFooter = false,
  showMenu = true,
}: React.PropsWithChildren<{ subFooter?: boolean; showMenu?: boolean }>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  const { lightLogo } = siteSettings;
  let [collapse, setCollapse] = useState(false);
  function toggleSidebar() {
    setCollapse((prev) => !prev);
  }

  useEffect(() => {
    if (breakpoint == "xs") {
      setCollapse(false);
    }
  }, [breakpoint]);

  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="flex min-h-screen w-full flex-col"
    >
      <>
        <Header
          isCollapse={collapse}
          showHamburger={true}
          onClickHamburger={toggleSidebar}
          showMenu={showMenu}
        />
        <div className="flex flex-1">
          <Sidebar isCollapse={collapse} />
          <main
            className={classNames(
              "flex w-full flex-col",
              collapse
                ? "sm:pl-60  xl:pl-[75px] sm:pr-60  xl:pr-[75px] pl-1 pr-1"
                : "sm:pl-[75px]  xl:pl-20 sm:pr-[75px]  xl:pr-20 pl-2 pr-2"
            )}
          >
            {children}
          </main>
        </div>

        {subFooter && (
          <section className="bg-black text-white flex flex-col">
            <div className="flex flex-col justify-center items-center py-12">
              <Image
                className="w-[152px] h-[70px]"
                src={lightLogo}
                alt="Logo Mundo Streaming"
              />
              <div className="flex gap-3 mt-6">
                <FacebookIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 " />
                <InstagramIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 " />
                <LinkedlnIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 inline-block" />
              </div>

              <div className="flex flex-col mt-6">
                <p>Lorem ipsum dolor sit Lorem ipsum dolor</p>
                <p>Lorem ipsum dolor sit Lorem ipsum dolor</p>
              </div>
              <p className="mt-6">Lorem ipsum dolor sit</p>
            </div>
          </section>
        )}
        <Footer />
      </>
    </motion.div>
  );
}
