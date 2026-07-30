import Image from "next/image";
import FAQ from "./components/Homepage/Faq/page";
import Services from "./components/Homepage/Services/page";
import TestimonialSlider from "./components/Homepage/Testimonialslider/page";
import Industries from "./components/Homepage/marketingindustry/page";
import Projects from "./components/Homepage/latestproject/page";
import TrustedBrands from "./components/Homepage/TrustedBrands/page";
import WhyUs from "./components/Homepage/WhyUs/page";
import HeroBanner from "./components/Homepage/Herobanner/page";
import ReelsShowcase from "./components/Homepage/videoshowcase/page";

export default function Home() {
  return (
   <>
   <HeroBanner/>
   <WhyUs/>
   <TrustedBrands/>
    <Services/>
   <Industries/>
   <Projects/>
   <ReelsShowcase/>
   <TestimonialSlider/>
   <FAQ/>
   </>
  );
}
