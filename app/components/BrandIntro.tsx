"use client";

import { useEffect, useState } from "react";

export default function BrandIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("nexora-intro-seen") === "1") return;
      window.sessionStorage.setItem("nexora-intro-seen", "1");
    } catch {}
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="nexora-brand-intro" role="status" aria-label="Nexora">
      <style jsx>{`
        .nexora-brand-intro{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#070811;color:#fff;animation:introFade 2.8s ease forwards;font-family:Inter,system-ui,sans-serif}
        .nexora-brand-intro:before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent 0 18%,#22d3ee35 26%,#4568ff42 38%,#a855f745 50%,#ed4acb38 62%,transparent 75%);filter:blur(55px);animation:colorSpin 3.8s linear infinite}
        .intro-core{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;animation:logoRise .85s cubic-bezier(.2,.8,.2,1) both}
        .intro-logo{width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 0 28px #5e74ff77);animation:logoGlow 1.8s ease-in-out infinite alternate}
        .intro-title{font-size:clamp(29px,8vw,43px);font-weight:900;letter-spacing:5px;margin-top:16px;background:linear-gradient(100deg,#4df5e6,#5e91ff 45%,#b86bff 72%,#f36acb);background-clip:text;-webkit-background-clip:text;color:transparent}
        .intro-tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aeb4d2;margin-top:7px}
        .intro-rule{width:84px;height:2px;border-radius:4px;margin:24px 0;background:linear-gradient(90deg,#25e8e0,#6176ff,#d75df5);animation:ruleGrow .8s .25s both}
        .intro-profile{display:flex;align-items:center;gap:11px;text-align:left;padding:11px 15px;border:1px solid #ffffff20;border-radius:16px;background:#ffffff09;backdrop-filter:blur(14px);box-shadow:0 12px 44px #0005}
        .intro-avatar{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#2de7dc,#725cff 65%,#db5ce8);padding:2px}
        .intro-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#111}
        .intro-name{font-size:13px;font-weight:800;color:#fff}
        .intro-handle{font-size:11px;color:#b7bdd5;margin-top:4px}
        .intro-dot{width:6px;height:6px;border-radius:50%;background:#4be6c1;display:inline-block;margin-right:5px;box-shadow:0 0 9px #4be6c1}
        @keyframes colorSpin{to{transform:rotate(360deg)}}@keyframes logoRise{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes logoGlow{from{filter:drop-shadow(0 0 14px #5e74ff44)}to{filter:drop-shadow(0 0 30px #9c68ff99)}}@keyframes ruleGrow{from{transform:scaleX(.1);opacity:0}to{transform:scaleX(1);opacity:1}}@keyframes introFade{0%,75%{opacity:1}100%{opacity:0;visibility:hidden}}
        @media(prefers-reduced-motion:reduce){.nexora-brand-intro,.nexora-brand-intro:before,.intro-core,.intro-logo,.intro-rule{animation-duration:.01ms!important;animation-iteration-count:1!important}}
      `}</style>
      <div className="intro-core">
        <img className="intro-logo" src="/nexora-logo.svg" alt="Logo Nexora" />
        <div className="intro-title">NEXORA</div>
        <div className="intro-tag">Conectando pessoas, marcas e oportunidades</div>
        <div className="intro-rule" />
        <div className="intro-profile">
          <div className="intro-avatar"><span aria-hidden="true">L</span></div>
          <div><div className="intro-name"><span className="intro-dot" />@Licinhosz.bb</div><div className="intro-handle">Walyson Felipe do Nascimento Silva</div></div>
        </div>
      </div>
    </div>
  );
}
