import { GrayContainer } from '@/shared/ui/Containers/GrayContainer/GrayContainer';
import { WhiteContainer } from '@/shared/ui/Containers/WhiteContainer/WhiteContainer';
import { useState } from 'react';
import styles from '../styles/ai_option_selection.module.scss';
import clsx from 'clsx';

interface Props {
    options: string[];
    currentSelected: number;
    waitingForResponse?: boolean;
    selected?: (name: string, id: number) => void;
}

const whiteContainerStyles = {
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '10.5rem',
  transition: 'all ease-in-out 0.2s'
};

export const AIOptionSelection = ({ options, currentSelected, waitingForResponse = false, selected = (name: string, id: number) => {} }: Props) => {
  const [optionSelected, setOptionSelected] = useState(currentSelected);

  return (
    <div>
        <GrayContainer 
          style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '3px', 
            gap: '20px',
          }}
        >
          {
            options.map((value, index) => (
              <WhiteContainer 
                key={index}
                onClick={() => {
                  if (waitingForResponse) return;
                  setOptionSelected(index);
                  selected(value, index);
                }}
                style={
                  optionSelected == index
                    ? whiteContainerStyles
                    : { 
                        ...whiteContainerStyles,  
                        background: 'none',
                        boxShadow: 'none',
                        cursor: waitingForResponse ? 'not-allowed' : 'pointer',
                      }
                }
              >
                <p
                  className={clsx(
                    styles.text,
                    (optionSelected != index) && styles.textUnSelected,
                    (optionSelected != index) && waitingForResponse && styles.cursorNotAllowed
                  )}
                >
                  {value}
                </p>  
              </WhiteContainer>
            ))
          }
        </GrayContainer>
    </div>
  )
}
