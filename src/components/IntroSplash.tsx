'use client';

import { useEffect, useState } from 'react';

type IntroSplashProps = {
  children: React.ReactNode;
};

export default function IntroSplash({ children }: IntroSplashProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reducedMotion) {
      setShowSplash(false);
      setShowApp(true);
      return;
    }

    setShowSplash(true);

    const t1 = window.setTimeout(() => {
      setShowSplash(false);
      setShowApp(true);
    }, 650);

    return () => window.clearTimeout(t1);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="intro-splash" aria-hidden>
          <div className="intro-splash-logo">
            <img src="/assets/logo.svg" alt="" className="intro-splash-logo-img" />
          </div>
        </div>
      )}

      <div className={showApp ? 'intro-app intro-app-visible' : 'intro-app'}>{children}</div>
    </>
  );
}
