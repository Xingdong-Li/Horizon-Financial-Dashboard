/**
 * @file Sidebar.jsx
 * @desc This file contains the implementation of the Sidebar component.
 * The Sidebar component is responsible for rendering the sidebar navigation menu for the Care Manager section of the application.
 * It displays a list of navigation items and handles user interactions such as selecting an item and signing out.
 * The sidebar can be toggled open and closed on smaller screens.
 */
import { Fragment, useState } from "react";
import { signOut } from "aws-amplify/auth";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import PlaidLink from "../dashboard/PlaidLink";

export default function Sidebar() {
  const location = useLocation();
  const { userId, attributes: user } = useAuth();

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: "/icons/browser-home-svgrepo-com.svg",
    },
    {
      name: "My Banks",
      href: "/my-banks",
      icon: "/icons/bank-card-svgrepo-com2.svg",
    },
    {
      name: "Transaction History",
      href: "/transaction-history",
      icon: "/icons/transaction-finance-business-svgrepo-com.svg",
    },
    {
      name: "Visualization",
      href: "/visualization",
      icon: "/icons/visualization-grid-svgrepo-com.svg",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: "/icons/documents-storage-files-svgrepo-com.svg",
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const SVGIcon = ({ src, className, alt }) => (
    <img src={src} className={className} alt={alt} />
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    location.pathname === "/"
      ? "Home"
      : navigation.find((item) => item.href === location.pathname)?.name
  );

  async function handleSignOut() {
    try {
      await signOut().then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const userNavigation = [
    { name: "Account Management", href: "#" },
    { name: "Sign out", onClick: handleSignOut },
  ];

  const randomAvatarUrl = `https://robohash.org/${userId}.png`;

  if (!user) return null;

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-7 w-7 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-center">
                      <img
                        className="h-10 w-auto"
                        src="/icons/logo.svg"
                        alt="Horizon Logo"
                      />
                      <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-semibold text-black-1">
                        Horizon
                      </h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                {[
                                  "Home",
                                  "My Banks",
                                  "Transaction History",
                                  "Visualization",
                                  "Documents",
                                ].includes(item.name) ? (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      item.name === activeItem
                                        ? "bg-co-dark-blue text-white"
                                        : "text-gray-700 hover:text-white hover:bg-co-dark-blue",
                                      "group flex gap-x-3 rounded-md p-2 text-xl leading-6"
                                    )}
                                    onClick={() => setActiveItem(item.name)}
                                  >
                                    <SVGIcon
                                      src={item.icon}
                                      className={classNames(
                                        item.name === activeItem
                                          ? "text-white"
                                          : "text-gray-400 group-hover:text-white",
                                        "h-7 w-7 shrink-0"
                                      )}
                                      alt={item.name}
                                    />
                                    {item.name}
                                  </Link>
                                ) : (
                                  <Link
                                    to={item.href}
                                    title="Coming soon"
                                    className={classNames(
                                      item.name === activeItem
                                        ? "bg-co-dark-blue text-white"
                                        : "text-gray-700 hover:text-white hover:bg-co-dark-blue cursor-not-allowed",
                                      "group flex gap-x-3 rounded-md p-2 text-xl leading-6"
                                    )}
                                  >
                                    <SVGIcon
                                      src={item.icon}
                                      className={classNames(
                                        item.name === activeItem
                                          ? "text-white"
                                          : "text-gray-400 group-hover:text-white",
                                        "h-7 w-7 shrink-0"
                                      )}
                                      alt={item.name}
                                    />
                                    {item.name}
                                  </Link>
                                )}
                              </li>
                            ))}
                            <li>
                              <PlaidLink user={user} />
                            </li>
                          </ul>
                        </li>

                        <div className="flex items-center justify-between mt-auto">
                          <a
                            href="mailto:li.xingdo@northeastern.edu"
                            className={`flex mr-auto items-center p-2 rounded-md text-gray-700 text-xl hover:text-white hover:bg-co-dark-blue transition-colors duration-300 `}
                          >
                            <span className="whitespace-nowrap">
                              Contact Us
                            </span>
                          </a>
                        </div>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-3 pb-4">
            <div className="flex h-16 shrink-0 items-center gap-2 justify-center">
              <img
                className="h-12 w-auto"
                src="/icons/logo.svg"
                alt="Horizon Logo"
              />
              <h1 className="2xl:text-26 font-ibm-plex-serif text-[26px] font-semibold text-black-1">
                Horizon
              </h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-1 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {[
                          "Home",
                          "My Banks",
                          "Transaction History",
                          "Visualization",
                          "Documents",
                        ].includes(item.name) ? (
                          <Link
                            to={item.href}
                            className={classNames(
                              item.name === activeItem
                                ? "bg-co-dark-blue text-white"
                                : "text-gray-700 hover:text-white hover:bg-co-dark-blue",
                              "group flex gap-x-3 rounded-md p-2 text-xl leading-6"
                            )}
                            onClick={() => setActiveItem(item.name)}
                          >
                            <SVGIcon
                              src={item.icon}
                              className={classNames(
                                item.name === activeItem
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-white",
                                "h-7 w-7 shrink-0"
                              )}
                              alt={item.name}
                            />
                            {item.name}
                          </Link>
                        ) : (
                          <Link
                            to={item.href}
                            title="Coming soon"
                            className={classNames(
                              item.name === activeItem
                                ? "bg-co-dark-blue text-white"
                                : "text-gray-700 hover:text-white hover:bg-co-dark-blue cursor-not-allowed",
                              "group flex gap-x-3 rounded-md p-2 text-xl leading-6"
                            )}
                          >
                            <SVGIcon
                              src={item.icon}
                              className={classNames(
                                item.name === activeItem
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-white",
                                "h-7 w-7 shrink-0"
                              )}
                              alt={item.name}
                            />
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                    <li>
                      <PlaidLink user={user} />
                    </li>
                  </ul>
                </li>
                <div className="flex w-full items-center justify-center mt-auto">
                  <a
                    href="mailto:li.xingdo@northeastern.edu"
                    className={`flex items-center p-2 rounded-md text-gray-700 text-xl hover:text-white hover:bg-co-dark-blue transition-colors duration-300 `}
                  >
                    <span className="whitespace-nowrap">Contact Us</span>
                  </a>
                </div>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-64">
          <div className="sticky bg-co-dark-blue top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-7 w-7" aria-hidden="true" />
            </button>

            <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
              <div className="relative flex flex-1 ">
                <span className="absolute inset-y-0 left-0 flex items-center md:text-xl text-white">
                  Welcome
                </span>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src={randomAvatarUrl}
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-xl leading-6 text-white"
                        aria-hidden="true"
                      >
                        {user.name}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2.5 w-65 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ active }) =>
                            item.name === "Account Management" ? (
                              <a className="relative group">
                                <div className="block px-3 py-1 text-xl leading-6 text-gray-500 border-b border-gray-100 cursor-not-allowed">
                                  {item.name}
                                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out tooltip">
                                    Coming soon
                                  </span>
                                </div>
                              </a>
                            ) : (
                              <a
                                onClick={item.onClick}
                                href={item.href}
                                className={classNames(
                                  active ? "bg-co-dark-blue text-white" : "",
                                  "block px-3 py-1 text-xl leading-6 text-gray-900 border-b border-gray-100 hover:bg-co-dark-blue hover:text-white"
                                )}
                              >
                                {item.name}
                              </a>
                            )
                          }
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
