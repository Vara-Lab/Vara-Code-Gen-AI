import { AIOptionSelection } from './AIOptionSelection';
import { AIPromptArea } from './AIPromptArea';
import { AIResponse } from './AIResponse';
import { useClipboard } from '@chakra-ui/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from '@gear-js/vara-ui';
import { 
  sendWeb3AbstractionGasLessFrontendQuestion,
  sendWeb3AbstractionSignlessEzTransactionsQuestion,
  sendWeb3AbstractionGasLessServerQuestion,
  sendWeb3AbstractionGasLessEzTransactionsQuestion,
  sendFrontendSailsjsQuestion,
  sendFrontendGearjsQuestion,
  sendFrontendGearHooksQuestion,
  sendContractOptimizationQuestion,
  sendContractQuestion, 
  sendServerQuestion,
  client_idl_code as clientIdlCode
} from '../api/agent_calls';
import { useAlert } from '@gear-js/react-hooks';
import type { 
  AIPromptOptions,
  AIJavascriptComponentsOptions,
} from '../models/ai_options';
import { VoiceRecorderButton } from './VoiceRecording';
import { AgentResponse } from '../models/agent_question';
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
  'Frontend': ['REACT COMPONENT', 'LIB'],
  'Smart Contracts': ['LIB.RS', 'SERVICE'],
  'Server': ['SCRIPT', 'LIB'], 
  'Web3 abstraction': 'ABSTRACTION'
}
const AIFrontendComponentsOptions = [
  'Gearjs',
  'Sailsjs',
  'GearHooks',
  // 'WalletConnect',
  // 'SailsCalls',
];

const AIAbstractionComponentsOptions = [
  // "GasLess/Frontend",
  "GasLess/Server",
  "GasLess/ez-transactions",
  "SignLess/ez-transactions"
];
 
