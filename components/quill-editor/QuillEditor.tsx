import { EditorContainer } from "./QuillEditorStyles";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import { Types, Realtime } from "ably";

Quill.register("modules/cursors", QuillCursors);

export default function QuillEditor() {
  // Generate a random username and color
  // TODO: Client ID will come from token request instead
  const color: string = getRandomColor();

  const quillRef = useRef<ReactQuill | null>(null);
  const realtimeRef = useRef<Realtime | null>(null);
  const channelRef = useRef<Types.Channel | null>(null);

  const [cursors, setCursors] = useState<any>({});

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
    cursors: true
  };

  useEffect(() => {
    realtimeRef.current = new Realtime({ authUrl: "/api/ably-token", authMethod: "POST" });
    channelRef.current = realtimeRef.current.channels.get("[?rewind=2m]editor");

    /* TODO: This should have a check to make sure we don't apply deltas from before the
     Retrieved state from FaunaDB */
    channelRef.current.subscribe("delta", (message: Types.Message) => {
      if (quillRef.current && message.clientId !== realtimeRef.current?.auth.clientId) {
        const quillInstance = quillRef.current.getEditor();
        quillInstance.updateContents(message.data);
      }
    });

    channelRef.current.presence.subscribe(["enter", "present", "update"], (msg: Types.PresenceMessage) => {
      const { range, color } = msg.data;
      if (msg.clientId !== realtimeRef.current?.auth.clientId) {
        setCursors((prevCursors: any) => ({
          ...prevCursors,
          [msg.clientId]: { range, color }
        }));
      }
    });

    channelRef.current.presence.subscribe("leave", (msg: Types.PresenceMessage) => {
      setCursors((prevCursors: any) => {
        const newCursors = { ...prevCursors };
        delete newCursors[msg.clientId];
        return newCursors;
      });
    });
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();

      quillInstance.on("selection-change", (range: any) => {
        if (range) {
          channelRef.current?.presence.update({ color, range });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      const cursorsModule = quillInstance.getModule("cursors");
      cursorsModule.clearCursors();

      Object.entries(cursors).forEach(([clientId, cursorData]: [string, any]) => {
        const { range, color } = cursorData;
        cursorsModule.createCursor(clientId, clientId, color);
        if (range) {
          cursorsModule.moveCursor(clientId, range);
        }
      });
    }
  }, [cursors]);

  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    if (source === "user" && channelRef.current) {
      channelRef.current.publish("delta", delta);
    }
  };

  return (
    <EditorContainer>
        <ReactQuill 
          theme="snow" 
          onChange={handleChange} 
          modules={modules} 
          ref={quillRef} />
    </EditorContainer>
  );
}

function getRandomColor(): string {
  let colors = ["red", "green", "blue", "orange", "pink", "black", "purple"];
  return colors[Math.floor(Math.random() * colors.length)];
}
