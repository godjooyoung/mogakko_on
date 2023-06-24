import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { styled } from 'styled-components';

const CodeEditor = ({ code, language, onChange }) => {
  const editorRef = useRef(null);
  console.log('languagelanguage',language)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.onDidChangeModelContent(() => {
        // 에디터 내용이 변경되면 폰트 사이즈를 다시 설정
        editorRef.current.editor.layout();
      });
    }
  }, []);

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto'
    },
    isWholeLine: true,
    lineHeight: 20,
    fontSize: 15,
    wordWrap: 'off'
  };

  return (
    <CodeEditorWrap>
      <MonacoEditor
        ref={editorRef}
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={editorOptions}
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