// app/portfolio/page.tsx
import AgencyPortfolio from "@/app/components/portfolio/AgencyPortfolio";

export const metadata = {
  title: "Portfolio | Dream Byte Solutions",
  description:
    "Selected web development, digital marketing, graphic design, and branding work by Dream Byte Solutions.",
};

export default function PortfolioPage() {
  return <AgencyPortfolio />;
}