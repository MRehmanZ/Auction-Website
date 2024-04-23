import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Avatar from "@mui/material/Avatar";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Create Auction", href: "/create-auction", current: false },
  { name: "Manage Auctions", href: "/manage-auctions", current: false },
  { name: "Admin", href: "/Admin", current: false },
  { name: "Location", href: "/location", current: false },
];

export default function NavBar({ isLoggedIn, handleLogout }) {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              </Disclosure.Button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <h3 className="text-3xl text-white font-bold  px-2">
                    BidWise
                  </h3>
                </Link>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  {/*Loop through navigation items and create links to each page */}
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="px-3 py-2 rounded-md text-sm font-medium text-white"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {isLoggedIn ? (
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none  ">
                      <span className="sr-only">Open user menu</span>
                      <Avatar />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <a
                          onClick={() => handleLogout()}
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700"
                        >
                          Sign out
                        </a>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="bg-gray-800 text-white"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-gray-800 text-white"
                    asChild
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </Disclosure>
  );
}
