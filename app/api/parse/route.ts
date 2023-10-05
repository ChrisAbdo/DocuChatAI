// app/api/pdf-parse/route.ts

import pdfParse from "pdf-parse";
import { type NextRequest } from "next/server";

type PdfParseResponse = {
  text: string;
};

export async function POST(request: NextRequest) {
  if (!request.body) {
    return new Response(JSON.stringify({ error: "Missing request body." }), {
      status: 400,
    });
  }

  const { file } = await request.json();
  if (!file) {
    return new Response(
      JSON.stringify({ error: "Missing file in request body." }),
      {
        status: 400,
      }
    );
  }

  try {
    const dataBuffer = Buffer.from(file, "base64");
    const data: PdfParseResponse = await pdfParse(dataBuffer);
    return new Response(JSON.stringify({ text: data.text }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to extract text from PDF." }),
      {
        status: 500,
      }
    );
  }
}
