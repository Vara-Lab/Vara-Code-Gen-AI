import { GrayContainer } from "@/shared/ui/Containers/GrayContainer/GrayContainer";
import { Button } from "@gear-js/vara-ui";
import { Textarea } from "@chakra-ui/react";
import { GitpodIcon } from "../assets";
import styles from '../styles/ai_prompt_area.module.scss';
import clsx from "clsx";

export const AIPromptTextArea = () => {
  return (
    <div
      className={styles.promptAreaContainer}
    >
      <GrayContainer
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '85%',
          padding: '0 20px 20px 20px',
          minHeight: '20rem',
        }}
      >
        <div
          className={styles.textAreaData}
        >
          <h3
            className={styles.promtText}
          >
            PROMPT
          </h3>
          <div
            className={styles.buttonsContainer}
          >
            <Button 
              text="Generate"
              size="x-large"
              className={
                clsx(
                  styles.button,
                  styles.buttonGreen
                )
              }
            />
            <Button  
              color="contrast"
              className={
                clsx(
                  styles.button
                )
              }
            >
              <GitpodIcon />
              Open in Gitpod
            </Button>
            <Button 
              text="Upload IDL" 
              color="contrast"
              className={
                clsx(
                  styles.button
                )
              }
            />
          </div>
        </div>
       
        <Textarea
          focusBorderColor="green.400"
          borderColor='gray.200'
          backgroundColor='white'
          borderRadius={14}
          padding='30px 30px'
          resize='none'
          flex={1}
          placeholder="Add your instruction"
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
      </GrayContainer>
    </div>
  )
};
