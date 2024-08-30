import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const languageExtensions = {
  cpp,
  python,
  javascript,
};

const themes = { vscodeDark };

const CodeEditorWindow = ({
  onChange,
  language = "python",
  code,
  theme = "vscodeDark",
}) => {
  const handleEditorChange = (value) => {
    onChange("code", value);
  };

  return (
    <div className="w-full h-full bg-gray-900 p-4 rounded-md shadow-lg">
      <CodeMirror
        value={code}
        height="75vh"
        theme={themes[theme]}
        language={language}
        extensions={language !== "c" ? [languageExtensions[language]()] : []}
        onChange={handleEditorChange}
        options={{
          lineNumbers: true,
          indentUnit: 4,
          tabSize: 4,
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
