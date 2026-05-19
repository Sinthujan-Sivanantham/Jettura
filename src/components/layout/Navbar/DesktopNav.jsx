"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopNav({ navItems, navLinkStyles, t }) {
  const pathname = usePathname();

  return (
    <div className="hidden min-[761px]:flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={navLinkStyles({ isActive }).className}
            style={navLinkStyles({ isActive }).style}
          >
            {t ? t(item.translationKey) : item.name}
          </Link>
        );
      })}
    </div>
  );
}
