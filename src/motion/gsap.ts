/**
 * Registro único de GSAP y sus plugins · docs/motion.md v3.0 §1.
 * Ningún componente importa `gsap` directo: todo sale de acá.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { dur, ease } from './tokens';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase);
gsap.defaults({ duration: dur.base, ease: ease.out });

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, CustomEase };
