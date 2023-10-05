import React from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "../ui/badge";
import { ActionsMenubar } from "../chat/actions-menubar";
const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function Navbar() {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav
        className="mx-auto flex items-center justify-between p-2"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          {/* <Badge variant="secondary">Saving...</Badge> */}
          <ActionsMenubar />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            bars
          </button>
        </div>
        <div className="hidden lg:flex">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
