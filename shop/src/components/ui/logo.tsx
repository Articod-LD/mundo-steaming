import cn from "classnames";
import Image from "@/components/ui/image";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { useIsDarkMode } from "@/lib/hooks/use-is-dark-mode";
import { siteSettings } from "@/data/static/site-settings";
import { useSettings } from "@/data/settings";
import { useState } from "react";

export default function Logo({
  className = "w-20",
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  const { lightLogo, darkLogo } = siteSettings;

  const [plataforma] = useState(process.env.NEXT_PUBLIC_PLATAFORMA);

  const { settings }: any = useSettings();
  return (
    <AnchorLink
      href={routes.home}
      className={cn(
        "relative flex items-center text-dark focus:outline-none dark:text-light",
        className
      )}
      {...props}
    >
      <span
        className="relative overflow-hidden"
        style={{
          width: siteSettings?.width,
          height: plataforma === "COMBO" ? 90 : siteSettings?.height,
        }}
      >
        {isMounted && isDarkMode && (
          <Image
            src={plataforma === "COMBO" ? darkLogo : lightLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? "Dark Logo"}
            className="object-contain"
          />
        )}
        {isMounted && !isDarkMode && (
          <Image
            src={plataforma === "COMBO" ? darkLogo : lightLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? "Light Logo"}
            className="object-contain"
          />
        )}
      </span>
    </AnchorLink>
  );
}
