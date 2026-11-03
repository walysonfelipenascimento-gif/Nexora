import React from "react";

type ChatMessage = { id: number; text: string; mine: boolean; time: string; kind?: "text" | "audio" | "image"; reactions?: string[] };

export default function ChatMessageContent({ message }: { message: ChatMessage }) {

  if (message.kind === "image" && message.text.startsWith("NEXORA_STORY_SHARE|")) {
    const [, imageUrl, storyName, storyCaption] = message.text.split("|");
    return (
      <div className="chat-story-share-card">
        <div className="chat-story-share-media" style={{ backgroundImage: "url(" + imageUrl + ")" }}>
          <span className="chat-story-share-label">✦ STORY</span>
        </div>
        <div className="chat-story-share-caption">
          <strong>{storyName}</strong>
          <span>{storyCaption}</span>
          <small>Story compartilhado · toque para contexto</small>
        </div>
      </div>
    );
  }

  if (message.kind === "image") {
    return (
      <div className="chat-image-message">
        <div className="chat-city-image" role="img" aria-label="Imagem compartilhada na conversa" />
        <span>{message.text}</span>
      </div>
    );
  }

  return <p className="chat-message-text">{message.text}</p>;
}

