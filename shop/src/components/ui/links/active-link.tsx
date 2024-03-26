import type { LinkProps } from "next/link";
import { useRouter } from "next/router";
import AnchorLink from "@/components/ui/links/anchor-link";
import classNames from "classnames";

interface ActiveLinkProps extends LinkProps {
  activeClassName?: string;
  children?: React.ReactNode;
}
const ActiveLink: React.FC<
  ActiveLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">
> = ({ href, className, activeClassName = "active", ...props }) => {
  const { pathname } = useRouter();
  console.log(href);

  return (
    <AnchorLink
      href={href}
      className={classNames(className, {
        [activeClassName]: pathname === href,
      })}
      {...props}
    />
  );
};

export default ActiveLink;
