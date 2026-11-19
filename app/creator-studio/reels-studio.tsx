"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./reels-studio.css";

type Clip = { id: string; file: File; url: string; duration: number; kind: "video" | "image" };
type TextLayer = { id: string; text: string; start: number; end: number; color: string; size: number; animation: string };
type ToolTab = "Texto" | "Áudio" | "Efeitos" | "Transições" | "Ajustes";
type FilterName = "Original" | "P&B" | "Quente" | "Frio" | "Contraste" | "Cinema";
const uid = () => crypto.randomUUID();
const fmt = (n: number) => { const v = Math.max(0, n); return `${Math.floor(v/60).toString().padStart(2,"0")}:${Math.floor(v%60).toString().padStart(2,"0")}`; };

export default function ReelsStudio() {
  const [clips,setClips]=useState<Clip[]>([]);
  const [selectedId,setSelectedId]=useState("");
  const [layers,setLayers]=useState<TextLayer[]>([]);
  const [selectedLayer,setSelectedLayer]=useState("");
  const [audio,setAudio]=useState<File|null>(null);
  const [audioUrl,setAudioUrl]=useState("");
  const [tab,setTab]=useState<ToolTab>("Texto");
  const [filter,setFilter]=useState<FilterName>("Original");
  const [brightness,setBrightness]=useState(100);
  const [contrast,setContrast]=useState(100);
  const [saturation,setSaturation]=useState(100);
  const [volume,setVolume]=useState(85);
  const [speed,setSpeed]=useState(1);
  const [playhead,setPlayhead]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [transition,setTransition]=useState("Nenhuma");
  const [notice,setNotice]=useState("Adicione vídeos ou fotos para começar.");
  const [exporting,setExporting]=useState(false);
  const [progress,setProgress]=useState(0);
  const [textDraft,setTextDraft]=useState("");
  const [textColor,setTextColor]=useState("#ffffff");
  const [textSize,setTextSize]=useState(42);
  const [showSafe,setShowSafe]=useState(false);
  const [toolOpen,setToolOpen]=useState(false);
  const videoRef=useRef<HTMLVideoElement>(null);
  const audioRef=useRef<HTMLAudioElement>(null);
  const mediaInput=useRef<HTMLInputElement>(null);
  const audioInput=useRef<HTMLInputElement>(null);
  const urls=useRef<string[]>([]);
  const selected=clips.find(c=>c.id===selectedId)??clips[0];
  const totalDuration=useMemo(()=>clips.reduce((n,c)=>n+(c.duration||4),0),[clips]);
  const currentLayer=layers.find(l=>l.id===selectedLayer);
  const filterCss=filter==="P&B"?"grayscale(1)":filter==="Quente"?"sepia(.35) saturate(1.2)":filter==="Frio"?"hue-rotate(12deg) saturate(.85)":filter==="Contraste"?"contrast(1.3)":filter==="Cinema"?"contrast(1.12) saturate(.82) sepia(.12)":"none";
  const previewFilter=`${filterCss} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  useEffect(()=>()=>{urls.current.forEach(URL.revokeObjectURL);},[]);
  useEffect(()=>{if(audioRef.current)audioRef.current.volume=volume/100;},[volume,audioUrl]);
  useEffect(()=>{if(videoRef.current)videoRef.current.playbackRate=speed;},[speed,selectedId]);
  function makeUrl(file:File){const url=URL.createObjectURL(file);urls.current.push(url);return url;}
  async function addMedia(files:FileList|null){
    if(!files?.length)return;
    const incoming=Array.from(files).filter(f=>f.type.startsWith("video/")||f.type.startsWith("image/"));
    if(!incoming.length){setNotice("Formato não suportado. Escolha fotos ou vídeos.");return;}
    const next:Clip[]=[];
    for(const file of incoming){
      const url=makeUrl(file); let duration=4;
      if(file.type.startsWith("video/"))duration=await new Promise<number>(resolve=>{const v=document.createElement("video");v.preload="metadata";v.onloadedmetadata=()=>resolve(Number.isFinite(v.duration)?v.duration:4);v.onerror=()=>resolve(4);v.src=url;});
      next.push({id:uid(),file,url,duration,kind:file.type.startsWith("video/")?"video":"image"});
    }
    setClips(old=>[...old,...next]);setSelectedId(old=>old||next[0].id);setNotice(`${next.length} mídia(s) adicionada(s) à faixa de vídeo.`);
  }
  function addText(){if(!textDraft.trim()){setNotice("Escreva o texto antes de adicionar a camada.");return;}const layer={id:uid(),text:textDraft.trim(),start:playhead,end:Math.max(playhead+2,Math.min(totalDuration||5,playhead+5)),color:textColor,size:textSize,animation:"Desvanecer"};setLayers(old=>[...old,layer]);setSelectedLayer(layer.id);setTextDraft("");setTab("Texto");setNotice("Camada de texto adicionada à timeline.");}
  function updateLayer(id:string,patch:Partial<TextLayer>){setLayers(old=>old.map(l=>l.id===id?{...l,...patch}:l));}
  function removeClip(){if(!selected)return;const rest=clips.filter(c=>c.id!==selected.id);setClips(rest);setSelectedId(rest[0]?.id??"");setPlaying(false);setNotice("Clipe removido.");}
  function splitClip(){if(!selected||selected.kind!=="video"){setNotice("A divisão está disponível para clipes de vídeo.");return;}if(playhead<=0.2||playhead>=selected.duration-0.2){setNotice("Posicione o indicador dentro do clipe para dividir.");return;}const a={...selected,id:uid(),duration:playhead},b={...selected,id:uid(),duration:selected.duration-playhead};setClips(old=>{const i=old.findIndex(c=>c.id===selected.id);return [...old.slice(0,i),a,b,...old.slice(i+1)];});setSelectedId(b.id);setNotice("Clipe dividido em dois segmentos na timeline.");}
  function moveClip(dir:number){if(!selected)return;setClips(old=>{const i=old.findIndex(c=>c.id===selected.id),j=i+dir;if(j<0||j>=old.length)return old;const a=[...old];[a[i],a[j]]=[a[j],a[i]];return a;});}
  function togglePlayback(){if(!selected)return;if(selected.kind==="video"&&videoRef.current){if(playing){videoRef.current.pause();setPlaying(false);}else{void videoRef.current.play().then(()=>setPlaying(true)).catch(()=>setNotice("Não foi possível reproduzir este vídeo."));}}else{setPlaying(v=>!v);}}
  function addAudio(file:File|null){if(!file)return;setAudio(file);setAudioUrl(makeUrl(file));setNotice("Faixa de áudio adicionada. Ajuste o volume na aba Áudio.");}
  async function exportVideo(){
    if(!clips.length||exporting)return;
    if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){setNotice("Este navegador não oferece renderização local compatível.");return;}
    setExporting(true);setProgress(0);setNotice("Preparando renderização…");
    const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1920;
    const ctx=canvas.getContext("2d");if(!ctx){setExporting(false);setNotice("Não foi possível iniciar o renderizador.");return;}
    const stream=canvas.captureStream(30);let audioContext:AudioContext|undefined;let recorder:MediaRecorder|undefined;let soundtrack:HTMLAudioElement|undefined;const chunks:Blob[]=[];
    const draw=(source:CanvasImageSource,projectTime:number,transitionProgress=1)=>{const sw=source instanceof HTMLVideoElement?source.videoWidth:source instanceof HTMLImageElement?source.naturalWidth:1080;const sh=source instanceof HTMLVideoElement?source.videoHeight:source instanceof HTMLImageElement?source.naturalHeight:1920;if(!sw||!sh)return;const baseScale=Math.max(1080/sw,1920/sh),zoom=transition==="Zoom"&&transitionProgress<1?1.16-.16*transitionProgress:1,w=sw*baseScale*zoom,h=sh*baseScale*zoom;ctx.save();ctx.fillStyle="#05060b";ctx.fillRect(0,0,1080,1920);ctx.filter=previewFilter;ctx.globalAlpha=transition==="Dissolver"&&transitionProgress<1?transitionProgress:1;const slide=transition==="Deslizar"&&transitionProgress<1?(1-transitionProgress)*1080:0;ctx.drawImage(source,(1080-w)/2+slide,(1920-h)/2,w,h);ctx.restore();const active=layers.filter(l=>projectTime>=l.start&&projectTime<=l.end);active.forEach(l=>{ctx.save();ctx.fillStyle=l.color;ctx.font=`800 ${l.size*2}px Arial`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#000";ctx.shadowBlur=12;ctx.fillText(l.text,540,960,900);ctx.restore();});};
    const frame=()=>new Promise<void>(r=>requestAnimationFrame(()=>r()));
    try{
      if(audio){audioContext=new AudioContext();await audioContext.resume();const dest=audioContext.createMediaStreamDestination();soundtrack=new Audio(audioUrl);soundtrack.loop=true;const src=audioContext.createMediaElementSource(soundtrack);const gain=audioContext.createGain();gain.gain.value=volume/100;src.connect(gain);gain.connect(dest);const combined=new MediaStream([...stream.getVideoTracks(),...dest.stream.getAudioTracks()]);recorder=new MediaRecorder(combined,{mimeType:MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm"});(recorder as any).__dest=dest;}
      else recorder=new MediaRecorder(stream,{mimeType:MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm"});
      const done=new Promise<Blob>((resolve,reject)=>{recorder!.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder!.onerror=()=>reject(new Error("Falha durante a renderização."));recorder!.onstop=()=>resolve(new Blob(chunks,{type:recorder!.mimeType||"video/webm"}));});
      recorder.start(250);if(soundtrack)await soundtrack.play();
      let elapsed=0;
      for(let i=0;i<clips.length;i++){
        const clip=clips[i];setNotice(`Renderizando clipe ${i+1} de ${clips.length}…`);
        if(clip.kind==="image"){const img=new Image();await new Promise<void>((r,j)=>{img.onload=()=>r();img.onerror=()=>j(new Error("Não foi possível carregar uma foto."));img.src=clip.url;});const start=performance.now();while(performance.now()-start<clip.duration*1000){const local=(performance.now()-start)/1000;draw(img,elapsed+local,Math.min(1,local/.45));setProgress(Math.min(99,Math.round(((elapsed+local)/Math.max(1,totalDuration))*100)));await frame();}}
        else{const v=document.createElement("video");v.src=clip.url;v.playsInline=true;v.muted=!audio;await new Promise<void>((r,j)=>{v.onloadedmetadata=()=>r();v.onerror=()=>j(new Error("Um vídeo não pôde ser decodificado."));});const srcStart=0;v.currentTime=srcStart;await v.play();while(!v.ended){const local=v.currentTime;draw(v,elapsed+local,Math.min(1,local/.45));setProgress(Math.min(99,Math.round(((elapsed+local)/Math.max(1,totalDuration))*100)));await frame();}v.pause();}
        elapsed+=clip.duration;
      }
      soundtrack?.pause();recorder.stop();const blob=await done;if(!blob.size)throw new Error("O arquivo final ficou vazio.");const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="nexora-reel-editado.webm";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setProgress(100);setNotice("Exportação concluída. O vídeo foi gerado neste dispositivo.");
    }catch(e){if(recorder&&recorder.state!=="inactive")recorder.stop();setNotice(e instanceof Error?e.message:"Não foi possível exportar.");}
    finally{soundtrack?.pause();stream.getTracks().forEach(t=>t.stop());if(audioContext)await audioContext.close().catch(()=>{});setExporting(false);}
  }
  const tabs:ToolTab[]=["Texto","Áudio","Efeitos","Transições","Ajustes"];
  const layerActive=layers.filter(l=>playhead>=l.start&&playhead<=l.end);
  const openTool=(next:ToolTab)=>{setTab(next);setToolOpen(true);};
  return <main className="nx-reels nx-reels-fullscreen">
    <header className="nx-reels-head">
      <button className="nx-back" onClick={()=>window.location.href="/creator-studio"} aria-label="Voltar ao Creator Studio">‹</button>
      <div className="nx-head-title"><b>REELS STUDIO</b><small>{clips.length} clipe(s) · {fmt(totalDuration)}</small></div>
      <button className="nx-export" disabled={!clips.length||exporting} onClick={exportVideo}>{exporting?progress+"%":"Exportar"}</button>
    </header>
    <section className="nx-stage">
      <div className="nx-preview" onClick={()=>setSelectedLayer("")}>
        {selected?(selected.kind==="video"?<video ref={videoRef} key={selected.id} src={selected.url} playsInline controls={false} style={{filter:previewFilter}} onLoadedMetadata={e=>{e.currentTarget.currentTime=0;}} onTimeUpdate={e=>setPlayhead(e.currentTarget.currentTime)} onEnded={()=>setPlaying(false)}/>:<img src={selected.url} alt={selected.file.name} style={{filter:previewFilter}}/>):<button className="nx-empty" onClick={()=>mediaInput.current?.click()}><span>＋</span><b>Importar mídia</b><small>Vídeo ou foto · 9:16</small></button>}
        {layerActive.map(l=><button key={l.id} className={`nx-preview-text ${selectedLayer===l.id?"active":""}`} style={{color:l.color,fontSize:`clamp(16px,${l.size/3}px,42px)`}} onClick={e=>{e.stopPropagation();setSelectedLayer(l.id);openTool("Texto");}}>{l.text}</button>)}
        {showSafe&&<div className="nx-safe-guides"><i/><i/><span>ÁREA SEGURA</span></div>}
      </div>
      <div className="nx-player-controls">
        <button onClick={togglePlayback} disabled={!selected}>{playing?"Ⅱ":"▶"}</button>
        <span>{fmt(playhead)} / {fmt(totalDuration)}</span>
        <input aria-label="Posição da reprodução" type="range" min="0" max={Math.max(1,totalDuration)} step=".1" value={Math.min(playhead,totalDuration||0)} onChange={e=>{const v=Number(e.target.value);setPlayhead(v);if(videoRef.current)videoRef.current.currentTime=v;}}/>
        <button onClick={()=>setShowSafe(v=>!v)} aria-label="Margens seguras">⌗</button>
      </div>
    </section>
    <section className="nx-timeline-card">
      <div className="nx-timeline-title"><div><b>Timeline</b><small>{clips.length} clipes</small></div><button onClick={()=>mediaInput.current?.click()}>＋ Mídia</button><input ref={mediaInput} hidden type="file" accept="image/*,video/*" multiple onChange={e=>void addMedia(e.target.files)}/></div>
      <div className="nx-track">
        <span className="nx-track-label">VÍDEO 1</span>
        <div className="nx-video-track">{clips.map((c,i)=><button key={c.id} className={c.id===selected?.id?"selected":""} onClick={()=>{setSelectedId(c.id);setPlayhead(0);setPlaying(false);}}><span>{c.kind==="video"?"▶":"▧"}</span><small>{c.file.name}</small><em>{fmt(c.duration)}</em></button>)}<button className="nx-add-tile" onClick={()=>mediaInput.current?.click()}>＋</button></div>
      </div>
      <div className="nx-track"><span className="nx-track-label audio">ÁUDIO</span><div className="nx-audio-track">{audio?<><span>♫ {audio.name}</span><div className="nx-wave">{Array.from({length:44},(_,i)=><i key={i} style={{height:`${15+(i*37)%78}%`}}/>)}</div><button onClick={()=>openTool("Áudio")}>•••</button></>:<button onClick={()=>{audioInput.current?.click();openTool("Áudio");}}>＋ Adicionar áudio</button>}<input ref={audioInput} hidden type="file" accept="audio/*" onChange={e=>addAudio(e.target.files?.[0]??null)}/></div></div>
      <div className="nx-track"><span className="nx-track-label text">TEXTO</span><div className="nx-text-track">{layers.length?layers.map(l=><button key={l.id} className={selectedLayer===l.id?"selected":""} onClick={()=>{setSelectedLayer(l.id);setPlayhead(l.start);openTool("Texto");}}>{l.text}</button>):<button onClick={()=>openTool("Texto")}>＋ Criar camada de texto</button>}</div></div>
      <div className="nx-timeline-actions"><button onClick={splitClip} disabled={!selected}>✂ Dividir</button><button onClick={()=>moveClip(-1)} disabled={!selected}>←</button><button onClick={()=>moveClip(1)} disabled={!selected}>→</button><button onClick={removeClip} disabled={!selected}>Excluir</button></div>
    </section>
    <nav className="nx-main-tools" aria-label="Ferramentas do editor">{tabs.map((t,i)=><button key={t} className={toolOpen&&tab===t?"active":""} onClick={()=>toolOpen&&tab===t?setToolOpen(false):openTool(t)}><span>{["T","♫","✧","◈","☷"][i]}</span><small>{t}</small></button>)}</nav>
    {toolOpen&&<><button className="nx-sheet-backdrop" aria-label="Fechar ferramentas" onClick={()=>setToolOpen(false)}/><section className="nx-tool-sheet">
      <header><b>{tab}</b><button onClick={()=>setToolOpen(false)} aria-label="Fechar">×</button></header>
      <div className="nx-tool-content">
      {tab==="Texto"&&<><label>Texto sobre o vídeo</label><textarea value={textDraft} onChange={e=>setTextDraft(e.target.value)} placeholder="Escreva uma legenda…"/><div className="nx-control-row"><label>Cor <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)}/></label><label>Tamanho <input type="range" min="18" max="72" value={textSize} onChange={e=>setTextSize(Number(e.target.value))}/></label><button onClick={addText}>＋ Adicionar camada</button></div>{currentLayer&&<div className="nx-selected-layer"><b>Camada selecionada</b><input value={currentLayer.text} onChange={e=>updateLayer(currentLayer.id,{text:e.target.value})}/><label>Início <input type="number" min="0" step=".1" value={currentLayer.start} onChange={e=>updateLayer(currentLayer.id,{start:Number(e.target.value)})}/></label><label>Fim <input type="number" min=".1" step=".1" value={currentLayer.end} onChange={e=>updateLayer(currentLayer.id,{end:Number(e.target.value)})}/></label><button onClick={()=>{setLayers(old=>old.filter(l=>l.id!==currentLayer.id));setSelectedLayer("");}}>Excluir camada</button></div>}</>}
      {tab==="Áudio"&&<><label>Trilha sonora</label><button className="nx-wide-action" onClick={()=>audioInput.current?.click()}>{audio?"Trocar áudio":"＋ Adicionar áudio"}</button>{audio&&<><p>{audio.name}</p><audio ref={audioRef} src={audioUrl} controls/><label>Volume {volume}% <input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label></>}<label>Velocidade <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value=".5">0,5×</option><option value=".75">0,75×</option><option value="1">1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label></>}
      {tab==="Efeitos"&&<><label>Efeitos visuais</label><div className="nx-effect-grid">{(["Original","P&B","Quente","Frio","Contraste","Cinema"] as FilterName[]).map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}><span>◈</span>{f}</button>)}</div></>}
      {tab==="Transições"&&<><label>Transição entre clipes</label><div className="nx-effect-grid">{["Nenhuma","Dissolver","Deslizar","Zoom"].map(t=><button key={t} className={transition===t?"selected":""} onClick={()=>setTransition(t)}>{t}</button>)}</div><p>Escolha o efeito aplicado na passagem entre os clipes.</p></>}
      {tab==="Ajustes"&&<><label>Ajustes de imagem</label>{[["Brilho",brightness,setBrightness],["Contraste",contrast,setContrast],["Saturação",saturation,setSaturation]].map(([name,val,setter]:any)=><label className="nx-range" key={name}>{name} <b>{val}%</b><input type="range" min="0" max="200" value={val} onChange={e=>setter(Number(e.target.value))}/></label>)}<button className="nx-wide-action" onClick={()=>{setBrightness(100);setContrast(100);setSaturation(100);setFilter("Original");}}>Restaurar imagem</button><button className="nx-wide-action" onClick={()=>setShowSafe(v=>!v)}>{showSafe?"Ocultar":"Exibir"} margens seguras</button></>}
      </div>
    </section></>}
    <div className="nx-status-line" role="status">{exporting?`Renderizando ${progress}%`:notice}</div>
  </main>;
}
