import polyfills from './polyfills';
import detectTouch from './detectTouch';
import MainSlider from './mainSliderNew';
import IntroSlider from './introSlider';
import AnchorLinks from './anchorLinks';
import SectionsParallax from './sectionsParallax';
import CasesFiltering from './casesFiltering';
import Orb from './orb';
import ExpertiseSlider from './expertiseSlider';

document.addEventListener('DOMContentLoaded', function() {
    polyfills();
    detectTouch();
    IntroSlider();
    AnchorLinks();
    SectionsParallax();
    CasesFiltering();
    Orb();
    ExpertiseSlider();
    window.mainSlider = new MainSlider(document.querySelector('.js-main-slider'));


});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
