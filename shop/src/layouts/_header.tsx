import Hamburger from "@/components/ui/hamburger";
import Logo from "@/components/ui/logo";
import { useLogoutMutation, useMe } from "@/data/user";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { useRouter } from "next/router";
import { Menu } from "@/components/ui/dropdown";
import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import routes from "@/config/routes";
import ActiveLink from "@/components/ui/links/active-link";
import Button from "@/components/ui/button";
import AnchorLink from "@/components/ui/links/anchor-link";
import classNames from "classnames";

interface HeaderProps {
  isCollapse?: boolean;
  showHamburger?: boolean;
  onClickHamburger?: () => void;
  showMenu?: boolean;
}

const MenuItems = [
  {
    label: "Home",
    path: routes.home,
  },
  {
    label: "Sobre nosotros",
    path: routes.sobre_nosotros,
  },
  {
    label: "soporte",
    path: routes.soporte,
  },
];

function GeneralMenu() {
  return MenuItems.map((item) => (
    <ActiveLink
      key={item.label}
      href={item.path}
      className="uppercase transition ease-in-out hover:scale-105 duration-300"
      activeClassName="text-brand"
    >
      {item.label}
    </ActiveLink>
  ));
}

function MenuRender() {
  const { isAuthorized } = useMe();
  const { mutate: logout } = useLogoutMutation();

  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-light-300 dark:bg-dark-500" />
    );
  }
  return (
    <div className="gap-5 hidden sm:flex">
      <GeneralMenu />
      {isAuthorized ? (
        <Button
          type="button"
          variant="text"
          className="transition-fill-colors uppercase transition ease-in-out hover:scale-105 duration-300"
          onClick={() => logout()}
        >
          CERRAR SESIÓN
        </Button>
      ) : (
        <AnchorLink
          href={routes.login}
          className="transition-fill-colors uppercase transition ease-in-out hover:scale-105 duration-300 border-b-2 border-brand"
        >
          Login
        </AnchorLink>
      )}
    </div>
  );
}

export default function Header({
  showHamburger,
  isCollapse,
  onClickHamburger,
  showMenu,
}: HeaderProps) {
  const { me } = useMe();
  const isLogin = typeof me !== "undefined";

  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);
  console.log(isLogin);

  return (
    <header
      className={classNames(
        "app-header sticky top-0 z-30 flex w-full items-center justify-between border-b border-light-300 bg-light py-1 px-4 left-0 dark:border-dark-300 dark:bg-dark sm:px-20 ",
        plataforma === "COMBO" ? "h-24 sm:h-[100px]" : "h-16 sm:h-[80px]"
      )}
    >
      <div className="flex items-center gap-4">
        <Logo />
      </div>
      <div className="relative flex items-center gap-5 xs:gap-6 sm:gap-5">
        {showMenu && <MenuRender />}
        {showHamburger && (
          <AnchorLink
            href={routes.dashboard}
            className={classNames(
              "focus:ring-accent-700 h-9 shrink-0 items-center justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-red-900 focus:shadow focus:outline-none focus:ring-1 uppercase hover:scale-105",
              isLogin ? "hidden lg:flex" : "hidden"
            )}
          >
            Dashboard
          </AnchorLink>
        )}
      </div>
      {showHamburger && showMenu && (
        <div className="flex gap-3 sm:hidden">
          <AnchorLink
            href={routes.dashboard}
            className={classNames(
              "focus:ring-accent-700 h-9 shrink-0 justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-red-900 focus:shadow focus:outline-none focus:ring-1 uppercase hover:scale-105 flex items-center",
              me ? "block" : "hidden"
            )}
          >
            Dashboard
          </AnchorLink>
          <Hamburger
            isToggle={isCollapse}
            onClick={onClickHamburger}
            className="flex"
          />
        </div>
      )}
    </header>
  );
}
