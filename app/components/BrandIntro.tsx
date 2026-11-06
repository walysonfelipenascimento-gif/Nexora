"use client";

import { useEffect, useState } from "react";

const INTRO_DURATION = 10500;

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
    <div className="nexora-brand-intro" role="status" aria-label="Boas-vindas à Nexora">
      <style jsx>{`
        .nexora-brand-intro{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:#03040c;color:#fff;font-family:Inter,system-ui,sans-serif;animation:introExit 10.5s ease forwards}
        .space-depth{position:absolute;inset:-20%;background:radial-gradient(ellipse at 50% 48%,#101b3c 0%,#080b1c 34%,#03040c 72%);animation:spaceDrift 10s ease-in-out both}
        .starfield{position:absolute;inset:-35%;opacity:.68;background-image:radial-gradient(1px 1px at 8% 18%,#fff 98%,transparent),radial-gradient(2px 2px at 24% 72%,#b9eaff 98%,transparent),radial-gradient(1px 1px at 43% 31%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 68% 19%,#d9c8ff 98%,transparent),radial-gradient(1px 1px at 83% 66%,#fff 98%,transparent),radial-gradient(2px 2px at 91% 38%,#a8f4ff 98%,transparent),radial-gradient(1px 1px at 56% 83%,#fff 98%,transparent);background-size:310px 270px;animation:starTravel 10.5s cubic-bezier(.2,.7,.2,1) both}
        .aurora{position:absolute;inset:-34% -24%;pointer-events:none;filter:blur(30px);mix-blend-mode:screen;transform-origin:50% 50%}
        .aurora:before,.aurora:after{content:"";position:absolute;inset:0;border-radius:50%;transform:rotate(-17deg) scaleY(.56);background:conic-gradient(from 195deg at 50% 50%,transparent 0deg,#087bff25 34deg,#00d9f56b 58deg,#7045ff99 88deg,#e52bce88 117deg,transparent 157deg,transparent 360deg);mask-image:radial-gradient(ellipse at 50% 48%,transparent 0 17%,#000 33%,#000 48%,transparent 69%);animation:auroraFlow 9s cubic-bezier(.22,.7,.18,1) both}
        .aurora:after{inset:8% -12%;filter:blur(18px);opacity:.8;transform:rotate(18deg) scaleY(.42);background:conic-gradient(from 12deg at 50% 50%,transparent 0deg,#00d9f55c 45deg,#087bff91 72deg,#7045ffb0 104deg,#e52bce80 132deg,transparent 175deg,transparent 360deg);animation:auroraFlowBack 10s ease-in-out both}
        .aurora-ribbon{position:absolute;left:-35%;right:-35%;height:42%;top:18%;border-radius:50%;border-top:2px solid #57eaff66;filter:blur(7px);box-shadow:0 -15px 65px #087bff30,0 -35px 110px #7045ff35;transform:rotate(-13deg) scaleX(.7);animation:ribbonPass 8.8s cubic-bezier(.2,.7,.2,1) both}
        .aurora-ribbon.second{top:38%;height:36%;border-color:#d75bff70;transform:rotate(12deg) scaleX(.8);animation:ribbonPassTwo 9.5s cubic-bezier(.2,.7,.2,1) both}
        .light-tunnel{position:absolute;inset:-40%;opacity:0;background:repeating-radial-gradient(ellipse at center,transparent 0 7%,#44dfff0c 7.2% 7.35%,transparent 7.7% 14%);transform:scale(.45);animation:tunnelTravel 7.5s 1s ease-in-out both}
        .vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 8%,#03040c36 48%,#03040ce8 100%);pointer-events:none}
        .intro-core{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;max-width:620px;opacity:0;transform:translateY(20px) scale(.96);animation:arrival 2.2s 5.2s cubic-bezier(.16,.8,.2,1) forwards}
        .intro-logo-wrap{width:clamp(92px,22vw,136px);height:clamp(92px,22vw,136px);display:grid;place-items:center;position:relative;margin-bottom:8px}
        .intro-logo-wrap:before,.intro-logo-wrap:after{content:"";position:absolute;inset:0;border:1px solid #65dfff70;border-radius:34%;transform:rotate(45deg);box-shadow:0 0 30px #087bff35,inset 0 0 25px #7045ff20;animation:logoOrbit 13s linear infinite}
        .intro-logo-wrap:after{inset:12px;border-color:#d75bff70;border-radius:40%;transform:rotate(0);animation-direction:reverse;animation-duration:17s}
        .intro-logo{width:72%;height:72%;object-fit:contain;filter:drop-shadow(0 0 18px #5e74ff99) drop-shadow(0 0 42px #00d9f566);animation:logoBreathe 3.8s ease-in-out infinite alternate}
        .intro-fallback{font-size:clamp(60px,15vw,100px);font-weight:950;line-height:1;background:linear-gradient(120deg,#087bff,#00d9f5 34%,#7045ff 68%,#e52bce);background-clip:text;-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 24px #6b71ff)}
        .intro-title{font-size:clamp(34px,9vw,58px);font-weight:950;letter-spacing:clamp(5px,2vw,11px);margin-top:12px;background:linear-gradient(100deg,#087bff 0%,#00d9f5 32%,#7045ff 68%,#e52bce 100%);background-clip:text;-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 26px #765bff70);animation:titleShimmer 4s ease-in-out infinite alternate}
        .intro-tag{font-size:clamp(9px,2.5vw,12px);letter-spacing:2px;text-transform:uppercase;color:#c0c9e8;margin-top:12px;line-height:1.8}
        .intro-rule{width:112px;height:2px;border-radius:4px;margin:25px 0 22px;background:linear-gradient(90deg,#087bff,#00d9f5,#7045ff,#e52bce);box-shadow:0 0 20px #7a76ff;transform:scaleX(0);animation:ruleReveal 1s 6s ease forwards}
        .intro-welcome{font-size:clamp(15px,4vw,21px);font-weight:650;letter-spacing:.01em;color:#f7f8ff;text-shadow:0 0 22px #5f80ff55;opacity:0;animation:welcomeReveal 1.2s 6.25s ease forwards}
        .intro-welcome strong{font-weight:850;background:linear-gradient(100deg,#64eaff,#a18aff 58%,#f17ce1);background-clip:text;-webkit-background-clip:text;color:transparent}
        .intro-caption{font-size:10px;letter-spacing:2px;color:#9ca8cf;margin-top:19px;text-transform:uppercase;opacity:0;animation:welcomeReveal 1.2s 6.7s ease forwards}
        .intro-skip{position:absolute;z-index:4;right:16px;bottom:18px;border:1px solid #ffffff35;background:#0b0c1bd9;color:#e8eaff;border-radius:999px;padding:10px 15px;font-size:11px;cursor:pointer;backdrop-filter:blur(12px);opacity:0;animation:welcomeReveal .7s 2s ease forwards}
        @keyframes spaceDrift{0%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes starTravel{0%{transform:scale(.72);opacity:.15}45%{opacity:.8}100%{transform:scale(1.5) translate3d(0,5%,0);opacity:.55}}
        @keyframes auroraFlow{0%{transform:translate3d(-13%,12%,0) rotate(-27deg) scale(.5,.25);opacity:0}25%{opacity:.9}65%{transform:translate3d(5%,-2%,0) rotate(-8deg) scale(1.18,.78);opacity:1}100%{transform:translate3d(0,0,0) rotate(0) scale(1.5,.95);opacity:.28}}
        @keyframes auroraFlowBack{0%{transform:translate3d(14%,-8%,0) rotate(30deg) scale(.4,.2);opacity:0}35%{opacity:.8}75%{transform:translate3d(-4%,3%,0) rotate(4deg) scale(1.2,.7);opacity:1}100%{transform:translate3d(0,0,0) rotate(-5deg) scale(1.35,.8);opacity:.25}}
        @keyframes ribbonPass{0%{transform:translate3d(-20%,35%,0) rotate(-24deg) scaleX(.3);opacity:0}35%{opacity:.9}100%{transform:translate3d(18%,-10%,0) rotate(-8deg) scaleX(1.4);opacity:0}}
        @keyframes ribbonPassTwo{0%{transform:translate3d(20%,-25%,0) rotate(25deg) scaleX(.35);opacity:0}40%{opacity:.8}100%{transform:translate3d(-12%,12%,0) rotate(7deg) scaleX(1.35);opacity:0}}
        @keyframes tunnelTravel{0%{opacity:0;transform:scale(.35) rotate(-8deg)}35%{opacity:.6}100%{opacity:0;transform:scale(1.65) rotate(8deg)}}
        @keyframes arrival{0%{opacity:0;transform:translateY(24px) scale(.92);filter:blur(12px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
        @keyframes logoOrbit{to{transform:rotate(405deg)}}
        @keyframes logoBreathe{from{filter:drop-shadow(0 0 12px #5e74ff66)}to{filter:drop-shadow(0 0 30px #00d9f5aa) drop-shadow(0 0 52px #7045ff77)}}
        @keyframes titleShimmer{from{filter:brightness(.92)}to{filter:brightness(1.3)}}
        @keyframes ruleReveal{to{transform:scaleX(1)}}
        @keyframes welcomeReveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes introExit{0%,87%{opacity:1}100%{opacity:0;visibility:hidden;pointer-events:none}}
        @media(prefers-reduced-motion:reduce){.nexora-brand-intro,.space-depth,.starfield,.aurora:before,.aurora:after,.aurora-ribbon,.light-tunnel,.intro-core,.intro-logo,.intro-logo-wrap:before,.intro-logo-wrap:after,.intro-title,.intro-rule,.intro-welcome,.intro-caption,.intro-skip{animation:none!important;opacity:1!important;transform:none!important}}
      `}</style>
      <div className="space-depth" />
      <div className="starfield" />
      <div className="aurora" />
      <div className="aurora-ribbon" />
      <div className="aurora-ribbon second" />
      <div className="light-tunnel" />
      <div className="vignette" />
      <div className="intro-core">
        <div className="intro-logo-wrap">
          {logoFailed ? <div className="intro-fallback" aria-label="Símbolo Nexora">N</div> : <img className="intro-logo" src="/nexora-logo.svg" alt="Símbolo oficial da Nexora" onError={() => setLogoFailed(true)} />}
        </div>
        <div className="intro-title">NEXORA</div>
        <div className="intro-tag">Conectando pessoas, marcas<br />e oportunidades</div>
        <div className="intro-rule" />
        <div className="intro-welcome">Olá, seja bem-vindo à <strong>Nexora</strong>.</div>
        <div className="intro-caption">Seu universo de conexões começa aqui</div>
      </div>
      <button className="intro-skip" onClick={() => setVisible(false)}>Entrar na Nexora ↗</button>
    </div>
  );
}
