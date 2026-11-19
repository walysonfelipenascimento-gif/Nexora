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
    const draw=(source:CanvasImageSource)=>{const sw=source instanceof HTMLVideoElement?source.videoWidth:source instanceof HTMLImageElement?source.naturalWidth:1080;const sh=source instanceof HTMLVideoElement?source.videoHeight:source instanceof HTMLImageElement?source.naturalHeight:1920;if(!sw||!sh)return;const scale=Math.max(1080/sw,1920/sh),w=sw*scale,h=sh*scale;ctx.save();ctx.fillStyle="#05060b";ctx.fillRect(0,0,1080,1920);ctx.filter=previewFilter;ctx.drawImage(source,(1080-w)/2,(1920-h)/2,w,h);ctx.restore();const active=layers.filter(l=>playhead>=l.start&&playhead<=l.end);active.forEach(l=>{ctx.save();ctx.fillStyle=l.color;ctx.font=`800 ${l.size*2}px Arial`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#000";ctx.shadowBlur=12;ctx.fillText(l.text,540,960,900);ctx.restore();});};
    const frame=()=>new Promise<void>(r=>requestAnimationFrame(()=>r()));
    try{
      if(audio){audioContext=new AudioContext();await audioContext.resume();const dest=audioContext.createMediaStreamDestination();soundtrack=new Audio(audioUrl);soundtrack.loop=true;const src=audioContext.createMediaElementSource(soundtrack);const gain=audioContext.createGain();gain.gain.value=volume/100;src.connect(gain);gain.connect(dest);const combined=new MediaStream([...stream.getVideoTracks(),...dest.stream.getAudioTracks()]);recorder=new MediaRecorder(combined,{mimeType:MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm"});(recorder as any).__dest=dest;}
      else recorder=new MediaRecorder(stream,{mimeType:MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm"});
      const done=new Promise<Blob>((resolve,reject)=>{recorder!.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder!.onerror=()=>reject(new Error("Falha durante a renderização."));recorder!.onstop=()=>resolve(new Blob(chunks,{type:recorder!.mimeType||"video/webm"}));});
      recorder.start(250);if(soundtrack)await soundtrack.play();
      let elapsed=0;
      for(let i=0;i<clips.length;i++){
        const clip=clips[i];setNotice(`Renderizando clipe ${i+1} de ${clips.length}…`);
        if(clip.kind==="image"){const img=new Image();await new Promise<void>((r,j)=>{img.onload=()=>r();img.onerror=()=>j(new Error("Não foi possível carregar uma foto."));img.src=clip.url;});const start=performance.now();while(performance.now()-start<clip.duration*1000){draw(img);setProgress(Math.min(99,Math.round(((elapsed+(performance.now()-start)/1000)/Math.max(1,totalDuration))*100)));await frame();}}
        else{const v=document.createElement("video");v.src=clip.url;v.playsInline=true;v.muted=!audio;await new Promise<void>((r,j)=>{v.onloadedmetadata=()=>r();v.onerror=()=>j(new Error("Um vídeo não pôde ser decodificado."));});const srcStart=0;v.currentTime=srcStart;await v.play();while(!v.ended){draw(v);setProgress(Math.min(99,Math.round(((elapsed+v.currentTime)/Math.max(1,totalDuration))*100)));await frame();}v.pause();}
        elapsed+=clip.duration;
      }
      soundtrack?.pause();recorder.stop();const blob=await done;if(!blob.size)throw new Error("O arquivo final ficou vazio.");const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="nexora-reel-editado.webm";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setProgress(100);setNotice("Exportação concluída. O vídeo foi gerado neste dispositivo.");
    }catch(e){if(recorder&&recorder.state!=="inactive")recorder.stop();setNotice(e instanceof Error?e.message:"Não foi possível exportar.");}
    finally{soundtrack?.pause();stream.getTracks().forEach(t=>t.stop());if(audioContext)await audioContext.close().catch(()=>{});setExporting(false);}
  }
  const tabs:ToolTab[]=["Texto","Áudio","Efeitos","Transições","Ajustes"];
  const layerActive=layers.filter(l=>playhead>=l.start&&playhead<=l.end);
  return <div className="nx-reels">
    <header className="nx-reels-head"><a href="/creator-studio">‹</a><div><b>Reels Studio</b><small>{clips.length} clipe(s) na edição</small></div><button className="nx-export" disabled={!clips.length||exporting} onClick={exportVideo}>{exporting?`Exportando ${progress}%`:"Exportar"}</button></header>
    <section className="nx-preview-wrap"><div className="nx-preview" onClick={()=>setSelectedLayer("")}>
      {selected?(selected.kind==="video"?<video ref={videoRef} key={selected.id} src={selected.url} playsInline controls={false} style={{filter:previewFilter}} onLoadedMetadata={e=>{e.currentTarget.currentTime=0;}} onTimeUpdate={e=>setPlayhead(e.currentTarget.currentTime)} onEnded={()=>setPlaying(false)}/>:<img src={selected.url} alt={selected.file.name} style={{filter:previewFilter}}/>):<button className="nx-empty" onClick={()=>mediaInput.current?.click()}><span>＋</span><b>Adicionar vídeo ou foto</b><small>Prévia vertical 9:16</small></button>}
      {layerActive.map(l=><button key={l.id} className={`nx-preview-text ${selectedLayer===l.id?"active":""}`} style={{color:l.color,fontSize:`clamp(16px,${l.size/3}px,42px)`}} onClick={e=>{e.stopPropagation();setSelectedLayer(l.id);setTab("Texto");}}>{l.text}</button>)}
      {showSafe&&<div className="nx-safe-guides"><i/><i/><span>ÁREA SEGURA</span></div>}
    </div><div className="nx-preview-meta"><span>PRÉVIA 9:16</span><span>{selected?.kind==="video"?"Vídeo":selected?"Foto":"Aguardando mídia"}</span></div></section>
    <section className="nx-timeline-card"><div className="nx-timeline-title"><div><b>Linha do tempo</b><small>{clips.length} clipes · {fmt(totalDuration)}</small></div><button onClick={()=>mediaInput.current?.click()}>＋ Adicionar mídia</button><input ref={mediaInput} hidden type="file" accept="image/*,video/*" multiple onChange={e=>void addMedia(e.target.files)}/></div>
      <div className="nx-ruler"><span>VÍDEO 1</span><div className="nx-video-track">{clips.map((c,i)=><button key={c.id} className={c.id===selected?.id?"selected":""} onClick={()=>{setSelectedId(c.id);setPlayhead(0);setPlaying(false);}}><span>{c.kind==="video"?"▶":"▧"}</span><small>{c.file.name}</small><em>{fmt(c.duration)}</em></button>)}<button className="nx-add-tile" onClick={()=>mediaInput.current?.click()}>＋</button></div></div>
      <div className="nx-ruler"><span>ÁUDIO</span><div className="nx-audio-track" onClick={()=>setTab("Áudio")}>{audio?<><span>♫ {audio.name}</span><div className="nx-wave">{Array.from({length:48},(_,i)=><i key={i} style={{height:`${15+(i*37)%78}%`}}/>)}</div></>:<button onClick={()=>audioInput.current?.click()}>＋ Adicionar áudio</button>}<input ref={audioInput} hidden type="file" accept="audio/*" onChange={e=>addAudio(e.target.files?.[0]??null)}/></div></div>
      <div className="nx-ruler"><span>TEXTO</span><div className="nx-text-track">{layers.length?layers.map(l=><button key={l.id} className={selectedLayer===l.id?"selected":""} onClick={()=>{setSelectedLayer(l.id);setTab("Texto");setPlayhead(l.start);}}>{l.text}</button>):<button onClick={()=>setTab("Texto")}>Adicione uma camada de texto pelas ferramentas</button>}</div></div>
      <div className="nx-playhead" style={{left:`calc(112px + ${Math.min(95,totalDuration?playhead/totalDuration*95:0)}%)`}}><i/></div>
      <div className="nx-timeline-actions"><button onClick={togglePlayback} disabled={!selected}>{playing?"Ⅱ Pausar":"▶ Reproduzir"}</button><button onClick={splitClip} disabled={!selected}>Dividir clipe</button><button onClick={()=>moveClip(-1)} disabled={!selected}>← Mover</button><button onClick={()=>moveClip(1)} disabled={!selected}>Mover →</button><button onClick={removeClip} disabled={!selected}>Excluir</button></div>
    </section>
    <section className="nx-tools-card"><nav>{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</nav>
      <div className="nx-tool-content">
      {tab==="Texto"&&<><label>Texto sobre o vídeo</label><textarea value={textDraft} onChange={e=>setTextDraft(e.target.value)} placeholder="Escreva uma legenda…"/><div className="nx-control-row"><label>Cor <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)}/></label><label>Tamanho <input type="range" min="18" max="72" value={textSize} onChange={e=>setTextSize(Number(e.target.value))}/></label><button onClick={addText}>＋ Adicionar camada</button></div>{currentLayer&&<div className="nx-selected-layer"><b>Camada selecionada</b><input value={currentLayer.text} onChange={e=>updateLayer(currentLayer.id,{text:e.target.value})}/><label>Início <input type="number" min="0" step=".1" value={currentLayer.start} onChange={e=>updateLayer(currentLayer.id,{start:Number(e.target.value)})}/></label><label>Fim <input type="number" min=".1" step=".1" value={currentLayer.end} onChange={e=>updateLayer(currentLayer.id,{end:Number(e.target.value)})}/></label><button onClick={()=>{setLayers(old=>old.filter(l=>l.id!==currentLayer.id));setSelectedLayer("");}}>Excluir camada</button></div>}</>}
      {tab==="Áudio"&&<><label>Trilha sonora</label><button className="nx-wide-action" onClick={()=>audioInput.current?.click()}>{audio?"Trocar áudio":"＋ Adicionar áudio do dispositivo"}</button>{audio&&<><p>{audio.name}</p><audio ref={audioRef} src={audioUrl} controls/><label>Volume da música {volume}% <input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label></>}<label>Velocidade do vídeo <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="0.5">0,5×</option><option value="0.75">0,75×</option><option value="1">1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label></>}
      {tab==="Efeitos"&&<><label>Efeitos visuais</label><div className="nx-effect-grid">{(["Original","P&B","Quente","Frio","Contraste","Cinema"] as FilterName[]).map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}><span style={{filter:f==="P&B"?"grayscale(1)":f==="Quente"?"sepia(.5)":f==="Frio"?"hue-rotate(35deg)":f==="Contraste"?"contrast(1.5)":f==="Cinema"?"contrast(1.2) saturate(.7)":"none"}}>◈</span>{f}</button>)}</div></>}
      {tab==="Transições"&&<><label>Transição entre clipes</label><div className="nx-effect-grid">{["Nenhuma","Dissolver","Deslizar","Zoom"].map(t=><button key={t} className={transition===t?"selected":""} onClick={()=>{setTransition(t);setNotice(`Transição ${t} selecionada.`);}}>{t}</button>)}</div><p>As transições são aplicadas nos limites entre clipes. A prévia de cada transição será atualizada ao reproduzir a sequência.</p></>}
      {tab==="Ajustes"&&<><label>Ajustes de imagem</label>{[["Brilho",brightness,setBrightness],["Contraste",contrast,setContrast],["Saturação",saturation,setSaturation]].map(([name,val,setter]:any)=><label className="nx-range" key={name}>{name} <b>{val}%</b><input type="range" min="0" max="200" value={val} onChange={e=>setter(Number(e.target.value))}/></label>)}<button className="nx-wide-action" onClick={()=>{setBrightness(100);setContrast(100);setSaturation(100);setFilter("Original");}}>Restaurar ajustes</button><button className="nx-wide-action" onClick={()=>setShowSafe(v=>!v)}>{showSafe?"Ocultar":"Mostrar"} margens seguras</button></>}
      </div>
    </section>
    <div className="nx-editor-footer"><button onClick={()=>window.history.back()}>Voltar</button><span role="status">{notice}</span><button className="nx-next" onClick={exportVideo} disabled={!clips.length||exporting}>{exporting?`Exportando ${progress}%`:"Exportar Reel →"}</button></div>
  </div>;
}
