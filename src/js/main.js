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
import StoriesSlider from './storiesSlider';
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

document.addEventListener('DOMContentLoaded', function() {
    polyfills();
    detectTouch();
    IntroSlider();
    AnchorLinks();
    SectionsParallax();
    CasesFiltering();
    Orb();
    ExpertiseSlider();
    Menu();
    HeaderHovers();
    StoriesSlider();
    ContactUsModal();
    FixedFooter();
    ContactLink();
    FixedHeader();
    MobileContactLink();
    FileUpload();
    FixedContactsSidebar();
    Validation();
    PhoneMask();
    RefreshScroll();
    
    const imgLoaded = imagesLoaded(document.querySelector('.page-content'));

    imgLoaded.on('always', () => {
        if (!window.matchMedia('(max-width: 640px)').matches) {
            $('.page-header').midnight();    
        }
    });

});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
