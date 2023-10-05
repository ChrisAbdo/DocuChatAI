import React from "react";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

export default function TopBar({ removeFile }: { removeFile: () => void }) {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav
        className="mx-auto flex items-center justify-between p-2"
        aria-label="Global"
      >
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            bars
          </button>
        </div>
        <div className="hidden lg:flex lg:justify-between w-full">
          <Button>tes</Button>
          <Button onClick={removeFile}>
            <TrashIcon className="w-5 h-5 mr-2" />
            Remove PDF
          </Button>
        </div>
      </nav>
    </header>
  );
}