export const AISection = () => {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>('Frontend');

  const [javascriptComponentSelected, setJavascriptComponentSelected] = useState<AIJavascriptComponents>({
    optionFrontendVariantSelected: 'Gearjs',
    // optionAbstractionVariantSelected: 'GasLess/Frontend',
    optionAbstractionVariantSelected: 'GasLess/Server',
    frontendVariantSelected: true
  });

  const [aiResponseTitle, setAIResponseTitle] = useState(responseTitles[optionSelected]);
  const [codes, setCodes] = useState<[AgentCode, AgentCode]>([null, null]);
  const [idlData, setIdlData] = useState({
    idl: '',
    client: '',
    idlChanged: false,
  });
  const [firstOptionSelected, setFirstOptionSelected] = useState(false); 
  const [dataToUse, setDataToUse] = useState<Data>({ 
    responseTitle: '',
    optionSelected: 'Frontend',
    frontendOptionSelected: 'Gearjs'
  });

  const [contractHistory, setContractHistory] = useState<AgentResponse[]>([]);
  const currentContractCode = useRef<{lib: string, service: string}>({
    lib: '',
    service: '',
  });

  const alert = useAlert();

  const { hasCopied, onCopy } = useClipboard(
    (dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'Gearjs') ||
    (
      dataToUse.optionSelected === 'Web3 abstraction' && (
        dataToUse.frontendOptionSelected === 'GasLess/Frontend' ||
        // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
        dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'
      )
    )
      ? codes[0] as string
      : codes[firstOptionSelected ? 0 : 1] as string
  );

  const handleOnSubmitPrompt = async (prompt: string, idl: string | null = '', updateContract = false) => {
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
    let clientCode = '';
  
    try {
      switch (optionSelected) {
        case 'Frontend':
          const { optionFrontendVariantSelected } = javascriptComponentSelected;

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

          if (idlData.idlChanged) {
            console.log('Generating client code ...');
            clientCode = await clientIdlCode(idl);
            setIdlData({
              idl,
              client: clientCode,
              idlChanged: false
            });
          } else {
            console.log('Se reuso la data');
            clientCode = idlData.client;
          }

          switch (optionFrontendVariantSelected) {
            case 'Sailsjs':
              console.log('Sending frontend SailsJs question ...');
              codes = [await sendFrontendSailsjsQuestion(prompt, idl), clientCode];
              break;
            case 'GearHooks':
              console.log('Sending frontend Gear Hooks question ...');
              codes = [await sendFrontendGearHooksQuestion(prompt, idl), clientCode];
              break;
          }
          break;
        case 'Smart Contracts':
          console.log('Sendind contract question ...');

          if (contractHistory.length > 8) {
            alert.error('cant be optimized further');
            setWaitingForAgent(false);
            // setContractOptimizationSelected(false);
            setCodes([
              currentContractCode.current.lib,
              currentContractCode.current.service
            ]);
            return;
          }
          
          // if (contractOptimizationSelected && contractHistory.length > 0 && contractHistory.length < 9) {
          if (updateContract && contractHistory.length > 0 && contractHistory.length < 9) {
            const contractCode = `
            ${currentContractCode.current.lib}\n
            ${currentContractCode.current.service}
            `;

            codes = await sendContractOptimizationQuestion(
              prompt,
              contractCode,
              formatContractHistory()
            );

            setContractHistory([
              ...contractHistory,
              {
                userPrompt: prompt,
                agentResponse: `${codes[0]}\n${codes[1]}`,
              }
            ]);

            currentContractCode.current.lib = codes[0] as string;
            currentContractCode.current.service = codes[1] as string;

            break;
          }
          codes = await sendContractQuestion(prompt);
          setContractHistory([{
            userPrompt: prompt,
            agentResponse: `${codes[0]}\n${codes[1]}`,
          }]);
          break;
        case 'Server':
          if (!idl) {
            setWaitingForAgent(false);
            alert.error('the idl is missing');
            return;
          }

          if (idlData.idlChanged) {
            console.log('Generating client code ...');
            clientCode = await clientIdlCode(idl);
            setIdlData({
              idl,
              client: clientCode,
              idlChanged: false
            });
          } else {
            console.log('Se reuso la data');
            clientCode = idlData.client;
          }
          
          console.log('Sending server question ...');
          codes = [await sendServerQuestion(prompt, idl), clientCode];
          break;        
        case 'Web3 abstraction': 
          const { optionAbstractionVariantSelected } = javascriptComponentSelected;
          
          if (optionAbstractionVariantSelected === 'SignLess/ez-transactions') {
            if (!idl) {
              setWaitingForAgent(false);
              alert.error('the idl is missing');
              return;
            }

            if (idlData.idlChanged) {
              console.log('Generating client code ...');
              clientCode = await clientIdlCode(idl);
              setIdlData({
                idl,
                client: clientCode,
                idlChanged: false
              });
            } else {
              console.log('Se reuso la data');
              clientCode = idlData.client;
            }

            console.log('sending web3 abstraction question ...');

            codes = [await sendWeb3AbstractionSignlessEzTransactionsQuestion(prompt, idl), clientCode];
            break;
          }


          console.log('sending web3 abstraction question ...');

          switch (optionAbstractionVariantSelected) {
            case 'GasLess/Frontend':
              codes = [await sendWeb3AbstractionGasLessFrontendQuestion(prompt), null];
              break;
            case 'GasLess/Server':
              codes = await sendWeb3AbstractionGasLessServerQuestion(prompt);
              break;
            case 'GasLess/ez-transactions':
              codes = [await sendWeb3AbstractionGasLessEzTransactionsQuestion(prompt), null];
              break;
          }

          break;
        default:
          alert.error('No option selected');
      }
    } catch(e) {
      const error = (e as Error).message;
      console.log(error);
      alert.error(error);
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

  const formatContractHistory = (): string => {
    let history = 'History:';

    contractHistory.forEach(item => {
      history += `\n\nuser: ${item.userPrompt}\nassistant: ${item.agentResponse}`;
    });

    return history;
  }

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
          onIdlChange={() => {
            setIdlData({
              ...idlData,
              idlChanged: true
            });
          }}
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
          // isContractQuestion={optionSelected === 'Smart Contracts'}
          
          updateContractButtonEnable={optionSelected === 'Smart Contracts' && contractHistory.length > 0}
        />

        <VoiceRecorderButton 
          onResult={handleOnPromptChange}
        />

        {
          codes[0] && (
            <AIResponse
              onCodeChange={newCode => {
                if (optionSelected === 'Smart Contracts') {
                  if (firstOptionSelected) {
                    currentContractCode.current.lib = newCode;
                    setCodes([newCode, codes[1]]);
                  } else {
                    currentContractCode.current.service = newCode;
                    setCodes([codes[0], newCode]);
                  }
                }
              }}
              editable={optionSelected === 'Smart Contracts'}
              responseTitle={
                dataToUse.optionSelected !== 'Web3 abstraction'
                ? dataToUse.responseTitle[ firstOptionSelected ? 0 : 1 ]
                : 'Abstraction'
              }
              code={ 
                (dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'Gearjs') ||
                (dataToUse.optionSelected === 'Web3 abstraction' && (
                  dataToUse.frontendOptionSelected === 'GasLess/Frontend' ||
                  // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
                  dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'
                ))
                  ? codes[0] as string
                  : codes[firstOptionSelected ? 0 : 1] as string
              }
              lang={dataToUse.optionSelected === 'Smart Contracts' ? 'rust' : 'javascript'}
              cornerLeftButtons={
                <>
                  {
                    (
                      !(
                        (dataToUse.optionSelected === 'Frontend' && dataToUse.frontendOptionSelected === 'Gearjs') ||
                        (dataToUse.optionSelected === 'Web3 abstraction' && (
                          dataToUse.frontendOptionSelected === 'GasLess/Frontend' ||
                          // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
                          dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'))
                      )
                    ) && (
                      <>
                        <Button
                          text={
                            dataToUse.optionSelected === 'Smart Contracts'
                            ? 'service'
                            : 'lib'
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


