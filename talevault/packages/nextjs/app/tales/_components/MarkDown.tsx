"use client";

import React from "react";
// import rehypeSanitize from "rehype-sanitize";
import MarkdownPreview from "@uiw/react-markdown-preview";
import MDEditor from "@uiw/react-md-editor";

export default function MarkDown({ story, setStory }: any) {
  
  return (
    <div className="container">
      <MDEditor
        className="rounded-full"
        value={story}
        visibleDragbar={false}
        onChange={setStory}
      />
      {/* <MDEditor.Markdown source={value} /> */}
    </div>
  );
}
