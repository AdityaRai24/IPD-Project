"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

export default function RichTextEditor({ content, onEditorSave }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted before rendering the editor
  }, []);

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
      Image,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary px-4 py-2 text-sm", // Improved editor styling
      },
    },
    // Explicitly setting immediatelyRender to false
    editable: true,
  });

  // Avoid rendering the editor until the component is mounted on the client-side
  if (!isMounted || !editor) {
    return null;
  }

  const handleEditorContent = () => {
    const html = editor.getHTML();
    onEditorSave(html);
    console.log(html);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded-md border ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded-md border ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded-md border ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Heading3 className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("strike")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("code")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md border ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-md border ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-md border ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-md border ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <AlignRight className="w-5 h-5" />
        </button>
      </div>

      <div className="border-t-0 rounded-b-lg shadow-sm">
        <EditorContent editor={editor} onSubmit={handleEditorContent} />
      </div>
    </div>
  );
}
