import { AIInteractionContainer } from './AIInteractionContainer';
import React from 'react';
import styles from '../styles/ai_response.module.scss';
import clsx from 'clsx';
// import { CodeBlock, dracula } from 'react-code-blocks';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { dracula } from "@uiw/codemirror-theme-dracula";
// import Editor from "@monaco-editor/react";

interface Props {
  responseTitle: string;
  cornerLeftButtons?: React.ReactNode;
  code: string;
  lang: string;
  editable?: boolean;
  onCodeChange?: (value: string) => void;
  isUnderReview?: boolean;
}

export const AIResponse = ({ 
  responseTitle, 
  cornerLeftButtons, 
  code, 
  lang, 
  onCodeChange = () => {}, 
  editable = false,
  isUnderReview = true
}: Props) => {
  return (
    <AIInteractionContainer
      interactionTitle={responseTitle}
      leftSideChildren={cornerLeftButtons}
    >
      <div
        className={clsx(
          styles.codeContainer,
        )}
      >
        <CodeMirror
          value={code}
          // height="550px"
          // maxHeight='550px'
          extensions={lang === 'rust' ? [rust()] : [javascript()]}
          theme={dracula}
          editable={editable}          
          onChange={(value, _) => {
            onCodeChange(value);
          }}
        />
      </div>
    </AIInteractionContainer>
  );
};
