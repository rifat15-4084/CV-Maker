"use client";

import { useParams } from "next/navigation";
import { EditorLoader } from "@/components/editor/editor-loader";

/** Reads the `cvId` route param on the client and hands it to the loader. */
export function EditorRoute() {
  const params = useParams<{ cvId: string }>();
  const cvId = typeof params?.cvId === "string" ? params.cvId : "";
  return <EditorLoader cvId={cvId} />;
}
