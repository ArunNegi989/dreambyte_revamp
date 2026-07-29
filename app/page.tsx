import Image from "next/image";
import FAQ from "./components/Faq/page";
import Services from "./components/Services/page";
import TestimonialSlider from "./components/Testimonialslider/page";
import Industries from "./components/marketingindustry/page";
import Projects from "./components/latestproject/page";
import TrustedBrands from "./components/TrustedBrands/page";
import WhyUs from "./components/WhyUs/page";
import HeroBanner from "./components/Herobanner/page";
import ReelsShowcase from "./components/videoshowcase/page";

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
