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
import { useAlert } from '@gear-js/react-hooks';
import type { 
  AIPromptOptions,
  AIFrontendFrontendOptions,
} from '../models/ai_options';
import styles from '../styles/ai_section.module.scss';

type AgentCode = string | null;

interface ResponseTitles {
  [key: string]: string | [string, string]
}

interface Data {
  responseTitle: string | [string,string];
  optionSelected: AIPromptOptions;
  frontendOptionSelected: AIFrontendFrontendOptions;
}

const options = ['Frontend', 'Smart Contracts', 'Server', 'Web3 abstraction'];
const responseTitles: ResponseTitles = {
  'Frontend': ['REACT COMPONENT', 'CLIENT'],
  'Smart Contracts': ['LIB.RS', 'SERVICE'],
  'Server': ['SCRIPT', 'CLIENT'], 
  'Web3 abstraction': 'ABSTRACTION'
}
const AIFrontendFrontendOptions = [
  'SailsCalls',
  'GasLess',
  'Signless',
  'Sailsjs',
  'WalletConnect'
];
 
export const AISection = () => {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>('Frontend');
  const [optionFrontendVariantSelected, setOptionFrontendVariantSelected] = useState<AIFrontendFrontendOptions>('SailsCalls');
  const [aiResponseTitle, setAIResponseTitle] = useState(responseTitles[optionSelected]);
  const [codes, setCodes] = useState<[AgentCode, AgentCode]>([null, null]);
  const [firstOptionSelected, setFirstOptionSelected] = useState(false); 
  const [dataToUse, setDataToUse] = useState<Data>({ 
    responseTitle: '',
    optionSelected: 'Frontend',
    frontendOptionSelected: 'SailsCalls'
  });

  const alert = useAlert();

  // [TODO]: add this section has a bug, solve it to copy the correct code
  const { hasCopied, onCopy } = useClipboard(
    dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'WalletConnect'
      ? codes[0] as string
      : codes[firstOptionSelected ? 0 : 1] as string
    // dataToUse.optionSelected === 'Smart Contracts'
    //   ? codes[!firstOptionSelected ? 0 : 1]
    //   : codes[0]
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
    setCodes([null, null]);

    let codes: [AgentCode, AgentCode] = [null, null];
  
    try {
      switch (optionSelected) {
        case 'Frontend':
          if (optionFrontendVariantSelected === 'WalletConnect') {
            console.log('Sending frontend WalletConnect question ...');
            codes = [await sendFrontendWalletconnectQuestion(prompt), null];
            break;
          }

          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }

          switch (optionFrontendVariantSelected) {
            case 'SailsCalls':
              console.log('Sending frontend SailsCalls question ...');
              codes = await sendFrontendSailsCallsQuestion(prompt, idl);
              break;
            case 'GasLess':
              console.log('Sending frontend GasLess question ...');
              codes = await sendFrontendGaslessQuestion(prompt, idl);
              break;
            case 'Signless':
              console.log('Sending frontend Signless question ...');
              codes = await sendFrontendSignlessQuestion(prompt, idl);
              break;
            case 'Sailsjs':
              console.log('Sending frontend SailsJs question ...');
              codes = await sendFrontendSailsjsQuestion(prompt, idl);
              break;
          }
          break;
        case 'Smart Contracts':
          console.log('Sendind contract question ...')
          codes = await sendContractQuestion(prompt);
          break;
        case 'Server':
          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }
          console.log('Sending server question ...');
          codes = await sendServerQuestion(prompt, idl);
          break;
        case 'Web3 abstraction': 
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
    const aiIndexOptionSelected = options.indexOf(optionSelected);
    const userPrompts = [...prompts];
    userPrompts[aiIndexOptionSelected] = promptUpdated;
    setPrompts(userPrompts);
  }

  const handleSelected = (_name: string, id: AIPromptOptions) => {
    const aiIndexOptionSelected = options.indexOf(id);
    const title = responseTitles[options[aiIndexOptionSelected]];

    setAIResponseTitle(title);
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
          defaultPrompt={prompts[options.indexOf(optionSelected)]}
          disableComponents={waitingForAgent}
          optionVariants={optionSelected === 'Frontend' ? AIFrontendFrontendOptions : undefined}
          optionVariantSelected={optionSelected === 'Frontend' ? optionFrontendVariantSelected : undefined}
          optionSelected={optionSelected}
          onOptionVariantSelected = {optionSelected === 'Frontend' 
            ? (optionSelected) => {
                setOptionFrontendVariantSelected(optionSelected);
              }
            : undefined
          }
        />
        {
          codes[0] && (
            <AIResponse
              responseTitle={
                dataToUse.optionSelected !== 'Web3 abstraction'
                ? dataToUse.responseTitle[ firstOptionSelected ? 0 : 1 ]
                : 'Abstraction'
              }
              code={ 
                (dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'WalletConnect')
                  ? codes[0] as string
                  : codes[firstOptionSelected ? 0 : 1] as string
              }
              lang={dataToUse.optionSelected === 'Smart Contracts' ? 'rust' : 'javascript'}
              cornerLeftButtons={
                <>
                  {
                    // ((dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected !== 'WalletConnect')  || dataToUse.optionSelected === 'Server') && (
                    (!(dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'WalletConnect')) && (<>
                      <Button
                        // text={ firstOptionSelected ? (dataToUse.optionSelected === 'Server' ? 'Script' : 'Component') : 'Client' }
                        text={
                          dataToUse.optionSelected === 'Smart Contracts'
                          ? 'service'
                          : 'client'
                        }
                        size="x-large"
                        color={ !firstOptionSelected ? 'primary' : 'contrast' }
                        className={styles.button}
                        onClick={() => {
                          setFirstOptionSelected(false);
                        }}
                      />
                      <Button
                        // text={ firstOptionSelected ? (dataToUse.optionSelected === 'Server' ? 'Script' : 'Component') : 'Client' }
                        text={
                          dataToUse.optionSelected === 'Frontend'
                          ? 'Component'
                          : dataToUse.optionSelected === 'Server'
                          ? 'Script'
                          : dataToUse.optionSelected === 'Smart Contracts'
                          ? 'lib.rs'
                          : 'Abstraction'
                        }
                        size="x-large"
                        // color='contrast'
                        color={ firstOptionSelected ? 'primary' : 'contrast' }
                        className={styles.button}
                        onClick={() => {
                          setFirstOptionSelected(true);
                        }}
                      />
                      </>
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























