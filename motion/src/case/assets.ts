import {staticFile} from 'remotion';

/* Real captures of editlobby.com, taken 8 October 2026 in headless Chromium
   by scripts/capture-site.js. Nothing is recreated: every frame is the live
   site rendered by a browser. */
export const EL = {
  desktopHero: 'el/desktop_hero.jpg',          // 1920x1080 viewport
  desktopFull: 'el/desktop_full.jpg',          // 1920x10429 full page
  mobileHero: 'el/mobile_hero.jpg',            // 780x1688, 390x844 at 2x
  mobileFull: 'el/mobile_full.jpg',            // 780x23220
  desktopEnter: {dir: 'el/desktop_enter', n: 90},
  desktopScroll: {dir: 'el/desktop_scroll', n: 360},
  mobileEnter: {dir: 'el/mobile_enter', n: 60},
  mobileScroll: {dir: 'el/mobile_scroll', n: 240},
  before: 'p_el_pre.jpg',                      // the previous site, 1016x1176
  after: 'p_el.jpg',                           // the rebuilt site, 1016x1176
};

export const seqFrame = (s: {dir: string; n: number}, i: number) =>
  staticFile(`${s.dir}/f${String(Math.max(0, Math.min(s.n - 1, Math.round(i)))).padStart(4, '0')}.jpg`);

/* Report regions, as fractions of each capture, read from the previous
   film's Scene02EditLobby so the rings land on the same pixels. */
export const REPORT = {
  jul: 'e1_jul.jpg', aug: 'e2_aug.jpg', chart: 'e3_chart.jpg', video: 'e4_video.jpg',
  cwv: 'e5_cwv.jpg', session: 'e6_session.jpg', sources: 'e7_sources.jpg',
  R_JUL_VALUE: [0.012, 0.512, 0.142, 0.628] as const,
  R_AUG_VALUE: [0.012, 0.512, 0.12, 0.628] as const,
  R_VID_JUL: [0.79, 0.4, 0.955, 0.475] as const,
  R_VID_AUG: [0.832, 0.496, 0.952, 0.57] as const,
  R_CWV_LCP: [0.065, 0.348, 0.308, 0.505] as const,
  R_CWV_PASS: [0.02, 0.01, 0.735, 0.125] as const,
  R_SES_27: [0.868, 0.058, 0.978, 0.13] as const,
};
