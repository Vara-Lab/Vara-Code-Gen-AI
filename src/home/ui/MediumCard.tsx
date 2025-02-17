import React from 'react'
import cardsStyles from '../styles/cards.module.scss';
import styles from '../styles/medium_card.module.scss';
import clsx from 'clsx';

interface Props {
    title: string;
    description: string;
    icon: React.ReactNode;
    dotsBackground?: boolean;
}

export const MediumCard = ({ title, description, icon, dotsBackground = false }: Props) => {
  return (
    <div 
        className={
            clsx(
                cardsStyles.card, 
                styles.mediumInfoCard,
                dotsBackground && styles.dotsBackground
            )
        }
    >
        <div className=''>
            { icon }
        </div>
       <div className={styles.mediumCardDataContainer}>
            <h3 className={styles.mediumCardTitle}>
                {title}
            </h3>
            <p
                className={ clsx(cardsStyles.cardData) }
            >
                {description}
            </p>
       </div>
    </div>
  )
}
