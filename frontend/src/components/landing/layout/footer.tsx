'use client';

export default function Footer() {
  return (
    <footer className="border-t border-landing-text/8 py-10 px-[clamp(24px,6vw,80px)] max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4 max-sm:flex-col max-sm:text-center">
      <div className="flex items-center gap-2.5 text-landing-muted-light text-[0.8rem]">
        <svg viewBox="0 0 28 28" fill="none" width={20} height={20}>
          <rect width="28" height="28" rx="7" fill="currentColor" className="text-landing-blue"/>
          <path d="M8 11h5v8H8v-8zm7-2h5v10h-5V9z" fill="white" opacity="0.9"/>
          <rect x="8" y="8" width="12" height="2" rx="1" fill="white" opacity="0.5"/>
        </svg>
        <span>FurnishVista</span>
      </div>
      <div className="text-[0.75rem] text-landing-muted-light font-light">
        PUSL3122 HCI, Computer Graphics &amp; Visualization
      </div>
    </footer>
  );
}