import Logo from "@/components/ui/logo";
import { useUI } from "@/contexts/ui.context";
import { miniSidebarInitialValue } from "@/utils/constants";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
const Navbar = () => {
  const { toggleSidebar } = useUI();
  const [miniSidebar, setMiniSidebar] = useAtom(miniSidebarInitialValue);
  return (
    <header className="fixed top-0 z-40 w-full bg-black shadow sm:hidden h-[94px]">
      <nav className="flex items-center justify-between px-5 md:px-8 h-full">
        <Logo />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-4 focus:text-accent focus:outline-none lg:hidden"
        >
          <span
            className={classNames(
              "h-0.5 rounded-full bg-gray-600 group-hover:bg-accent",
              miniSidebar ? "w-full" : "w-2/4"
            )}
          />
          <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
          <span className="h-0.5 w-3/4 rounded-full bg-gray-600  group-hover:bg-accent" />
        </motion.button>
      </nav>
    </header>
  );
};

export default Navbar;
