"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, label, onNavigate }) {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link href={href} className={`nav-item ${isActive ? "active" : ""}`} onClick={onNavigate}>
      {label}
    </Link>
  );
}
