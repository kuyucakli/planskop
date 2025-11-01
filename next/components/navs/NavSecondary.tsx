import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMoreHorizontal } from "../ui/icons";

export function NavSecondary() {
  return (
    <nav className="gap-2 text-sm flex">
      <Link
        href="/about"
        className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wide hidden md:block"
        scroll={false}
      >
        About
      </Link>
      <Link
        href="/newsletter"
        className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wider hidden md:block"
        scroll={false}
      >
        Newsletter
      </Link>
      <div className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconMoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <Link
                href="/about"
                className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wide"
                scroll={false}
              >
                About
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <Link
                href="/newsletter"
                className="bg-neutral-900 hover:bg-neutral-800 text-gray-100 text-xs py-2 px-4 rounded tracking-wider"
                scroll={false}
              >
                Newsletter
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
