import { AIOptionSelection } from './AIOptionSelection';
import { AIPromptArea } from './AIPromptArea';
import { AIResponse } from './AIResponse';
import { useClipboard } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@gear-js/vara-ui';
import { 
  sendFrontendGaslessQuestion,
  sendFrontendSignlessQuestion,
  sendFrontendSailsCallsQuestion,
  sendFrontendSailsjsQuestion,
  sendFrontendWalletconnectQuestion,
  sendFrontendGearjsQuestion,
  sendFrontendGearHooksQuestion,
  sendContractQuestion, 
  sendServerQuestion
} from '../api/agent_calls';
import { useAlert } from '@gear-js/react-hooks';
import type { 
  AIPromptOptions,
  AIJavascriptComponentsOptions,
} from '../models/ai_options';
import { VoiceRecorderButton } from './VoiceRecording';
import styles from '../styles/ai_section.module.scss';

type AgentCode = string | null;

interface ResponseTitles {
  [key: string]: string | [string, string]
}

interface Data {
  responseTitle: string | [string,string];
  optionSelected: AIPromptOptions;
  frontendOptionSelected: AIJavascriptComponentsOptions;
}

interface AIJavascriptComponents {
  optionFrontendVariantSelected: AIJavascriptComponentsOptions;
  optionAbstractionVariantSelected: AIJavascriptComponentsOptions;
  frontendVariantSelected: boolean;
}

const options = ['Frontend', 'Smart Contracts', 'Server', 'Web3 abstraction'];
const responseTitles: ResponseTitles = {
  'Frontend': ['REACT COMPONENT', 'CLIENT'],
  'Smart Contracts': ['LIB.RS', 'SERVICE'],
  'Server': ['SCRIPT', 'CLIENT'], 
  'Web3 abstraction': 'ABSTRACTION'
}
const AIFrontendComponentsOptions = [
  'Gearjs',
  'Sailsjs',
  'GearHooks',
  'WalletConnect',
  'SailsCalls',
];

const AIAbstractionComponentsOptions = [
  'GasLess',
  'Signless',
];
 
export const AISection = () => {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>('Frontend');



  const [javascriptComponentSelected, setJavascriptComponentSelected] = useState<AIJavascriptComponents>({
    optionFrontendVariantSelected: 'Gearjs',
    optionAbstractionVariantSelected: 'GasLess',
    frontendVariantSelected: true
  });

  const [aiResponseTitle, setAIResponseTitle] = useState(responseTitles[optionSelected]);
  const [codes, setCodes] = useState<[AgentCode, AgentCode]>([null, null]);
  const [firstOptionSelected, setFirstOptionSelected] = useState(false); 
  const [dataToUse, setDataToUse] = useState<Data>({ 
    responseTitle: '',
    optionSelected: 'Frontend',
    frontendOptionSelected: 'Gearjs'
  });

  const alert = useAlert();

  const { hasCopied, onCopy } = useClipboard(
    dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'WalletConnect'
      ? codes[0] as string
      : codes[firstOptionSelected ? 0 : 1] as string
  );

  const handleOnSubmitPrompt = async (prompt: string, idl: string | null = '') => {
    if (prompt.length == 0) {
      console.error('prompt cant be empty');
      alert.error('Prompt cant be empty')
      return;
    }

    const optionJavascriptSelected = javascriptComponentSelected.frontendVariantSelected
      ? javascriptComponentSelected.optionFrontendVariantSelected
      : javascriptComponentSelected.optionAbstractionVariantSelected;

    setDataToUse({
      responseTitle: aiResponseTitle,
      optionSelected,
      frontendOptionSelected: optionJavascriptSelected  // optionFrontendVariantSelected
    });
    setWaitingForAgent(true);
    setCodes([null, null]);

    let codes: [AgentCode, AgentCode] = [null, null];
  
    try {
      switch (optionSelected) {
        case 'Frontend':
          const { optionFrontendVariantSelected } = javascriptComponentSelected;

          if (optionFrontendVariantSelected === 'WalletConnect') {
            console.log('Sending frontend WalletConnect question ...');
            codes = [await sendFrontendWalletconnectQuestion(prompt), null];
            break;
          }

          if (optionFrontendVariantSelected === 'Gearjs') {
            console.log('Sending frontend Gearjs question ...');
            codes = [await sendFrontendGearjsQuestion(prompt), null];
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
            case 'Sailsjs':
              console.log('Sending frontend SailsJs question ...');
              codes = await sendFrontendSailsjsQuestion(prompt, idl);
              break;
            case 'GearHooks':
              console.log('Sending frontend Gear Hooks question ...');
              codes = await sendFrontendGearHooksQuestion(prompt, idl);
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
          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }

          const { optionAbstractionVariantSelected } = javascriptComponentSelected;

          // console.log('sending web3 abstraction question ...');

          switch (optionAbstractionVariantSelected) {
            case 'GasLess':
              console.log('Sending Abstraction GasLess question ...');
              codes = await sendFrontendGaslessQuestion(prompt, idl);
              break;
            case 'Signless':
              console.log('Sending Abstraction Signless question ...');
              codes = await sendFrontendSignlessQuestion(prompt, idl);
              break;
          }
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

  useEffect(() => {
    if (optionSelected === 'Frontend') {
      setJavascriptComponentSelected({
        ...javascriptComponentSelected,
        frontendVariantSelected: true,
      });
    }

    if (optionSelected === 'Web3 abstraction') {
      setJavascriptComponentSelected({
        ...javascriptComponentSelected,
        frontendVariantSelected: false,
      });
    }
  }, [optionSelected]);

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
          optionVariants={ 
            optionSelected === 'Frontend' 
            ? AIFrontendComponentsOptions 
            : optionSelected === 'Web3 abstraction'
            ? AIAbstractionComponentsOptions
            : undefined
          }
          optionVariantSelected={
            // optionSelected === 'Frontend' ? optionFrontendVariantSelected : undefined
            optionSelected === 'Frontend'
            ? javascriptComponentSelected.optionFrontendVariantSelected
            : optionSelected === 'Web3 abstraction'
            ? javascriptComponentSelected.optionAbstractionVariantSelected
            : undefined
          }
          optionSelected={optionSelected}
          onOptionVariantSelected = {optionSelected === 'Frontend' || optionSelected === 'Web3 abstraction'
            ? (optionSelected) => {
                // setOptionFrontendVariantSelected(optionSelected);
                if (javascriptComponentSelected.frontendVariantSelected) {
                  setJavascriptComponentSelected({
                    ...javascriptComponentSelected,
                    optionFrontendVariantSelected: optionSelected as AIJavascriptComponentsOptions
                  });
                } else {
                  setJavascriptComponentSelected({
                    ...javascriptComponentSelected,
                    optionAbstractionVariantSelected: optionSelected as AIJavascriptComponentsOptions
                  });
                }
              }
            : undefined
          }
        />

        <VoiceRecorderButton 
          onResult={handleOnPromptChange}
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
                (dataToUse.optionSelected === 'Frontend' && (dataToUse.frontendOptionSelected === 'WalletConnect' || dataToUse.frontendOptionSelected === 'Gearjs'))
                  ? codes[0] as string
                  : codes[firstOptionSelected ? 0 : 1] as string
              }
              lang={dataToUse.optionSelected === 'Smart Contracts' ? 'rust' : 'javascript'}
              cornerLeftButtons={
                <>
                  {
                    (!(dataToUse.optionSelected === 'Frontend' && (dataToUse.frontendOptionSelected === 'WalletConnect' || dataToUse.frontendOptionSelected === 'Gearjs'))) && (<>
                      <Button
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


