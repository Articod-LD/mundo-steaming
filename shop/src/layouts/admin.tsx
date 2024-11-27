import { siteSettings } from "@/data/static/site-settings";
import SidebarItem from "./navigation/sidebar-item";
import { useWindowSize } from "react-use";
import {
  RESPONSIVE_WIDTH,
  miniSidebarInitialValue,
  searchModalInitialValues,
} from "@/utils/constants";
import classNames from "classnames";
import { useAtom } from "jotai";
import Navbar from "./navigation/top-navbar";
import Footer from "./_footer";
import Logo from "@/components/ui/logo";
import MobileNavigation from "./navigation/mobile-naviagation";
import { SearchIcon } from "@/components/icons/search-icon";
import SearchBar from "./topbar/search-bar";
import { useModalAction } from "@/components/ui/modal/modal.context";
import AuthorizedMenu from "./navigation/authorized-menu";
import { useMe } from "@/data/user";
import { Permission } from "@/types";

interface MenuItemsProps {
  [key: string]: {
    href: string;
    label: string;
    icon: string;
    childMenu: {
      href: string;
      label: string;
      icon: string;
    }[];
  };
}

const SideBarGroup = () => {
  // @ts-ignore
  const { me } = useMe();

  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const permissionName = me!.permissions[0].name as any;

  let menuItems: any;

  if (Object.values(Permission).includes(permissionName)) {
    menuItems = siteSettings.sidebarLinks?.[permissionName] as any;
  }

  const menuKeys = Object.keys(menuItems);
  const { width } = useWindowSize();

  return (
    <>
      {menuKeys?.map((menu, index) => (
        <div
          className={classNames(
            "flex flex-col px-5",
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? "border-b border-dashed border-gray-200 py-5"
              : "pt-6 pb-3"
          )}
          key={index}
        >
          <div
            className={classNames(
              "px-3 pb-5 text-xs font-semibold uppercase tracking-[0.05em] text-body/60",
              miniSidebar && width >= RESPONSIVE_WIDTH ? "hidden" : ""
            )}
          >
            {menuItems[menu]?.label}
          </div>
          <SidebarItemMap menuItems={menuItems[menu]} />
        </div>
      ))}
    </>
  );
};

const SidebarItemMap = ({ menuItems }: any) => {
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { childMenu } = menuItems;
  const { width } = useWindowSize();
  return (
    <div className="space-y-2">
      {childMenu?.map(
        ({
          href,
          label,
          icon,
          childMenu,
        }: {
          href: string;
          label: string;
          icon: string;
          childMenu: any;
        }) => (
          <SidebarItem
            href={href}
            key={label}
            label={label}
            icon={icon}
            childMenu={childMenu}
            miniSidebar={miniSidebar && width >= RESPONSIVE_WIDTH}
          />
        )
      )}
    </div>
  );
};

const AdminLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const { width } = useWindowSize();
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { openModal } = useModalAction();
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);
  const { me } = useMe();
  const isSuperAdmin = me?.permissions?.some(permission => permission.name === "super_admin");


  function handleClick() {
    openModal("SEARCH_VIEW");
    setSearchModal(true);
  }

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-150">
      <Navbar />
      <MobileNavigation>
        <SideBarGroup />
      </MobileNavigation>

      <div className="flex flex-1">
        <aside
          className={classNames(
            "fixed bottom-0 z-10 hidden h-full w-72 bg-black shadow transition-[width] duration-300 lg:block ",
            width >= RESPONSIVE_WIDTH && "",
            miniSidebar && width >= RESPONSIVE_WIDTH ? "lg:w-24" : "lg:w-76"
          )}
        >
          <div className="sidebar-scrollbar h-full w-full overflow-x-hidden">
            <div className="flex justify-center h-24">
              <Logo />
            </div>
            <SideBarGroup />
          </div>
        </aside>
        <main
          className={classNames(
            "relative flex w-full flex-col justify-start transition-[padding] duration-300",
            width >= RESPONSIVE_WIDTH ? "lg:pt-5" : "mt-24",
            miniSidebar && width >= RESPONSIVE_WIDTH ? "lg:pr-24" : "lg:pl-72"
          )}
        >
          <div className="h-full p-5 md:p-8">
            <div className="w-full flex items-center mb-12">
              <div
                className="relative flex ml-auto mr-1.5 h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 py-4 hover:border-transparent hover:border-gray-200 hover:bg-white hover:text-accent sm:mr-6 lg:hidden xl:hidden text-black"
                onClick={handleClick}
              >
                <SearchIcon className="h-4 w-4" />
              </div>
              <div className="relative hidden w-full max-w-[710px] py-4 me-6 lg:block 2xl:me-auto">
                <SearchBar />
              </div>

              <div className="flex gap-2 items-center ">
                {
                  !isSuperAdmin &&
                  <span>Saldo:  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(me.wallet))}</span>
                }
                <AuthorizedMenu />
              </div>

            </div>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
