import { AIOptionSelection } from './AIOptionSelection';
import { AIPromptTextArea } from './AIPromptArea';
import styles from '../styles/ai_section.module.scss';

export const AISection = () => {
  return (
    <div
        className={styles.container}
    >
        <AIOptionSelection  
            options={['Frontend', 'Smart Contracts', 'Server', 'Web3 abstraction']}
        />
        <AIPromptTextArea />
    </div>
  );
};