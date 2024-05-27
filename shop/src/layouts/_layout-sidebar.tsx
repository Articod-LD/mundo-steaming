import { HomeIcon } from "@/components/icons/home-icon";
import Button from "@/components/ui/button";
import ActiveLink from "@/components/ui/links/active-link";
import AnchorLink from "@/components/ui/links/anchor-link";
import Logo from "@/components/ui/logo";
import Scrollbar from "@/components/ui/scrollbar";
import routes from "@/config/routes";
import { useLogoutMutation, useMe } from "@/data/user";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import classNames from "classnames";

interface NavLinkProps {
  href: string;
  title: string;
  isCollapse?: boolean;
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
      className="flex items-center justify-center gap-5 px-4 hover:bg-light-300 hover:dark:bg-dark-300"
      activeClassName="text-brand"
    >
      <span className={classNames("inline-flex uppercase")}>{item.label}</span>
    </ActiveLink>
  ));
}

function MenuRender() {
  const {isAuthorized} = useMe()
  const { mutate: logout } = useLogoutMutation();
  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-light-300 dark:bg-dark-500" />
    );
  }
  return (
    <div className="flex flex-col gap-3">
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
          className="text-center transition-fill-colors uppercase transition ease-in-out hover:scale-105 duration-300 border-2 border-brand"
        >
          Login
        </AnchorLink>
      )}
    
    </div>
  );
}

export function Sidebar({
  isCollapse,
  className = "flex sm:hidden fixed bottom-0 z-50 pt-[90px]",
}: {
  isCollapse?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={classNames(
        "h-full flex-col justify-between overflow-y-auto border-r border-light-400 bg-light-100 text-dark-900 dark:border-0 dark:bg-dark-200",
        isCollapse ? "w-60" : "w-[0px]",
        className
      )}
    >
      <Scrollbar className="relative h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col gap-14">
            <div className="w-full flex justify-center">
              <Logo className="w-32" />
            </div>
            <MenuRender />

          </nav>
        </div>
      </Scrollbar>
    </aside>
  );
}
