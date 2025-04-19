import { useRef } from "react";
import { 
  Button,
  Select,
} from "@gear-js/vara-ui";
import { Textarea } from "@chakra-ui/react";
import { GitpodIcon } from "../assets";
import { AIInteractionContainer } from "./AIInteractionContainer";
import { ButtonUploadIDL } from "./Buttons/ButtonUploadIDL";
import { 
  useState,
  useEffect
} from "react";
import type { 
  AIJavascriptComponentsOptions, 
  AIPromptOptions 
} from "../models/ai_options";
import styles from '../styles/ai_prompt_area.module.scss';
import clsx from "clsx";

interface Props {
  onSubmitPrompt: (prompt: string, idl: string | null) => void;
  onPromptChange?: (prompt: string) => void;
  disableComponents?: boolean;
  defaultPrompt?: string;
  optionVariants?: string[];
  optionSelected?: AIPromptOptions;
  optionVariantSelected?: AIJavascriptComponentsOptions;
  onOptionVariantSelected?: (optionSelected: AIJavascriptComponentsOptions) => void;
}

export const AIPromptArea = ({ 
  onSubmitPrompt, 
  onPromptChange, 
  disableComponents = false, 
  defaultPrompt = '', 
  optionVariants,
  optionSelected = 'Frontend',
  optionVariantSelected = 'SailsCalls',
  onOptionVariantSelected = () => {}
}: Props) => {
  const fileRef = useRef<string | null>(null);
  const [promptText, setPromptText] = useState(defaultPrompt);
  const [idlName, setIdlName] = useState<string | null>(null);

  const handleSubmitIDL = (fileContent: string, fileName: string) => {
    fileRef.current = fileContent;
    setIdlName(fileName);
  }

  const handlePromptText = (e:  React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPromptText(value);

    if (onPromptChange) onPromptChange(value);
  }

  const handleOnSubmitPrompt = () => {
    onSubmitPrompt(promptText, fileRef.current);
  }
  
  useEffect(() => {
    setPromptText(defaultPrompt);
  }, [defaultPrompt]);

  return (
    <AIInteractionContainer
      interactionTitle="PROMPT"
      leftSideChildren={(
        <>
          {
            optionVariants &&
            <Select 
              className={styles.selectFrontendOptions}
              disabled={disableComponents}
              onChange={(e) => {
                const indexVariantSelected = optionVariants.indexOf(e.target.value);
                const variantSelected = optionVariants[indexVariantSelected] as AIJavascriptComponentsOptions;
                onOptionVariantSelected(variantSelected);
              }}
              
              options={
                optionVariants.map(value => {
                  return {
                    label: value,
                    value,
                    selected: value === optionVariantSelected,
                  }
                })
              }
            />
          }
          <Button 
            text="Generate"
            size="x-large"
            isLoading={disableComponents}
            onClick={handleOnSubmitPrompt}
            className={
              clsx(
                styles.button,
                styles.buttonGreen
              )
            }
          />
          <a 
            href={
              optionSelected === 'Frontend'
              ? 'https://gitpod.io/new/#https://github.com/Vara-Lab/Frontend-Template.git'
              : optionSelected === 'Smart Contracts'
              ? 'https://gitpod.io/new/#https://github.com/Vara-Lab/Smart-Program-Template.git'
              : optionSelected === 'Server'
              ? 'https://gitpod.io/new/#https://github.com/Vara-Lab/Server-Template.git'
              : 'https://gitpod.io/new/#https://github.com/Vara-Lab/Frontend-Template.git'
            }
            target="_blank"
          >
            <Button  
              text="Open in Gitpod"
              icon={GitpodIcon}
              color="contrast"
              isLoading={disableComponents}
              className={
                clsx(
                  styles.button
                )
              }
            />
          </a>
          <ButtonUploadIDL 
            onIDLFileSubmit={handleSubmitIDL}
            disableButton={disableComponents}
          />
          <p
            className={styles.idlName}
          >
            {idlName ? idlName : ''}
          </p>
        </>
      )}
    >
      <Textarea
          focusBorderColor="green.400"
          borderColor='gray.200'
          backgroundColor='white'
          borderRadius={14}
          padding='30px 30px'
          resize='none'
          disabled={disableComponents}
          flex={1}
          placeholder="Add your instruction"
          value={promptText}
          onChange={handlePromptText}
        />
    </AIInteractionContainer>
  );
};
