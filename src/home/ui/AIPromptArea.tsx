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
import styles from '../styles/ai_prompt_area.module.scss';
import clsx from "clsx";

interface Props {
  // generated_codes?: (codes: string[]) => void;
  // onSendPromptPresset?: () => void;
  // promptType: number;
  onSubmitPrompt: (prompt: string, idl: string | null) => void;
  onPromptChange?: (prompt: string) => void;
  disableComponents?: boolean;
  defaultPrompt?: string;
  optionVariants?: string[];
  optionVariantSelected?: number;
  onOptionVariantSelected?: (optionSelected: number) => void;
}

// export const AIPromptTextArea = ({ generated_codes, promptType, defaultValue = '', onPromptChange, onSendPromptPresset}: Props) => {
export const AIPromptArea = ({ 
  onSubmitPrompt, 
  onPromptChange, 
  disableComponents = false, 
  defaultPrompt = '', 
  optionVariants,
  optionVariantSelected = 0,
  onOptionVariantSelected = () => {}
}: Props) => {
  const fileRef = useRef<string | null>(null);
  const [promptText, setPromptText] = useState(defaultPrompt);

  const handleSubmitIDL = (fileContent: string) => {
    fileRef.current = fileContent;
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
              // options={[
              //   {
              //     label: 'xd',
              //     value: 'xd',
              //   },
              //   {
              //     label: 'xd1',
              //     value: 'xd1',
              //   },
              // ]}
              disabled={disableComponents}
              onChange={(e) => {
                const variantSelected = optionVariants.indexOf(e.target.value);
                onOptionVariantSelected(variantSelected);
              }}
              options={
                optionVariants.map((value, index) => {
                  return {
                    label: value,
                    value,
                    selected: index === optionVariantSelected,
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
          <ButtonUploadIDL 
            onIDLFileSubmit={handleSubmitIDL}
            disableButton={disableComponents}
          />
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
