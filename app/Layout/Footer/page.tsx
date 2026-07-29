"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import styles from "./Footer.module.css";
import logo from "@/public/assets/logos/DREAM BTYE LOGO-01.webp";

const USEFUL_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Marketing Agency", href: "/marketing-agency" },
];

const MORE_USEFUL_LINKS = [{ label: "Marketing Agency", href: "/marketing-agency" }];

const SOCIALS = [
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaWhatsapp, href: "https://wa.me/918279720490", label: "WhatsApp" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand / CTA */}
          <div className={styles.brandCol}>
             <Link href="/" className={styles.logo}>
            <Image
              src={logo}
              alt="Dream Byte Solutions"
              width={232}
              height={102}
              className={styles.logo}
            />
            </Link>
            <p className={styles.tagline}>
              &quot;Where Your Imagination is our innovation.&quot;
            </p>
            <h3 className={styles.ctaHeading}>Have a project in your mind?</h3>
            <Link href="/contact" className={styles.ctaButton}>
              CONTACT ME
            </Link>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <FaPhoneAlt size={13} />
                </span>
                <a href="tel:+918279720490">+91 8279720490</a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <FaPhoneAlt size={13} />
                </span>
                <a href="tel:+919258332639">+91 9258332639</a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <MdAlternateEmail size={15} />
                </span>
                <a href="mailto:info@dreambytesolution.com">
                  info@dreambytesolution.com
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <MdAlternateEmail size={15} />
                </span>
                <a href="mailto:hr@dreambytesolution.com">
                  hr@dreambytesolution.com
                </a>
              </li>
            </ul>

            <div className={styles.socials}>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={styles.socialIcon}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* More Useful Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>More Useful Links</h4>
            <ul className={styles.linkList}>
              {MORE_USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Useful Links</h4>
            <ul className={styles.linkList}>
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Location</h4>
            <div className={styles.locationItem}>
              <span className={styles.iconCircle}>
                <FaMapMarkerAlt size={14} />
              </span>
              <p>
                Dream Byte Solutions Pvt. Ltd
                <br />
                3rd Floor, above Bank of India, Sahastradhara Road, Near IT
                Park, Dehradun, Uttarakhand
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>
            © {year} | All rights reserved by{" "}
            <span className={styles.brandName}>Dream Byte Solutions Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}