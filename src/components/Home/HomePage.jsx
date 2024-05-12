import React from "react";
import HeroSection from "./HeroSection";
import iphone from "../../assets/iphone-14-pro.webp";
import mac from "../../assets/mac-system-cut.jfif";
import FeaturedProducts from "./FeaturedProducts";

const HomePage = () => {
  return (
    <div>
      {/*Hero Section*/}
      <HeroSection
        title="Buy iPhone 14 Pro!"
        subtitle="Pro. Beyond."
        //link="/product/661f53ef7f9b7b534b401aa3"
        link="/product/6626b21ac61e2519992fd1a8"
        image={iphone}
      />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Hero Section*/}
      <HeroSection
        title="The ultimate experience!"
        subtitle="Get more done faster."
        //link="/product/661f53ef7f9b7b534b401aab"
        link="/product/6626b21bc61e2519992fd1b0"
        image={mac}
      />
    </div>
  );
};

export default HomePage;
