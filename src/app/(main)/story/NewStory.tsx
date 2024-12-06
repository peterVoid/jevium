"use client";

import {
  ClipboardPaste,
  Code,
  Image,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./new_story.css";
import { createRoot } from "react-dom/client";
import { ImageUpload } from "./cloudinaryUpload";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import axios from "axios";

interface NewStoryProps {
  storyId: string;
  storyRender: string | null | undefined;
}

export default function NewStory({ storyId, storyRender }: NewStoryProps) {
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState(storyRender);
  const [openTools, setOpenTools] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const debouncedHandleSave = useRef(
    debounce(() => {
      handleSave();
    }, 1000),
  ).current;

  const handleSave = async () => {
    const content = contentEditableRef.current?.innerHTML;
    setIsSaving(true);

    try {
      await axios.patch("/api/new-story", {
        storyId,
        content,
      });
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };

  const InsertImageComp = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setOpenTools(false);

      const localImageUrl = URL.createObjectURL(file);

      const imageComp = (
        <ImageComp
          file={file}
          imageUrl={localImageUrl}
          handleSave={handleSave}
        />
      );

      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(imageComp);

      contentEditableRef.current?.appendChild(wrapperDiv);
    }
  };

  const getCurrentPosition = () => {
    let x = 0;
    let y = 0;

    const isSupported = typeof window.getSelection !== "undefined";

    if (isSupported) {
      const selection = window.getSelection() as Selection;

      if (selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getClientRects()[0];
        if (rect) {
          x = rect.left + window.screenX - 80;
          y = rect.top + window.scrollY - 80;
        }
      }
    }

    return { x, y };
  };

  const InsertDivider = () => {
    const DividerComp = <Divider />;

    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(DividerComp);

    contentEditableRef.current?.appendChild(wrapperDiv);
    debouncedHandleSave();
  };

  const InsertCodeBlock = () => {
    const codeBlockComp = <CodeBlock handleSave={handleSave} />;
    setOpenTools(false);

    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(codeBlockComp);

    contentEditableRef.current?.appendChild(wrapperDiv);
  };

  useEffect(() => {
    const handleInput = () => {
      const { x, y } = getCurrentPosition();
      setButtonPosition({ top: y, left: -50 });

      if (contentEditableRef.current?.innerHTML.trim() === "<br>") {
        contentEditableRef.current.innerHTML =
          contentEditableRef.current.innerHTML.replace(/<br>/g, "").trim();

        contentEditableRef.current.innerHTML = `
          <h1 class="font-medium" data-h1-placeholder="Title"></h1>
          <p data-p-placeholder="Write your story..."></p>
        `;
      }

      debouncedHandleSave();
    };

    contentEditableRef.current?.addEventListener("input", handleInput);

    return () => {
      contentEditableRef.current?.removeEventListener("input", handleInput);
    };
  }, []);

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const editor = new MediumEditor(".editable", {
        elementsContainer: document.getElementById("container") as HTMLElement,
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h1",
            "h2",
            "h3",
            "quote",
          ],
        },
      });
      // return () => {
      //   editor.destroy();
      // };
    }
  }, []);

  useEffect(() => {
    if (!contentEditableRef.current) return;

    const placeholderHTML = `
    <div>
      <h1 class="font-medium" data-h1-placeholder="Title" autofocus="true"></h1>
      <p data-p-placeholder="Write your story..."></p>
    </div>
  `;

    const currentHTML = contentEditableRef.current.innerHTML.trim();

    contentEditableRef.current.normalize();

    if (!content || currentHTML === placeholderHTML) {
      contentEditableRef.current.innerHTML = placeholderHTML;
    } else {
      contentEditableRef.current.innerHTML = content;
    }

    console.log("Editor content:", contentEditableRef.current.innerHTML);
  }, [content]);

  return (
    <main
      id="container"
      className="prose relative mx-auto mt-5 max-w-[800px] font-mono"
    >
      <p className="absolute -top-[69px] left-28 opacity-80">
        {isSaving ? "SAVING" : "SAVED"}
      </p>
      <div
        id="editable"
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        className="editable max-w-[800px] outline-none focus:outline-none"
        style={{ whiteSpace: "pre-line" }}
      >
        {storyRender && (
          <>
            <div dangerouslySetInnerHTML={{ __html: storyRender }} />
          </>
        )}
      </div>
      <div
        className={`z-10 ${buttonPosition.top == 0 ? "hidden" : ""}`}
        style={{
          position: "absolute",
          top: buttonPosition.top,
          left: buttonPosition.left,
        }}
      >
        <button
          id="tooltip"
          className="inline-block rounded-full border-[1px] border-neutral-500 p-1"
          onClick={() => setOpenTools(!openTools)}
        >
          <Plus
            className={`duration-300 ease-linear ${openTools ? "rotate-90" : ""}`}
          />
        </button>
        <div
          id="tool"
          className={`absolute left-14 top-0 flex items-center space-x-4 ${openTools ? "visible" : "invisible"}`}
        >
          <span
            onClick={InsertImageComp}
            className={`block rounded-full border-[1.5px] border-green-500 p-[6px] ${openTools ? "visible scale-100" : "invisible scale-0"} cursor-pointer bg-white duration-100 ease-linear`}
          >
            <Image className="text-orange-800 opacity-60" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </span>
          <span
            onClick={InsertDivider}
            className={`block rounded-full border-[1.5px] border-green-500 p-[6px] ${openTools ? "visible scale-100" : "invisible scale-0"} cursor-pointer bg-white delay-75 duration-100 ease-linear`}
          >
            <MoreHorizontal size={20} className="text-green-800 opacity-60" />
            <input type="file" accept="image/*" style={{ display: "none" }} />
          </span>
          <span
            onClick={InsertCodeBlock}
            className={`block rounded-full border-[1.5px] border-green-500 p-[6px] ${openTools ? "visible scale-100" : "invisible scale-0"} cursor-pointer bg-white delay-100 duration-100 ease-linear`}
          >
            <Code size={20} className="text-green-800 opacity-60" />
            <input type="file" accept="image/*" style={{ display: "none" }} />
          </span>
        </div>
      </div>
    </main>
  );
}

