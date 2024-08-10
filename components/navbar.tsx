"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { MdLogin, MdLogout } from "react-icons/md";
import Cookies from "universal-cookie";
import { Tooltip } from "@nextui-org/tooltip";
import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

import { Book, Library } from "./library";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

function Logout() {
  const cookies = new Cookies();

  cookies.remove("username");
  cookies.remove("connect.sid");
  fetch("/api/auth", { method: "DELETE" });

  window.location.reload();
}

export const Navbar = () => {
  const library = new Library();
  const username = new Cookies().get("username");
  const [searchResult, setResult] = useState<Book[]>([]);

  const handleSearchInputChange = async (query: string) => {
    let result = await library.searchBooks(query, 5);

    setResult(result);
  };

  const searchInput = (
    <div className="relative">
      <Autocomplete
        className="max-w-xs"
        items={searchResult}
        label="Search"
        onInputChange={handleSearchInputChange}
        onSelectionChange={(_value) => {}}
      >
        {(result) => (
          <AutocompleteItem
            key={result._id}
            description={result.author}
            title={result.name}
            onClick={() => {
              window.location.href = `/book/${result._id}`;
            }}
          />
        )}
      </Autocomplete>
    </div>
  );

  let person: any;

  if (username != undefined) {
    person = (
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <span className="text-sm text-default-600">Welcome: </span>
          <span className="text-sm text-default-600">{username} </span>
        </NavbarItem>
        <NavbarItem>
          <Tooltip content="Logout">
            <Button
              isIconOnly
              aria-label="Logout"
              color="danger"
              onPress={Logout}
            >
              <MdLogout />
            </Button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>
    );
  } else {
    person = (
      <NavbarItem className="hidden md:flex">
        <Button
          as={Link}
          className="text-sm font-normal text-default-600 bg-default-100"
          href={siteConfig.links.sponsor}
          startContent={<MdLogin className="text-success" />}
          variant="flat"
        >
          Login
        </Button>
      </NavbarItem>
    );
  }

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Library</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        {person}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Navbar;
