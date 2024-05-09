"use client";
import React from "react";
import MDEditor from '@uiw/react-md-editor';
// import rehypeSanitize from "rehype-sanitize";
import MarkdownPreview from '@uiw/react-markdown-preview';
export default function MarkDown() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
       className="rounded-full"
        value={value}
        visibleDragbar={false}
        onChange={setValue}
        
        
      />
        {/* <MDEditor.Markdown source={value} /> */}
    </div>
  );
}
