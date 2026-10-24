"use client";

import { useState } from "react";
import Link from "next/link";

export default function PulseGlobalFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="nexora-pulse-float" aria-label="Acesso rápido ao Pulse e ao Global">
      {open && (
        <div className="nexora-pulse-float-menu">
          <Link href="/pulse" onClick={() => setOpen(false)} className="nexora-pulse-float-option">
            <span className="nexora-pulse-float-icon pulse">✦</span>
            <span><strong>Nexora Pulse</strong><small>Conexões e interação</small></span>
            <span className="nexora-pulse-float-arrow">↗</span>
          </Link>
          <Link href="/global" onClick={() => setOpen(false)} className="nexora-pulse-float-option">
            <span className="nexora-pulse-float-icon global">◎</span>
            <span><strong>Global</strong><small>Ranking da comunidade</small></span>
            <span className="nexora-pulse-float-arrow">↗</span>
          </Link>
        </div>
      )}
      <button
        type="button"
        className={`nexora-pulse-float-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={open ? "Fechar acessos do Pulse e Global" : "Abrir acessos do Pulse e Global"}
      >
        <span className="nexora-pulse-float-orbit" aria-hidden="true" />
        <span className="nexora-pulse-float-mark" aria-hidden="true">{open ? "×" : "✦"}</span>
        {open && <span className="nexora-pulse-float-label">Pulse <i /> Global</span>}
      </button>
      <style jsx>{`
        .nexora-pulse-float{position:fixed;right:14px;bottom:calc(104px + env(safe-area-inset-bottom));z-index:70;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:inherit}
        .nexora-pulse-float-trigger{position:relative;display:flex;align-items:center;gap:9px;min-height:44px;width:44px;padding:0;justify-content:center;border:1px solid rgba(113,220,255,.55);border-radius:999px;color:#f7fbff;background:linear-gradient(115deg,rgba(8,20,48,.97),rgba(36,17,72,.97));box-shadow:0 0 0 1px rgba(125,83,255,.16),0 7px 25px rgba(0,0,0,.4),0 0 22px rgba(46,198,255,.18);cursor:pointer;overflow:hidden;isolation:isolate}
        .nexora-pulse-float-trigger:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 15%,rgba(53,213,255,.14),rgba(199,74,255,.16),transparent 85%);transform:translateX(-80%);animation:nexora-float-shimmer 5s ease-in-out infinite}
        .nexora-pulse-float-orbit{position:absolute;width:34px;height:34px;left:4px;border:1px solid rgba(104,225,255,.45);border-radius:50%;box-shadow:0 0 13px rgba(74,200,255,.2);animation:nexora-float-orbit 4s linear infinite;pointer-events:none}
        .nexora-pulse-float-mark{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;font-size:20px;color:#8ceaff;text-shadow:0 0 12px #35cfff;transition:transform .2s}
        .nexora-pulse-float-trigger.is-open{width:auto;min-width:44px;padding:0 14px;gap:8px}.nexora-pulse-float-trigger.is-open .nexora-pulse-float-mark{font-size:24px;transform:rotate(90deg)}
        .nexora-pulse-float-label{font-size:12px;font-weight:850;letter-spacing:.15px;white-space:nowrap}
        .nexora-pulse-float-label i{display:inline-block;width:4px;height:4px;margin:0 5px 2px;border-radius:50%;background:#c67bff;box-shadow:0 0 7px #c67bff}
        .nexora-pulse-float-menu{width:min(270px,calc(100vw - 28px));padding:7px;border:1px solid rgba(128,191,255,.24);border-radius:19px;background:rgba(8,10,25,.96);box-shadow:0 14px 44px rgba(0,0,0,.5),0 0 28px rgba(93,76,255,.16);backdrop-filter:blur(18px);animation:nexora-float-in .18s ease-out}
        .nexora-pulse-float-option{display:flex;align-items:center;gap:10px;padding:11px 9px;border-radius:13px;color:#f5f6ff;text-decoration:none;transition:background .16s}
        .nexora-pulse-float-option:hover,.nexora-pulse-float-option:focus-visible{background:rgba(88,128,255,.13);outline:none}
        .nexora-pulse-float-icon{flex:0 0 35px;width:35px;height:35px;display:grid;place-items:center;border-radius:12px;font-size:20px}
        .nexora-pulse-float-icon.pulse{color:#7ceaff;background:linear-gradient(135deg,rgba(0,208,255,.19),rgba(111,69,255,.18));border:1px solid rgba(83,220,255,.24)}
        .nexora-pulse-float-icon.global{color:#d5a0ff;background:linear-gradient(135deg,rgba(151,76,255,.22),rgba(255,73,195,.12));border:1px solid rgba(201,113,255,.24)}
        .nexora-pulse-float-option strong{display:block;font-size:12px;font-weight:850}
        .nexora-pulse-float-option small{display:block;margin-top:3px;color:#9ca8c8;font-size:10px}
        .nexora-pulse-float-arrow{margin-left:auto;color:#8ddfff;font-size:15px}
        @keyframes nexora-float-shimmer{0%,60%,100%{transform:translateX(-80%)}75%{transform:translateX(80%)}}
        @keyframes nexora-float-orbit{to{transform:rotate(360deg)}}
        @keyframes nexora-float-in{from{opacity:0;transform:translateY(7px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(prefers-reduced-motion:reduce){.nexora-pulse-float-trigger:before,.nexora-pulse-float-orbit{animation:none}.nexora-pulse-float-menu{animation:none}}
      `}</style>
    </div>
  );
}
