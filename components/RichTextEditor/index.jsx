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
  Sparkle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export default function RichTextEditor({ form, content, onEditorSave }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  const formValues = form.getValues();
  const generateJobDescription = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please fill all the required fields");
      return;
    }
    try {
      setGeneratingDescription(true);
      const response = await axios.post(
        `http://localhost:3000/api/generate-job-description`,
        { formDetails: formValues, additionalDetails: additionalDetails }
      );
      form.setValue("jobDescription", response.data);
      setIsOpen(false);
      toast.success("Job description generated!");
    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingDescription(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
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
          class: "list-decimal ml-5",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-5",
        },
      }),
      Image,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary p-8",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onEditorSave(html);
    },
  });

  useEffect(() => {
    if (editor && form.getValues().jobDescription !== editor.getHTML()) {
      console.log("Editor content changed:", editor.getHTML());
      editor.commands.setContent(form.getValues().jobDescription);
    }
  }, [form.getValues().jobDescription, editor]);

  if (!isMounted || !editor) {
    return null;
  }

  

  return (
    <div className="rich-text-editor">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
        <Button
          onClick={() => setIsOpen(true)}
          type="button"
          className="flex items-center gap-2"
        >
          Generate With AI <Sparkles className="w-4 h-4" />{" "}
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Job Description</DialogTitle>
              <DialogDescription>
                <div className="my-3 flex flex-col gap-3">
                  <Label className="text-black">Additional Details</Label>
                  <Textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    className=" text-black"
                    placeholder={
                      "Enter additional details (if any) that you want to include in your job description"
                    }
                  />
                  <Button
                    onClick={generateJobDescription}
                    disabled={generatingDescription}
                  >
                    {generatingDescription ? "Generating..." : "Generate"}{" "}
                    {generatingDescription && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border-t-0 rounded-b-lg shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
