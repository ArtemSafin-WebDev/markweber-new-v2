import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export default function RefreshScroll() {
    window.refreshScroll = () => {
        ScrollTrigger.refresh();
    }
}