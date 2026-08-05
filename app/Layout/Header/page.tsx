"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Download } from "lucide-react";
import styles from "./Navbar.module.css";
import logo from "@/public/assets/logos/DREAM BTYE LOGO-01.webp";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "Graphic Design", href: "/best-graphic-design-service" },
      { label: "Web Development", href: "/best-web-development-service" },
      { label: "Digital Marketing", href: "/best-digital-marketing-service" },
      { label: "Influence Marketing", href: "/best-influence-marketing-service" },
      { label: "Performance Marketing", href: "/best-performance-marketing-service" },
      { label: "Photography / Videography", href: "/best-photography-service" },
      { label: "Event Management", href: "/best-event-management-management-service" },
      
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact" },
  { label: "Dream Byte Studio", href: "/dream-byte-studio" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const closeTimer = useRef(null);

  // Small delay on leave so the dropdown doesn't flicker shut
  // while the cursor moves from the trigger into the panel
  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopDropdownOpen(true);
  };

  const scheduleCloseDropdown = () => {
    closeTimer.current = setTimeout(() => setDesktopDropdownOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <Image
            src={logo}
            alt="Dream Byte Solutions"
            width={222}
            height={82}
            className={styles.logoIcon}
            priority
          />
         
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <li
                  key={link.label}
                  className={styles.navItem}
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                    <ChevronDown
                      size={16}
                      className={`${styles.chevron} ${
                        desktopDropdownOpen ? styles.chevronOpen : ""
                      }`}
                    />
                  </Link>
                  <div
                    className={`${styles.dropdown} ${
                      desktopDropdownOpen ? styles.dropdownOpen : ""
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={styles.dropdownItem}
                        onClick={() => setDesktopDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={link.label} className={styles.navItem}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* CTA Button */}
        <Link href="/resume.pdf" className={styles.ctaButton} target="_blank">
          <Download size={18} />
        </Link>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}>
        <ul className={styles.mobileNavList}>
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <li key={link.label} className={styles.mobileNavItem}>
                <button
                  className={styles.mobileNavLink}
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                >
                  {link.label}
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${
                      mobileDropdownOpen ? styles.chevronOpen : ""
                    }`}
                  />
                </button>
                <div
                  className={`${styles.mobileDropdown} ${
                    mobileDropdownOpen ? styles.mobileDropdownOpen : ""
                  }`}
                >
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={styles.mobileDropdownItem}
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </li>
            ) : (
              <li key={link.label} className={styles.mobileNavItem}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
          <li className={styles.mobileNavItem}>
            <Link
              href="/resume.pdf"
              className={styles.mobileCta}
              target="_blank"
              onClick={closeMobileMenu}
            >
              <Download size={18} />
              Download Resume
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} />
      )}
    </header>
  );
}