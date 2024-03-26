import Link from "@/components/ui/links/anchor-link";
import { getIcon } from "@/utils/get-icon";
import * as sidebarIcons from "@/components/icons/sidebar";
import { useUI } from "@/contexts/ui.context";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuthCredentials, hasAccess } from "@/utils/auth";
import { RESPONSIVE_WIDTH } from "@/utils/constants";
import AdvancePopover from "@/components/ui/advance-popover";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "@/components/icons/chevron.right";

function SidebarShortItem({
  childMenu,
  shop = null,
  label,
  currentUserPermissions,
  icon,
  miniSidebar,
}: {
  childMenu: any;
  shop?: any;
  label: string;
  currentUserPermissions: any;
  icon: string;
  miniSidebar: boolean;
}) {
  const { closeSidebar } = useUI();
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();
  const sanitizedPath = router.asPath.split("#")[0].split("?")[0];
  return (
    <AdvancePopover
      onMouseEnter={() => setDropdown(true)}
      onMouseLeave={() => setDropdown(false)}
      content={() => (
        <>
          {childMenu?.map((item: any, index: number) => {
            if (shop && !hasAccess(item?.permissions, currentUserPermissions))
              return null;
            return (
              <div key={index}>
                <Link
                  passHref
                  as={shop ? item?.href(shop?.toString()!) : item?.href}
                  href={{
                    pathname: `${
                      shop ? item?.href(shop?.toString()!) : item?.href
                    }`,
                    query: { parents: label },
                  }}
                  className={classNames(
                    "relative flex w-full cursor-pointer items-center rounded-lg py-2 text-sm text-start focus:text-accent",
                    (
                      shop
                        ? sanitizedPath === item?.href(shop?.toString()!)
                        : sanitizedPath === item?.href
                    )
                      ? "bg-transparent font-medium text-accent-hover"
                      : "text-body-dark hover:text-accent focus:text-accent"
                  )}
                  title={item?.label}
                  onClick={() => closeSidebar()}
                >
                  {item?.label}
                </Link>
              </div>
            );
          })}
        </>
      )}
      isPopover={true}
      isOpen={dropdown}
      placement="left"
    >
      <div
        className={classNames(
          'relative flex w-full cursor-pointer items-center px-3 py-2.5 text-sm text-gray-600 before:absolute before:-right-5 before:top-0 before:h-full before:w-5 before:content-[""]',
          miniSidebar ? "hover:text-accent ltr:pl-3 rtl:pr-3" : null
        )}
      >
        {getIcon({
          iconList: sidebarIcons,
          iconName: icon,
          className: "w-5 h-5",
        })}
      </div>
    </AdvancePopover>
  );
}

const SidebarItem = ({
  href,
  icon,
  label,
  childMenu,
  miniSidebar,
}: {
  href: any;
  icon: any;
  label: string;
  childMenu: [];
  miniSidebar?: boolean;
}) => {
  const { closeSidebar } = useUI();
  const router = useRouter();
  const { width } = useWindowSize();

  const sanitizedPath = router?.asPath?.split("#")[0]?.split("?")[0];
  const isParents = router?.query?.parents;
  const isActive = useMemo(() => {
    if (isParents) {
      return isParents === label;
    }
    let lastIndex = router?.asPath?.lastIndexOf("/");
    if (label !== "Settings") {
      return (
        router?.asPath
          ?.substring(lastIndex + 1)
          ?.replace(/[^a-zA-Z ]/g, " ")
          ?.trim()
          ?.toUpperCase() === label?.trim()?.toUpperCase()
      );
    }
    return router?.asPath
      ?.trim()
      ?.toUpperCase()
      ?.includes(label?.trim()?.toUpperCase());
  }, [router?.asPath, isParents]);

  href =
    href && href !== "/" && href?.endsWith("/") ? href?.slice(0, -1) : href;
  const [isOpen, setOpen] = useState<boolean>(isActive);

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  const toggleCollapse = useCallback(() => {
    setOpen((prevValue) => !prevValue);
  }, [isOpen]);

  const onClick = useCallback(() => {
    if (Array.isArray(childMenu) && !!childMenu.length) {
      toggleCollapse();
    }
  }, [isOpen]);

  const { permissions: currentUserPermissions } = getAuthCredentials();

  return childMenu && childMenu?.length ? (
    miniSidebar && width >= RESPONSIVE_WIDTH ? (
      <SidebarShortItem
        currentUserPermissions={currentUserPermissions}
        label={label}
        childMenu={childMenu}
        icon={icon}
        miniSidebar={miniSidebar && width >= RESPONSIVE_WIDTH}
      />
    ) : (
      <>
        <motion.div
          initial={false}
          className={classNames(
            "group cursor-pointer rounded-md px-3 py-2.5 text-body-dark hover:bg-gray-100 focus:text-accent",
            isOpen ? "bg-gray-100 font-medium" : ""
          )}
          onClick={onClick}
        >
          <div className={classNames("flex w-full items-center text-sm")}>
            <span className="text-gray-600">
              {getIcon({
                iconList: sidebarIcons,
                iconName: icon,
                className: "w-5 h-5 me-3",
              })}
            </span>
            <span
              className={
                width >= RESPONSIVE_WIDTH && miniSidebar ? "hidden" : ""
              }
            >
              {label}
            </span>

            <ChevronRight
              className={classNames(
                "h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ltr:ml-auto ltr:mr-0 rtl:mr-auto rtl:ml-0",
                isOpen ? "rotate-90 transform" : "",
                width >= RESPONSIVE_WIDTH && miniSidebar ? "hidden" : ""
              )}
            />
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1],
              }}
              className={miniSidebar ? "relative" : "!mt-0"}
            >
              <div className="pt-2 ltr:pl-5 rtl:pr-5">
                <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
                  {childMenu?.map((item: any, index: number) => {
                    return (
                      <div key={index}>
                        <Link
                          passHref
                          href={{
                            pathname: `${item?.href}`,
                            query: {
                              parents: label,
                            },
                          }}
                          as={item?.href}
                          className={classNames(
                            'relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] focus:text-accent',
                            sanitizedPath === item?.href
                              ? "bg-transparent font-medium text-accent-hover"
                              : "text-body-dark hover:text-accent focus:text-accent"
                          )}
                          title={item.label}
                          onClick={() => closeSidebar()}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </>
    )
  ) : (
    <Link
      href={href}
      className={classNames(
        `group flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-gray-700 text-start focus:text-accent ${
          miniSidebar && width >= RESPONSIVE_WIDTH
            ? "hover:text-accent-hover ltr:pl-3 rtl:pr-3"
            : "hover:bg-gray-100"
        }`,
        sanitizedPath === href
          ? `font-medium !text-accent-hover ${
              !miniSidebar ? "bg-accent/10 hover:!bg-accent/10" : ""
            }`
          : ""
      )}
      title={label}
      onClick={() => closeSidebar()}
    >
      {icon ? (
        <span
          className={classNames(
            "transition",
            sanitizedPath === href
              ? "text-accent-hover"
              : "text-gray-600 group-focus:text-accent",
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? "group-hover:text-accent"
              : null
          )}
        >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: "w-5 h-5",
          })}
        </span>
      ) : null}
      <span
        className={classNames(
          miniSidebar && width >= RESPONSIVE_WIDTH ? "hidden" : ""
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarItem;
