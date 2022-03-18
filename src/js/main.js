import polyfills from './polyfills';
import detectTouch from './detectTouch';
import imagesLoaded from 'imagesloaded';
import IntroSlider from './introSlider';
import AnchorLinks from './anchorLinks';
import SectionsParallax from './sectionsParallax';
import CasesFiltering from './casesFiltering';
import Orb from './orb';
import ExpertiseSlider from './expertiseSlider';
import Menu from './menu';
import HeaderHovers from './headerHovers';

import ContactUsModal from './contactUsModal';
import FixedFooter from './fixedFooter';
import ContactLink from './contactLink';
import FixedHeader from './fixedHeader';
import MobileContactLink from './mobileContactLink';
import FileUpload from './fileUpload';
import FixedContactsSidebar from './fixedContactsSidebar';
import Validation from './validation';
import PhoneMask from './phoneMask';
import RefreshScroll from './refreshScroll';
import setScrollbarWidth from './setScrollbarWidth';
import newsSlider from './newsSlider';
import introSliderDrag from './introSliderDrag';
import blocksReveal from './blocksReveal';



document.addEventListener('DOMContentLoaded', function() {
    polyfills();
    detectTouch();
    introSliderDrag();
    IntroSlider();
    AnchorLinks();
    FixedFooter();
    SectionsParallax();
    CasesFiltering();
    Orb();
    ExpertiseSlider();
    Menu();
    HeaderHovers();
    
    ContactUsModal();
   
    ContactLink();
    FixedHeader();
    MobileContactLink();
    FileUpload();
    FixedContactsSidebar();
    Validation();
    PhoneMask();
    RefreshScroll();
    setScrollbarWidth();
    newsSlider();
    blocksReveal();

  
  

    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        const imgLoaded = imagesLoaded(document.querySelector('.page-content'));

        imgLoaded.on('always', () => {
            $('.page-header').midnight();    
        });
    }

});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
