import { AIInteractionContainer } from './AIInteractionContainer';
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
        )}
      >
        <CodeBlock
          text={code}
          language={lang}
          showLineNumbers={true}
          theme={dracula}
        />
      </div>
    </AIInteractionContainer>
  );
};
