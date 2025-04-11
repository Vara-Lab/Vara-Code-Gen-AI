import { AIOptionSelection } from './AIOptionSelection';
import { AIPromptArea } from './AIPromptArea';
import { AIResponse } from './AIResponse';
import { useClipboard } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Button } from '@gear-js/vara-ui';
import { 
  sendFrontendGaslessQuestion,
  sendFrontendSignlessQuestion,
  sendFrontendSailsCallsQuestion,
  sendFrontendSailsjsQuestion,
  sendFrontendWalletconnectQuestion,
  sendContractQuestion, 
  sendServerQuestion
} from '../api/agent_calls';
import styles from '../styles/ai_section.module.scss';
import { useAlert } from '@gear-js/react-hooks';

interface ResponseTitles {
  [key: string]: string | [string, string]
}

interface Data {
  responseTitle: string | [string,string];
  optionSelected: number;
  frontendOptionSelected: number;
}

const options = ['Frontend', 'Smart Contracts', 'Server', 'Web3 abstraction'];
const responseTitles: ResponseTitles = {
  'Frontend': 'REACT COMPONENT',
  'Smart Contracts': 'SMART CONTRACT',
  'Server': ['SCRIPT', 'CLIENT'], 
  'Web3 abstraction': 'ABSTRACTION'
}
const frontendOptions = [
  'SailsCalls',
  'GasLess',
  'Signless',
  'Sailsjs',
  'WalletConnect'
];
 
export const AISection = () => {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [optionSelected, setOptionSelected] = useState(0);
  const [optionFrontendVariantSelected, setOptionFrontendVariantSelected] = useState(0);
  const [aiResponseTitle, setAIResponseTitle] = useState(responseTitles[options[optionSelected]]);
  const [codes, setCodes] = useState<string[]>([]);
  // const [serverScriptSelected, setServerScriptSelected] = useState(true);
  const [clientSelected, setClientSelected] = useState(false);
  const [dataToUse, setDataToUse] = useState<Data>({ 
    responseTitle: '',
    optionSelected: 0,
    frontendOptionSelected: 0
  });

  const alert = useAlert();

  const { hasCopied, onCopy } = useClipboard(
    dataToUse.optionSelected === 1
      ? codes[!clientSelected ? 0 : 1]
      : codes[0]
  );

  const handleOnSubmitPrompt = async (prompt: string, idl: string | null = '') => {
    if (prompt.length == 0) {
      console.error('prompt cant be empty');
      alert.error('Prompt cant be empty')
      return;
    }

    setDataToUse({
      responseTitle: aiResponseTitle,
      optionSelected,
      frontendOptionSelected: optionFrontendVariantSelected
    });
    setWaitingForAgent(true);
    setCodes([]);

    let codes: string[] = [];
  
    try {
      switch (optionSelected) {
        case 0:
          if (optionFrontendVariantSelected === 4) {
            console.log('Sending frontend WalletConnect question ...');
            codes = [await sendFrontendWalletconnectQuestion(prompt)];
            break;
          }

          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }

          switch (optionFrontendVariantSelected) {
            case 0:
              console.log('Sending frontend SailsCalls question ...');
              codes = await sendFrontendSailsCallsQuestion(prompt, idl);
              break;
            case 1:
              console.log('Sending frontend GasLess question ...');
              codes = await sendFrontendGaslessQuestion(prompt, idl);
              break;
            case 2:
              console.log('Sending frontend Signless question ...');
              codes = await sendFrontendSignlessQuestion(prompt, idl);
              break;
            case 3:
              console.log('Sending frontend SailsJs question ...');
              codes = await sendFrontendSailsjsQuestion(prompt, idl);
              break;
          }
          break;
        case 1:
          console.log('Sendind contract question ...')
          codes = [await sendContractQuestion(prompt)];
          break;
        case 2:
          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }
          console.log('Sending server question ...');
          // codes = [ script, client ]
          codes = await sendServerQuestion(prompt, idl);
          break;
        case 4: 
          console.log('sending web3 abstraction question');
          break;
        default:
          console.log('No option selected');
          // [TODO]: set an alert for this option
      }
    } catch(e) {
      // [TODO]: add a warning if any error occurs
      const error = (e as Error).message;
      console.log(error);
      setWaitingForAgent(false);
      return;
    }

    setCodes(codes);
    setWaitingForAgent(false);
  }

  const handleOnPromptChange = (promptUpdated: string) => {
    const userPrompts = [...prompts];
    userPrompts[optionSelected] = promptUpdated;
    setPrompts(userPrompts);
  }

  const handleSelected = (_name: string, id: number) => {
    setAIResponseTitle(responseTitles[options[id]]);
    setOptionSelected(id);  
  };

  return (
    <div
        className={styles.container}
    >
        <AIOptionSelection  
            options={options}
            selected={handleSelected}
            currentSelected={optionSelected}
            waitingForResponse={waitingForAgent}
        />
        <AIPromptArea 
          onSubmitPrompt={handleOnSubmitPrompt}
          onPromptChange={handleOnPromptChange}
          defaultPrompt={prompts[optionSelected]}
          disableComponents={waitingForAgent}
          optionVariants={optionSelected === 0 ? frontendOptions : undefined}
          optionVariantSelected={optionSelected === 0 ? optionFrontendVariantSelected : undefined}
          onOptionVariantSelected = {optionSelected === 0 
            ? (optionSelected) => {
                setOptionFrontendVariantSelected(optionSelected);
              }
            : undefined
          }
        />
        {
          codes.length > 0 && (
            <AIResponse
              responseTitle={
                dataToUse.optionSelected === 2 
                 ? dataToUse.responseTitle[ !clientSelected ? 0 : 1 ]
                 : dataToUse.responseTitle as string
              }
              code={ 
                  (dataToUse.optionSelected === 2 || (dataToUse.optionSelected === 0 && dataToUse.frontendOptionSelected !== 4))
                  ? codes[!clientSelected ? 0 : 1]
                  : codes[0]
              }
              lang={dataToUse.optionSelected === 1 ? 'rust' : 'javascript'}
              cornerLeftButtons={
                <>
                  {
                    ((dataToUse.optionSelected === 0 && dataToUse.frontendOptionSelected !== 4)  || dataToUse.optionSelected === 2) && (

                      <Button
                        text={ clientSelected ? (dataToUse.optionSelected === 2 ? 'Script' : 'Component') : 'Client' }
                        size="x-large"
                        color='contrast'
                        className={styles.button}
                        onClick={() => {
                          setClientSelected(!clientSelected);
                        }}
                      />
                    )
                  }
                  <Button
                    text={ hasCopied ? 'Copied!' : 'Copy' }
                    size="x-large"
                    color='contrast'
                    className={styles.button}
                    onClick={() => {
                      onCopy();
                    }}
                  />
                </>
              }
            />
          )
        }
    </div>
  );
};
