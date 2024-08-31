"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "./ToolBar";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-5", // Increased margin for better indentation
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-5", // Increased margin for better indentation
        },
      }),
      Highlight,
      Image,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[200px] border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary px-4 py-2 text-sm", // Improved editor styling
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="border border-gray-300 rounded-t-lg bg-gray-100 p-2 flex justify-between items-center shadow-sm">
        <ToolBar editor={editor} />
      </div>
      <div className="border-t-0 rounded-b-lg shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
