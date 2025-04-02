import { 
    DataIcon, 
    DevIcon, 
    RobotIcon, 
    SecurityIcon 
} from '../assets';
import { MediumCard } from './MediumCard';
import { LargeCard } from './LargeCard';
import styles from '../styles/cards.module.scss';
import clsx from 'clsx';

export const Cards = () => {
  return (
    <div className={styles.cardsContainer}>
        <div 
            className={
                clsx(
                    styles.card,
                    styles.titleCard
                )
            }
        >
            <h2 className={styles.title}>
                AI Agents
            </h2>
            <h2 className={styles.title}>
                for Vara Network
            </h2>
        </div>
        <LargeCard
            title="Automated React Component Creation"
            description="Rapidly generate and customize React components using AI, reducing development time and ensuring high-quality outputs."
            icon={<RobotIcon />}
        />
        <MediumCard
            title="Smart Code Generation"
            description="Leverage AI to write optimized smart contract code, reducing development time and errors."
            icon={<DevIcon />}
            dotsBackground
        />
        <MediumCard
            title="Security Audits"
            description="Automated scanning and auditing of vulnerabilities, ensuring robust and secure contracts."
            icon={<SecurityIcon />}
        />
        <MediumCard
            title="Continuous Monitoring"
            description="Real-time performance tracking & incident alerts with AI-driven insights."
            icon={<DataIcon />}
            linesBackground
        />
    </div>
  )
}
