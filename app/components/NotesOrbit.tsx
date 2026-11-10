"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

export type NotesOrbitPerson = {
  id: string;
  name: string;
  avatar: string;
  note: string;
  own: boolean;
  online: boolean;
};

type NotesOrbitProps = {
  people: NotesOrbitPerson[];
  onOpenNote: (person: NotesOrbitPerson, index: number) => void;
  onOpenProfile: (person: NotesOrbitPerson) => void;
  ownLabel: string;
  emptyOwnNoteLabel: string;
};

export default function NotesOrbit({ people, onOpenNote, onOpenProfile, ownLabel, emptyOwnNoteLabel }: NotesOrbitProps) {
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef<{ pointerId: number; startX: number; lastX: number; lastAt: number; moved: boolean; velocity: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopInertia = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopInertia();
    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current);
    suppressClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastAt: performance.now(),
      moved: false,
      velocity: 0
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const now = performance.now();
    const delta = event.clientX - drag.lastX;
    if (Math.abs(event.clientX - drag.startX) > 5) drag.moved = true;
    if (drag.moved) {
      drag.velocity = delta / Math.max(1, now - drag.lastAt);
      setRotation(value => value + delta * 0.72);
    }
    drag.lastX = event.clientX;
    drag.lastAt = now;
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;

    if (!cancelled && drag.moved) {
      suppressClickRef.current = true;
      let velocity = Math.max(-22, Math.min(22, drag.velocity * 95));
      let previousTime = 0;
      const coast = (time: number) => {
        if (!previousTime) previousTime = time;
        const frameScale = Math.min(2, (time - previousTime) / 16.67);
        previousTime = time;
        setRotation(value => value + velocity * frameScale);
        velocity *= Math.pow(0.88, frameScale);
        if (Math.abs(velocity) > 0.12) frameRef.current = window.requestAnimationFrame(coast);
        else frameRef.current = null;
      };
      if (Math.abs(velocity) > 0.12) frameRef.current = window.requestAnimationFrame(coast);
      suppressTimerRef.current = setTimeout(() => {
        suppressClickRef.current = false;
        suppressTimerRef.current = null;
      }, 280);
    } else if (cancelled) {
      stopInertia();
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className="messages-notes-orbit"
      role="group"
      aria-label="Notas dos contatos. Arraste horizontalmente para girar os perfis."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={event => finishPointer(event)}
      onPointerCancel={event => finishPointer(event, true)}
      onLostPointerCapture={event => {
        if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
      }}
    >
      <div className="notes-orbit-track" aria-hidden="true" />
      <div className="notes-orbit-center" aria-hidden="true"><span>N</span><small>NEXORA</small></div>
      {people.map((person, index) => {
        const angle = (index * (360 / Math.max(people.length, 1)) - 90 + rotation) * Math.PI / 180;
        const x = 50 + Math.cos(angle) * 37;
        const y = 50 + Math.sin(angle) * 39;
        const focused = Math.sin(angle) < -0.72;
        const style = person.own ? 0 : (index + 1) % 4;
        return (
          <div
            key={person.id}
            className={`note-orbit-person ${person.own ? "own-note" : ""} ${focused ? "is-orbit-focus" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <button
              type="button"
              className={`note-bubble note-style-${style}`}
              onClick={() => { if (!suppressClickRef.current) onOpenNote(person, index); }}
              aria-label={`Visualizar nota de ${person.name}`}
            >
              {person.note || (person.own ? emptyOwnNoteLabel : "Compartilhe uma ideia ✨")}
            </button>
            <button
              type="button"
              className="note-orbit-profile"
              onClick={() => { if (!suppressClickRef.current) onOpenProfile(person); }}
              aria-label={person.own ? "Criar ou editar sua nota" : `Abrir conversa com ${person.name}`}
            >
              <span className="note-person-avatar">
                <img src={person.avatar} alt="" />
                {person.own ? <i>＋</i> : person.online ? <i /> : null}
              </span>
              <small>{person.own ? ownLabel : person.name}</small>
            </button>
          </div>
        );
      })}
    </div>
  );
}
