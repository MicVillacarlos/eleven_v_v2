"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../../utils/hooks/hooks";
import { DashboardIcon } from "../../svg/DashboardIcon";
import { HamburgerIcon } from "../../svg/HamburgerIcon";
import { LodgersIcon } from "../../svg/LodgersIcon";
import { SettingsIcon } from "../../svg/SettingsIcon";
import { BillsIcon } from "../../svg/BillsIcon";
import { LogoutIcon } from "../../svg/LogoutIcon";
import Image from "next/image";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const windowWidth: number = useWindowSize();
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (windowWidth > 639) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [windowWidth]);

  const toggleOpenSidebar = () => {
    setIsSidebarOpen(!isSideBarOpen);
  };

  const pathname = usePathname();

  const SideBarOptions = [
    {
      key: 1,
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    { key: 2, label: "Lodgers", href: "/admin/lodgers", icon: <LodgersIcon /> },
    { key: 3, label: "Bills", href: "/admin/bills", icon: <BillsIcon /> },
    {
      key: 4,
      label: "Settings",
      href: "/admin/settings",
      icon: <SettingsIcon />,
    },
    {
      key: 5,
      label: "Logout",
      href: "login",
      icon: <LogoutIcon />,
    },
  ];

  return (
    <div className="bg-[#E3EEF6] h-lvh">
      {/* ----------SIDE BAR CLOSE (to refactor)-------- */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleOpenSidebar}
      >
        <HamburgerIcon />
      </button>
      {/* ----------SIDE BAR OPEN-------- */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-lvh transition-transform bg-white ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-8 py-2 overflow-y-auto">
          <a className="py-[48] flex items-center ps-2.5 mb-5">
            <Image
              src="/elevenv-logo.svg"
              alt="Eleven V Logo"
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
            />
          </a>
          <ul className="space-y-3 font-semibold">
            {SideBarOptions.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              return (
                <React.Fragment key={item.key}>
                  <li>
                    <a
                      href={item.href}
                      className={`flex items-center p-2 rounded-lg group transition-all ${
                        isActive
                          ? "bg-gray-100 text-[#205072] shadow-xs"
                          : "text-[#7996AA] hover:bg-gray-100"
                      }`}
                    >
                      <span className="w-[50px] flex items-center justify-start">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                  {item.label === "Bills" && (
                    <hr className="border-[#7996AA] dark:border-gray-600" />
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="p-4 pt-10 sm:ml-64 bg-[#E3EEF6]">
        <div className="p-4">
          <div className="mb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
