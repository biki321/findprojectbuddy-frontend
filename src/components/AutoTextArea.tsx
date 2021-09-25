import React, { useState, useEffect, useRef } from "react";
import "../styles/auto-textarea.css";

interface IProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minChars: number;
  maxChars: number;
  text: string;
  rows: number;
  required: boolean;
}

const AutoTextArea = ({
  onChange,
  minChars,
  maxChars,
  text,
  rows,
  required,
}: IProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto");

  useEffect(() => {
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
    console.log("use effect text a");
  }, [text]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`);

    onChange(event);
  };

  return (
    <div
      style={{
        minHeight: parentHeight,
      }}
    >
      <textarea
        required
        className="auto-textarea"
        ref={textAreaRef}
        rows={rows}
        style={{
          height: textAreaHeight,
        }}
        onChange={onChangeHandler}
        value={text}
      />
    </div>
  );
};

export default AutoTextArea;
