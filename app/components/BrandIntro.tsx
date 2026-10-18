"use client";

import { useEffect, useState } from "react";

const INTRO_DURATION = 180000;

export default function BrandIntro() {
  const [visible, setVisible] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("nexora-intro-seen") === "1") return;
      window.sessionStorage.setItem("nexora-intro-seen", "1");
    } catch {}
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="nexora-brand-intro" role="status" aria-label="Apresentação Nexora">
      <style jsx>{`
        .nexora-brand-intro{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#050610;color:#fff;font-family:Inter,system-ui,sans-serif;animation:introFade 180s linear forwards}
        .nexora-brand-intro:before{content:"";position:absolute;inset:-55%;background:conic-gradient(from 0deg,transparent 0 12%,#22d3ee42 20%,#4568ff55 34%,#a855f75a 49%,#ed4acb50 64%,#22d3ee42 78%,transparent 88%);filter:blur(65px);animation:colorSpin 24s linear infinite}
        .nexora-brand-intro:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 10%,#050610b5 76%);pointer-events:none}
        .intro-core{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;max-width:620px;animation:logoRise 2.4s cubic-bezier(.2,.8,.2,1) both}
        .intro-logo-wrap{width:clamp(100px,24vw,150px);height:clamp(100px,24vw,150px);display:grid;place-items:center;position:relative;margin-bottom:10px}
        .intro-logo-wrap:before,.intro-logo-wrap:after{content:"";position:absolute;inset:0;border:1px solid #6e86ff75;border-radius:32%;animation:ringOrbit 9s linear infinite}
        .intro-logo-wrap:after{inset:12px;border-color:#e16bff65;border-radius:40%;animation-direction:reverse;animation-duration:13s}
        .intro-logo{width:72%;height:72%;object-fit:contain;filter:drop-shadow(0 0 18px #5e74ff99) drop-shadow(0 0 40px #9c68ff55);animation:logoGlow 4s ease-in-out infinite alternate}
        .intro-fallback{font-size:clamp(60px,15vw,100px);font-weight:950;line-height:1;background:linear-gradient(135deg,#4df5e6,#5e91ff 45%,#b86bff 72%,#f36acb);background-clip:text;-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 24px #6b71ff)}
        .intro-title{font-size:clamp(34px,9vw,58px);font-weight:950;letter-spacing:clamp(5px,2vw,11px);margin-top:14px;background:linear-gradient(100deg,#4df5e6,#5e91ff 45%,#b86bff 72%,#f36acb);background-clip:text;-webkit-background-clip:text;color:transparent;text-shadow:0 0 32px #7d72ff55;animation:titlePulse 4s ease-in-out infinite alternate}
        .intro-tag{font-size:clamp(9px,2.5vw,12px);letter-spacing:2px;text-transform:uppercase;color:#b8c2e8;margin-top:12px;line-height:1.8}
        .intro-rule{width:100px;height:2px;border-radius:4px;margin:28px 0;background:linear-gradient(90deg,#25e8e0,#6176ff,#d75df5);box-shadow:0 0 18px #7a76ff;animation:ruleGrow 2s .3s both}
        .intro-profile{display:flex;align-items:center;gap:13px;text-align:left;padding:14px 18px;border:1px solid #8e88ff70;border-radius:18px;background:linear-gradient(120deg,#ffffff0d,#6e60ff12);backdrop-filter:blur(18px);box-shadow:0 0 28px #6e60ff18,0 18px 60px #0008;animation:profileGlow 3.5s ease-in-out infinite alternate}
        .intro-avatar{width:46px;height:46px;flex:0 0 46px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#2de7dc,#725cff 65%,#db5ce8);padding:2px;box-shadow:0 0 18px #7c70ff77}
        .intro-avatar span{width:100%;height:100%;display:grid;place-items:center;border-radius:50%;background:#10101e;color:#d9faff;font-size:19px;font-weight:900}
        .intro-name{font-size:clamp(13px,3.4vw,17px);font-weight:900;color:#fff;text-shadow:0 0 5px #fff,0 0 12px #38e8ff,0 0 26px #6d76ff,0 0 42px #bd54ff;animation:nameNeon 2.2s ease-in-out infinite alternate}
        .intro-handle{font-size:11px;color:#c3c9e7;margin-top:6px;line-height:1.5}
        .intro-dot{width:6px;height:6px;border-radius:50%;background:#4be6c1;display:inline-block;margin-right:7px;box-shadow:0 0 9px #4be6c1}
        .intro-caption{font-size:10px;letter-spacing:2px;color:#888fb8;margin-top:26px;text-transform:uppercase;animation:captionBreath 5s ease-in-out infinite}
        .intro-skip{position:absolute;z-index:3;right:16px;bottom:18px;border:1px solid #ffffff45;background:#0b0c1bd9;color:#e8eaff;border-radius:999px;padding:10px 15px;font-size:11px;cursor:pointer;backdrop-filter:blur(12px)}
        @keyframes colorSpin{to{transform:rotate(360deg)}}@keyframes ringOrbit{to{transform:rotate(360deg)}}@keyframes logoRise{from{opacity:0;transform:translateY(30px) scale(.9);filter:blur(8px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}@keyframes logoGlow{from{filter:drop-shadow(0 0 12px #5e74ff55)}to{filter:drop-shadow(0 0 32px #9c68ffcc) drop-shadow(0 0 50px #22d3ee44)}}@keyframes titlePulse{from{filter:brightness(.9);letter-spacing:5px}to{filter:brightness(1.3);letter-spacing:clamp(6px,2.3vw,13px)}}@keyframes ruleGrow{from{transform:scaleX(.1);opacity:0}to{transform:scaleX(1);opacity:1}}@keyframes profileGlow{from{border-color:#8e88ff50;box-shadow:0 0 16px #6e60ff10,0 18px 60px #0008}to{border-color:#42e8ff99;box-shadow:0 0 30px #6e60ff35,0 18px 60px #0008}}@keyframes nameNeon{from{text-shadow:0 0 4px #fff,0 0 10px #38e8ff,0 0 18px #6d76ff}to{text-shadow:0 0 7px #fff,0 0 16px #38e8ff,0 0 30px #6d76ff,0 0 45px #bd54ff}}@keyframes captionBreath{0%,100%{opacity:.55}50%{opacity:1}}@keyframes introFade{0%,99.4%{opacity:1}100%{opacity:0;visibility:hidden}}
        @media(prefers-reduced-motion:reduce){.nexora-brand-intro,.nexora-brand-intro:before,.intro-core,.intro-logo,.intro-logo-wrap:before,.intro-logo-wrap:after,.intro-title,.intro-profile,.intro-name,.intro-caption,.intro-rule{animation:none!important}}
      `}</style>
      <div className="intro-core">
        <div className="intro-logo-wrap">
          {logoFailed ? <div className="intro-fallback" aria-label="Símbolo Nexora">N</div> : <img className="intro-logo" src="/nexora-logo.svg" alt="Símbolo oficial da Nexora" onError={() => setLogoFailed(true)} />}
        </div>
        <div className="intro-title">NEXORA</div>
        <div className="intro-tag">Conectando pessoas, marcas<br />e oportunidades</div>
        <div className="intro-rule" />
        <div className="intro-profile">
          <div className="intro-avatar" aria-label="Símbolo de perfil, sem fotografia"><span aria-hidden="true">L</span></div>
          <div><div className="intro-name"><span className="intro-dot" />@Licinhosz.bb</div><div className="intro-handle">Walyson Felipe do Nascimento Silva</div></div>
        </div>
        <div className="intro-caption">Uma nova experiência começa agora</div>
      </div>
      <button className="intro-skip" onClick={() => setVisible(false)}>Entrar na Nexora ↗</button>
    </div>
  );
}
