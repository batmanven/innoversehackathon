

import mammoth from "mammoth";

export interface ExtractionResult {
  text: string;
  pageCount: number;
  charCount: number;
}

export class DocumentParseError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "UNSUPPORTED_FILE_TYPE"
      | "EXTRACTION_FAILED"
      | "FILE_EMPTY"
      | "FILE_TOO_LARGE"
  ) {
    super(message);
    this.name = "DocumentParseError";
  }
}


const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_TEXT_CHARS = 100_000; // Truncate to fit LLM context window safely
const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\n{3,}/g, "\n\n") // Collapse excessive blank lines
    .replace(/[ \t]+$/gm, "") // Trim trailing whitespace per line
    .trim();
}

// ─── PDF Extraction ─────────────────────────────────────────────────────────

async function extractFromPDF(file: File): Promise<ExtractionResult> {
  // Dynamic import to avoid loading pdf-parse at startup
  const { WebPDFLoader } = await import(
    "@langchain/community/document_loaders/web/pdf"
  );

  const loader = new WebPDFLoader(file, {
    splitPages: true,
    parsedItemSeparator: "\n",
  });

  const docs = await loader.load();

  if (!docs || docs.length === 0) {
    throw new DocumentParseError(
      "Could not extract any text from this PDF. It may be a scanned/image-only document.",
      "FILE_EMPTY"
    );
  }

  const fullText = docs.map((d) => d.pageContent).join("\n\n");
  const cleaned = cleanText(fullText);

  if (cleaned.length < 20) {
    throw new DocumentParseError(
      "The extracted text is too short. This PDF may contain only images or scanned content.",
      "FILE_EMPTY"
    );
  }

  return {
    text: cleaned.slice(0, MAX_TEXT_CHARS),
    pageCount: docs.length,
    charCount: cleaned.length,
  };
}

// ─── DOCX Extraction ────────────────────────────────────────────────────────

async function extractFromDOCX(file: File): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  const cleaned = cleanText(result.value);

  if (cleaned.length < 20) {
    throw new DocumentParseError(
      "The DOCX file appears to be empty or contains no readable text.",
      "FILE_EMPTY"
    );
  }

  // Estimate page count (~3000 chars per page is a rough heuristic)
  const estimatedPages = Math.max(1, Math.ceil(cleaned.length / 3000));

  return {
    text: cleaned.slice(0, MAX_TEXT_CHARS),
    pageCount: estimatedPages,
    charCount: cleaned.length,
  };
}

// ─── TXT Extraction ─────────────────────────────────────────────────────────

async function extractFromTXT(file: File): Promise<ExtractionResult> {
  const raw = await file.text();
  const cleaned = cleanText(raw);

  if (cleaned.length < 10) {
    throw new DocumentParseError(
      "The text file appears to be empty.",
      "FILE_EMPTY"
    );
  }

  const estimatedPages = Math.max(1, Math.ceil(cleaned.length / 3000));

  return {
    text: cleaned.slice(0, MAX_TEXT_CHARS),
    pageCount: estimatedPages,
    charCount: cleaned.length,
  };
}

// ─── Main Entry Point ───────────────────────────────────────────────────────

/**
 * Extract text from a File object. Supports PDF, DOCX, DOC, and TXT.
 *
 * @param file - The File object from an <input type="file"> or drag-and-drop
 * @returns ExtractionResult with text, pageCount, and charCount
 * @throws DocumentParseError with a specific error code
 */
export async function extractText(file: File): Promise<ExtractionResult> {
  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new DocumentParseError(
      `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 20 MB.`,
      "FILE_TOO_LARGE"
    );
  }

  // 2. Extension check
  const ext = getExtension(file.name);
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new DocumentParseError(
      `Unsupported file type "${ext}". Please upload a PDF, DOCX, or TXT file.`,
      "UNSUPPORTED_FILE_TYPE"
    );
  }

  // 3. Route to the appropriate extractor
  try {
    switch (ext) {
      case ".pdf":
        return await extractFromPDF(file);
      case ".docx":
      case ".doc":
        return await extractFromDOCX(file);
      case ".txt":
        return await extractFromTXT(file);
      default:
        throw new DocumentParseError(
          `Unsupported file type "${ext}".`,
          "UNSUPPORTED_FILE_TYPE"
        );
    }
  } catch (error) {
    // Re-throw our own errors
    if (error instanceof DocumentParseError) {
      throw error;
    }
    // Wrap unknown errors
    const message =
      error instanceof Error ? error.message : "Unknown extraction error";
    throw new DocumentParseError(
      `Failed to extract text: ${message}`,
      "EXTRACTION_FAILED"
    );
  }
}
