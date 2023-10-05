"use client";

import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { useChat } from "ai/react";
import { ChatInput } from "@/components/chat/chat-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconOpenAI, IconUser } from "@/components/ui/icons";
import Navbar from "@/components/layout/navbar";
import { FileTextIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import ExamplePrompts from "@/components/chat/example-prompts";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/pdf-panel/top-bar";
import { useToast } from "@/components/ui/use-toast";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
}

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export default function Sample() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  const { toast } = useToast();

  const [file, setFile] = useState<PDFFile>(null);
  const [text, setText] = useState<string>("");
  const [numPages, setNumPages] = useState<number>();
  const [selected, setSelected] = useState<boolean>(false);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0] || null);
    }

    setSelected(true);
  }

  function removeFile(): void {
    setFile(null);
    setSelected(false);
    toast({
      variant: "destructive",
      title: "Removed PDF",
      description: "Your data does not persist!",
    });
  }

  async function onDocumentLoadSuccess(
    pdfDocument: PDFDocumentProxy
  ): Promise<void> {
    try {
      const promises = [];

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber++
      ) {
        promises.push(
          pdfDocument.getPage(pageNumber).then((page) => page.getTextContent())
        );
      }

      const allTextContents = await Promise.all(promises);

      const extractedText = allTextContents
        .flatMap((textContent) =>
          // @ts-ignore
          textContent.items.map((item) => item.str).join(" ")
        )
        .join("\n");

      console.log(extractedText);
      setText(extractedText);
      setNumPages(pdfDocument.numPages);

      toast({
        title: "PDF successfully loaded!",
        description: "Text also successfully extracted!",
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  }

  return (
    <>
      <div className="flex">
        <div className="w-1/2 overflow-auto h-screen border-r">
          {!selected ? (
            <div className="flex flex-col items-center">
              <div className="mt-12">
                <div className="px-6 sm:px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tightsm:text-4xl">
                      Welcome to{" "}
                      <span className="text-primary">DocuTalkAI</span>
                      <br />
                      <br />A free AI chatbot for your PDFs and documents.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                      PDF Chat is a free AI chatbot that can answer questions
                      about your PDFs. Simply upload a PDF and start chatting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {file ? <TopBar removeFile={removeFile} /> : null}

          <div className="mt-12">
            {file ? (
              <div className="flex flex-col items-center mb-16">
                {file && (
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        className="w-full"
                      />
                    ))}
                  </Document>
                )}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="relative block w-full rounded-lg border-2 border-dashed  p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <div className="text-center">
                    <FileTextIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold ">
                      No PDF selected
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get started by uploading a file.
                    </p>
                    <p
                      className="mt-1 text-sm hover:underline cursor-pointer w-fit mx-auto text-muted-foreground"
                      onClick={() => {
                        setFile("/sample.pdf");
                        setSelected(true);
                      }}
                    >
                      Or try a sample PDF here.
                    </p>
                    <div className="mt-6">
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={onFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 h-screen overflow-y-auto">
          <Navbar />

          <div className="flex flex-col w-full py-4 pb-24 mx-auto stretch space-y-4 px-2">
            {messages.length > 0 ? (
              messages.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap">
                  <div className="flex items-start gap-2">
                    {m.role === "user" ? (
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          <IconUser />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          <IconOpenAI />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {m.role === "user" ? (
                      <div className="flex w-max flex-col rounded-lg px-3 py-3 text-sm bg-primary text-primary-foreground font-light">
                        {m.content}
                      </div>
                    ) : (
                      <div className="flex w-max flex-col gap-2 rounded-lg px-3 py-3 text-sm bg-muted">
                        {m.content}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      <IconUser />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex w-max flex-col rounded-lg px-3 py-3 text-sm bg-primary text-primary-foreground font-light">
                    How can PDF Chat help me?
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Avatar>
                    <AvatarFallback className="">
                      <IconOpenAI />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex w-max flex-col gap-2 rounded-lg px-3 py-3 text-sm bg-muted">
                    As an AI chatbot, PDF Chat can answer questions about your
                    PDFs. Simply upload a PDF and start chatting.
                    <br />
                    <br />
                    Treat PDF Chat as a human and have a conversation with it to
                    get the most desired results.
                    <br />
                    <br />
                    Here are some example prompts to help you conversate &darr;
                    <br />
                    <br />
                    <ExamplePrompts />
                  </div>
                </div>
              </>
            )}

            {/* @ts-ignore */}
            <ChatInput
              handleSubmit={handleSubmit}
              input={input}
              setInput={setText}
              text={text}
              handleInputChange={handleInputChange}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
