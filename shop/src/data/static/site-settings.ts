import Logo from "@/assets/images/Logo.svg";
import routes from "@/config/routes";

export const siteSettings: any = {
  lightLogo: Logo,
  width: 128,
  height: 40,
  avatar: {
    placeholder: "/avatar-placeholder.svg",
  },
  sidebarLinks: {
    super_admin: {
      root: {
        href: routes.dashboard,
        label: "Inicio",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.dashboard,
            label: "Dashboard",
            icon: "DashboardIcon",
            permissions: ["super_admin"],
          },
        ],
      },
      management: {
        href: routes.dashboard,
        label: "Monitoreo",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.clientes,
            label: "Clientes",
            icon: "UsersIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.plataformas,
            label: "Plataformas",
            icon: "ProductsIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.solicitudesPlataformas,
            label: "Solicitud Plataformas",
            icon: "ProductsIcon",
            permissions: ["super_admin"],
          },
        ],
      },
    },
    customer: {
      root: {
        href: routes.plataformasClientes,
        label: "Inicio",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.plataformasClientes,
            label: "Plataformas",
            icon: "ProductsIcon",
            permissions: ["customer", "super_admin"],
          },
        ],
      },
    },
  },
};
