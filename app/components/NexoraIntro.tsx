"use client";

import { useEffect, useState } from "react";

export default function NexoraIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("nexora-cinematic-intro-seen") === "1") return;
      sessionStorage.setItem("nexora-cinematic-intro-seen", "1");
    } catch {
      // If session storage is unavailable, the intro still runs for this visit.
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 10_000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="nexora-cinematic-intro" role="status" aria-label="Bem-vindo à Nexora">
      <div className="nci-stars" aria-hidden="true" />
      <div className="nci-orbit nci-orbit-one" aria-hidden="true" />
      <div className="nci-orbit nci-orbit-two" aria-hidden="true" />
      <div className="nci-core" aria-hidden="true" />
      <div className="nci-content">
        <div className="nci-symbol-wrap">
          <span className="nci-aura" />
          <img src="/nexora-logo.svg" alt="" className="nci-symbol" />
        </div>
        <div className="nci-wordmark">NEXORA</div>
        <div className="nci-line" />
        <p className="nci-slogan">Conectando pessoas, marcas e oportunidades.</p>
      </div>
      <div className="nci-bottom">UM NOVO UNIVERSO SOCIAL</div>
      <style jsx>{`
        .nexora-cinematic-intro{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;overflow:hidden;background:#03040b;color:#fff;isolation:isolate;animation:nci-exit 10s cubic-bezier(.65,0,.35,1) forwards}
        .nci-stars{position:absolute;inset:-20%;background-image:radial-gradient(circle,#dffaff 0 1px,transparent 1.7px),radial-gradient(circle,#7b9bff 0 1px,transparent 1.8px);background-size:67px 67px,113px 113px;background-position:0 0,31px 48px;opacity:0;animation:nci-stars 8s ease-out forwards}
        .nci-core{position:absolute;width:min(80vw,680px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#087ffb22 0%,#623bdb18 36%,#080b1b00 70%);filter:blur(12px);animation:nci-core 8s ease-out both}
        .nci-orbit{position:absolute;width:min(68vw,490px);aspect-ratio:1;border:1px solid #56dcff30;border-radius:50%;box-shadow:0 0 40px #168aff12,inset 0 0 35px #774dff0b;opacity:0;transform:scale(.5) rotate(-25deg)}
        .nci-orbit-one{animation:nci-orbit 5s cubic-bezier(.16,1,.3,1) .5s forwards}
        .nci-orbit-two{width:min(88vw,620px);border-color:#a16aff20;transform:scale(.7) rotate(38deg);animation:nci-orbit 5.8s cubic-bezier(.16,1,.3,1) .8s forwards}
        .nci-content{position:relative;z-index:2;display:flex;align-items:center;flex-direction:column;text-align:center;padding:24px;animation:nci-content 9.5s ease both}
        .nci-symbol-wrap{position:relative;display:grid;place-items:center;width:clamp(105px,25vw,170px);height:clamp(105px,25vw,170px);margin-bottom:15px}
        .nci-aura{position:absolute;inset:3%;border-radius:34%;background:conic-gradient(from 30deg,#00d9ff,#6b5bff,#e53dff,#00d9ff);filter:blur(25px);opacity:0;animation:nci-aura 4.8s ease-out .4s forwards}
        .nci-symbol{position:relative;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 0 12px #00cfff88) drop-shadow(0 0 35px #794cff66);opacity:0;transform:scale(.45) rotate(-9deg);animation:nci-logo 2.2s cubic-bezier(.16,1,.3,1) .55s forwards}
        .nci-wordmark{font-size:clamp(29px,8vw,54px);font-weight:900;letter-spacing:.27em;padding-left:.27em;line-height:1.15;background:linear-gradient(100deg,#f7ffff 5%,#69eaff 36%,#9a83ff 68%,#f5a5ff 95%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 19px #2bbdff48);opacity:0;transform:translateY(16px);animation:nci-word 1.5s cubic-bezier(.16,1,.3,1) 2.15s forwards}
        .nci-line{height:2px;width:0;margin:21px 0 15px;background:linear-gradient(90deg,transparent,#00d9ff,#9d70ff,#ff7af2,transparent);box-shadow:0 0 16px #35bfff88;animation:nci-line 1.4s ease 3s forwards}
        .nci-slogan{max-width:290px;margin:0;color:#d5d9f3;font-size:clamp(12px,3.2vw,15px);letter-spacing:.045em;line-height:1.6;opacity:0;animation:nci-slogan 1.2s ease 3.65s forwards}
        .nci-bottom{position:absolute;bottom:max(26px,env(safe-area-inset-bottom));font-size:9px;letter-spacing:.34em;color:#7782a8;opacity:0;animation:nci-bottom 1s ease 4.3s forwards}
        @keyframes nci-stars{0%{opacity:0;transform:scale(.8)}35%{opacity:.7}100%{opacity:.24;transform:scale(1.15)}}
        @keyframes nci-core{0%{transform:scale(.25);opacity:0}45%{opacity:1}100%{transform:scale(1.5);opacity:.65}}
        @keyframes nci-orbit{0%{opacity:0;transform:scale(.45) rotate(-25deg)}45%{opacity:.9}100%{opacity:.45;transform:scale(1.12) rotate(22deg)}}
        @keyframes nci-aura{0%{opacity:0;transform:scale(.55) rotate(0)}60%{opacity:.75}100%{opacity:.28;transform:scale(1.2) rotate(80deg)}}
        @keyframes nci-logo{0%{opacity:0;transform:scale(.45) rotate(-9deg)}70%{opacity:1;transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
        @keyframes nci-word{to{opacity:1;transform:translateY(0)}}
        @keyframes nci-line{to{width:min(66vw,280px)}}
        @keyframes nci-slogan{to{opacity:1;transform:translateY(0)}}
        @keyframes nci-bottom{to{opacity:.8}}
        @keyframes nci-content{0%,88%{filter:brightness(1)}100%{filter:brightness(1.16)}}
        @keyframes nci-exit{0%,86%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden;pointer-events:none}}
        @media(prefers-reduced-motion:reduce){.nexora-cinematic-intro,.nexora-cinematic-intro *{animation-duration:1ms!important;animation-delay:0ms!important}}
      `}</style>
    </div>
  );
}
