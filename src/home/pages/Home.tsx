import { Header } from "@/shared/ui/Header/Header"; 
import { Footer } from "@/shared/ui/Footer/Footer";
import { HeaderInfo } from "../ui/HeaderInfo";
import { AIOptionSelection } from "../ui/AIOptionSelection";
import { Cards } from "../ui/Cards";
import { LabelContainer } from "@gear-js/vara-ui";
import { AISection } from "../ui/AISection";
import styles from '../styles/home.module.scss';
import clsx from "clsx";

function Home () {
    return (
        <>
            <Header 
                backgroundColor="black"
            >
                <HeaderInfo />
            </Header>
            <Cards />
            <div className={styles.questionInfoContainer}>
                <h2 className={styles.titleQuestion}>
                    Ready to build secure and scalable dApps?
                </h2>
                <p className={styles.questionInfo}>
                    Take advantage of AI Agents to streamline your workflows, cut down development time, 
                    and ensure robust security for all your smart contracts.
                </p>
            </div>
            <AISection />
            <Footer />
        </>
    );
}

export { Home };