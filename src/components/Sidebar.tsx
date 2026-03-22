"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-data";
import { getCurrentUserSnapshot } from "@/lib/client-simulation";

export default function Sidebar() {
  const pathname = usePathname();
  const currentUser = getCurrentUserSnapshot();

  const nav = [
    {
      href: "/",
      label: "Home",
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      href: "/reels",
      label: "Reels",
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 9h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 20.625v-9.75C1.5 9.839 2.34 9 3.375 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 14.25l4.5-2.25-4.5-2.25v4.5z" />
        </svg>
      ),
    },
    {
      href: "/messages",
      label: "Messages",
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
    },
    {
      href: "/create",
      label: "Create",
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: `/profile/${CURRENT_USER.username}`,
      label: "Profile",
      icon: () => (
        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-gray-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white px-3 py-6 z-40">
        {/* Logo */}
        <Link href="/" className="px-3 mb-8 block">
          <span className="text-2xl font-bold italic tracking-tight">Fakestagram</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
                }`}
              >
                {icon(active)}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around items-center h-14 px-2">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
                active ? "text-black" : "text-gray-400"
              }`}
              aria-label={label}
            >
              {icon(active)}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
