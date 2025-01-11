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
import { WhatsappIcon } from "@/components/icons/social/whatsapp";

export default function Layout({
  children,
  subFooter = false,
  showMenu = true,
}: React.PropsWithChildren<{ subFooter?: boolean; showMenu?: boolean }>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  const { lightLogo, darkLogo } = siteSettings;

  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);

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
      <div className="relative">
        <Header
          isCollapse={collapse}
          showHamburger={true}
          onClickHamburger={toggleSidebar}
          showMenu={showMenu}
        />
        <div className="flex flex-1">
          <Sidebar isCollapse={collapse} setcolapse={setCollapse} />
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
                className={
                  plataforma === "COMBO"
                    ? "w-[152px] h-auto"
                    : "w-[152px] h-[70px]"
                }
                src={plataforma === "COMBO" ? darkLogo : lightLogo}
                alt="Logo Mundo Streaming"
              />
              <div className="flex gap-3 mt-6">
                {/* <FacebookIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 " /> */}
                <InstagramIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 " />
                <WhatsappIcon className="w-8 h-8 transition ease-in-out hover:scale-110 duration-300 inline-block" />
              </div>

              <div className="flex flex-col mt-6">
                <p>@combiipremium</p>
                {/* <p>Lorem ipsum dolor sit Lorem ipsum dolor</p> */}
              </div>
              <p className="mt-6">Cel: 3165794854</p>
            </div>
          </section>
        )}
        <a
          href="https://wa.link/y1ugfm"
          target="_blank"
          className="fixed right-3 bottom-20 w-14 h-14 bg-green-700 rounded-full flex justify-center items-center text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 50 50"
          >
            <path
              fill="currentColor"
              d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"
            ></path>
          </svg>
        </a>
        <Footer />
      </div>
    </motion.div>
  );
}
