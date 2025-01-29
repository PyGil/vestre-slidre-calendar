import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/shadcn-ui/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="bg-[#111c41]/80 backdrop-blur-lg py-4 px-12 sticky left-0 right-0 top-0 h-20 z-[9999]">
      <NavigationMenu className="grid grid-cols-1 max-w-full">
        <NavigationMenuList className="justify-between w-full">
          <NavigationMenuItem>
            <Link href="https://www.vestre-slidre.kommune.no/">
              <Image
                src="/images/header-logo.svg"
                width={300}
                height={60}
                className="w-[235px] h-[44px] object-contain"
                alt="Logo"
              />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
