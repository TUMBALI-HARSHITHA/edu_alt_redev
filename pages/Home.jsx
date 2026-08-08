import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/home/HeroSection";
import FeaturedPrograms from "../components/home/FeaturedPrograms";
import WhyEduAlt from "../components/home/WhyEduAlt";
import SchoolTechSolutions from "../components/home/SchoolTechSolutions";
import ResourcesSection from "../components/home/ResourcesSection";
import ProcessSection from "../components/home/ProcessSection";
import StatsSection from "../components/home/StatsSection";
import CTASection from "../components/home/CTASection";
import CourseTracksSlider from "../components/home/CourseTracksSlider";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Edu Alt Tech | Learning Resources, Courses & AI Tools</title>
        <meta name="description" content="Edu Alt Tech provides learning resources, online courses, AI tools, educational websites and technology solutions." />
        <link rel="canonical" href="https://www.edualttech.com/" />
        <meta property="og:title" content="Edu Alt Tech" />
        <meta property="og:description" content="Learning Resources, Courses, AI Tools & School Technology Solutions" />
        <meta property="og:image" content="https://www.edualttech.com/og-image.jpg" />
        <meta property="og:url" content="https://www.edualttech.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Edu Alt Tech",
            "url": "https://www.edualttech.com",
            "logo": "https://www.edualttech.com/logo.png",
            "description": "Learning Resources, Courses, AI Tools and School Technology Solutions",
            "sameAs": [
              "https://in.linkedin.com/company/edu-alt-tech",
              "https://www.instagram.com/edu_alt_tech/"
            ]
          })}
        </script>
      </Helmet>
      
      <div className="text-slate-900 overflow-hidden min-h-screen relative">
        <HeroSection />
        <WhyEduAlt />
        <FeaturedPrograms />
        <ResourcesSection />
        <ProcessSection />
        <SchoolTechSolutions />
        <StatsSection />
        <CTASection />
      </div>
    </>
  );
};

export default Home;
