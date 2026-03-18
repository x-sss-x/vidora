"use client";

import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Session } from "@/server/better-auth/config";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

interface HeaderProps {
  user?: Session["user"] | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Search:", search);
    // TODO: route to search page
  };

  return (
    <header className="fixed top-0 h-14 w-full border-b bg-background px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* LEFT - Logo */}
          <Link
            className="flex items-center gap-2 font-bold font-mono text-lg"
            href="/"
          >
            <YoutubeLogoIcon className="size-8 text-primary" weight="duotone" />
            VIDORA
          </Link>

          {/* Add Video */}
          <Link href="/admin/upload">
            <Button className="gap-2" size="sm" variant="outline">
              <PlusCircleIcon className="h-4 w-4" />
              Add Video
            </Button>
          </Link>
        </div>

        {/* CENTER - Search */}
        <form
          className="max-w-xl flex-1 items-center gap-2"
          onSubmit={handleSearch}
        >
          <InputGroup className="h-10">
            <InputGroupInput
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              value={search}
            />
            <InputGroupButton
              className={"size-10"}
              size={"sm"}
              type="submit"
              variant={"secondary"}
            >
              <MagnifyingGlassIcon />
            </InputGroupButton>
          </InputGroup>
        </form>

        {/* RIGHT - Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage alt={user.name} src={user.image ?? ""} />
                    <AvatarFallback>
                      {user.name.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Create Account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