const ImageComp = ({
  imageUrl,
  file,
  handleSave,
}: {
  imageUrl: string;
  file: File;
  handleSave: () => void;
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);

  const updateImageUrl = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      ImageUpload(formData).then((url) => setCurrentImageUrl(url));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateImageUrl().then(() => {
      handleSave();
    });
  }, [imageUrl]);

  return (
    <div className="py-3">
      <div>
        <img
          src={currentImageUrl}
          alt="Image"
          className="h-[450px] max-w-full"
        />
        <div className="mx-auto max-w-md text-center text-sm">
          <p data-p-placeholder="Type caption for your image"></p>
        </div>
      </div>
      <p data-p-placeholder="..."></p>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="w-full py-3">
      <div
        className="flex items-center justify-center text-center"
        contentEditable={false}
      >
        <MoreHorizontal size={32} />
      </div>
      <p data-p-placeholder="Write your text..."></p>
    </div>
  );
};

const CodeBlock = ({ handleSave }: { handleSave: () => void }) => {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setCode(event.currentTarget.value || "");
  };

  const handlePaste = async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();

      setCode((prev) => prev + clipboardData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const highlight = hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value;

    setHighlightedCode(highlight);
    handleSave();
  }, [language, code, highlightedCode]);

  return (
    <div className="w-full">
      <div className="relative w-full rounded-sm bg-gray-50 p-5 focus-within:outline-none">
        <div>
          <select
            contentEditable={false}
            className="rounded-sm border-[2px] border-dotted bg-gray-100 p-1 text-stone-700"
            defaultValue={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <textarea
          contentEditable={false}
          className="w-full p-2 focus:outline-none"
          onChange={handleCodeChange}
        />
        <button
          onClick={handlePaste}
          className="absolute right-2 top-2 cursor-pointer"
        >
          <ClipboardPaste />
        </button>
        <div
          className={`language-${language} block overflow-auto p-3 text-base focus:outline-none`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          style={{ whiteSpace: "pre-line" }}
        ></div>
      </div>
      <p data-p-placeholder="Write your text..."></p>
    </div>
  );
};
