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
    
    const imgLoaded = imagesLoaded(document.querySelector('.page-content'));

    imgLoaded.on('always', () => {
        $('.page-header').midnight();    
    });

});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
