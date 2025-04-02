import { AIInteractionContainer } from './AIInteractionContainer';
// import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React from 'react';
import styles from '../styles/ai_response.module.scss';
import clsx from 'clsx';
import { CodeBlock, dracula } from 'react-code-blocks';

interface Props {
  responseTitle: string;
  cornerLeftButtons?: React.ReactNode;
  code: string;
  lang: string;
}

export const AIResponse = ({ responseTitle, cornerLeftButtons, code, lang }: Props) => {
  return (
    <AIInteractionContainer
      interactionTitle={responseTitle}
      leftSideChildren={cornerLeftButtons}
    >
      <div
        className={clsx(
          styles.codeContainer,
          // styles.scrollContainer
        )}
      >
        <CodeBlock
          text={code}
          language={lang}
          showLineNumbers={true}
          theme={dracula}
          // wrapLines={true}
        />

{/* <SyntaxHighlighter
          language={lang}
          showLineNumbers={true}
          wrapLongLines={true}
          style={vscDarkPlus}
          customStyle={{
            marginTop: '0',
            marginBottom: '0',
          }}
        >
          {code}
        </SyntaxHighlighter> */}
      </div>
    </AIInteractionContainer>
  );
};
