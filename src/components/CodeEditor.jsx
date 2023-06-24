import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { styled } from 'styled-components';

const CodeEditor = ({ code, language, onChange }) => {

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <CodeEditorWrap>
      <MonacoEditor
        height='528px'
        width='981px'
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </CodeEditorWrap>
  );
};

const CodeEditorWrap = styled.div`
  width: 981px;
  height: 528px;

  input {
    font-size: 15px;
  }
  span {
    font-size: 15px;
  }
`;

export default CodeEditor;