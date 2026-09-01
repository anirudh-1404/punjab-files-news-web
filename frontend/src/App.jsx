import React from 'react';
import Header from './components/Header/Header';
import ParallaxHero from './components/Hero/ParallaxHero';
import BreakingNews from './components/Hero/BreakingNews';
import LiveTVHeroModule from './components/Modules/LiveTVHeroModule';
import WorldNewsModule from './components/Modules/WorldNewsModule';
import NationalNewsModule from './components/Modules/NationalNewsModule';
import TVScheduleBanner from './components/Modules/TVScheduleBanner';
import LocalNewsModule from './components/Modules/LocalNewsModule';
import FeaturedAirShowModule from './components/Modules/FeaturedAirShowModule';
import TeamParallaxModule from './components/Modules/TeamParallaxModule';
import HomeGalleryModule from './components/Modules/HomeGalleryModule';
import WorldwideNewsModule from './components/Modules/WorldwideNewsModule';
import VideoFeatureModule from './components/Modules/VideoFeatureModule';
import RethinkingNewsModule from './components/Modules/RethinkingNewsModule';
import HealthAndSchoolModule from './components/Modules/HealthAndSchoolModule';
import BottomCarouselModule from './components/Modules/BottomCarouselModule';
import Footer from './components/Footer/Footer';
import Copyrights from './components/Footer/Copyrights';
import ScrollToTop from './components/Footer/ScrollToTop';

export default function App() {
  return (
    <div id="wrapper" data-color="red">
      {/* Header */}
      <Header />

      {/* Main Content Section */}
      <section id="main-section">
        {/* Parallax Hero */}
        <ParallaxHero />

        {/* Breaking News */}
        <section className="module" style={{ paddingBottom: '0' }}>
          <div className="container">
            <BreakingNews />
          </div>
        </section>

        {/* Dedicated Top LIVE TV Video + Featured News Section */}
        <LiveTVHeroModule />

        {/* World News 2-Col Module */}
        <WorldNewsModule />

        {/* National News + Sidebar Newsfeed */}
        <NationalNewsModule />

        {/* TV Schedule Dark Banner */}
        <TVScheduleBanner />

        {/* Local News + Category Links + Recent Posts */}
        <LocalNewsModule />

        {/* Featured Air Show + 3-Column Media Blocks */}
        <FeaturedAirShowModule />

        {/* Team Introduction Parallax + Banner */}
        <TeamParallaxModule />

        {/* Big Home Gallery Carousel */}
        <HomeGalleryModule />

        {/* Worldwide Broadcast News Grid */}
        <WorldwideNewsModule />

        {/* Video Feature & Live Studio Module */}
        <VideoFeatureModule />

        {/* Rethinking 24h News Parallax Feature */}
        <RethinkingNewsModule />

        {/* Health, School, Business, Travel 4-Col Matrix */}
        <HealthAndSchoolModule />

        {/* Bottom Multi-Slide Carousel */}
        <BottomCarouselModule />
      </section>

      {/* Footer */}
      <Footer />

      {/* Copyrights */}
      <Copyrights />

      {/* Back to Top */}
      <ScrollToTop />
    </div>
  );
}
