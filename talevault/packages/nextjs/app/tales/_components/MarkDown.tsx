"use client";
import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function MarkDown() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        // height={100}

        // minHeight={50}
        visibleDragbar={false}
        onChange={setValue}
      />
    </div>
  );
}