import { AgentResponse } from "../models/agent_call";
import axios from "axios";

const API_URL = 'https://vara-code-gen-ia-api.vercel.app/ia-generator/';
const FRONTEND_SAILSCALLS = 'sailscalls_frontend_agent';
const FRONTEND_GASLESS = 'gasless_frontend_agent';
const FRONTEND_PAYLESS = 'payless_frontend_agent';
const FRONTEND_SAILSJS = 'sailsjs_frontend_agent';
const FRONTEND_WALLETCONNECT = 'walletconnect_frontend_agent';
const CONTRACT_SERVICE_URL = 'service_smartcontract_agent'
const SERVER_CLIENT_URL = 'client_server_agent';
const SERVER_SCRIPT_URL = 'script_server_agent';

export const sendFrontendSailsCallsQuestion = (question: string, idl: string): Promise<string> => {
    const url = API_URL + FRONTEND_SAILSCALLS;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, ""));   
    });
};

export const sendFrontendGaslessQuestion = (question: string, idl: string): Promise<string> => {
    const url = API_URL + FRONTEND_GASLESS;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, "")); 
    });
};

export const sendFrontendPaylessQuestion = (question: string, idl: string): Promise<string> => {
    const url = API_URL + FRONTEND_PAYLESS;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, "")); 
    });
};

export const sendFrontendSailsjsQuestion = (question: string, idl: string): Promise<string> => {
    const url = API_URL + FRONTEND_SAILSJS;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, "")); 
    });
};

export const sendFrontendWalletconnectQuestion = (question: string, idl: string): Promise<string> => {
    const url = API_URL + FRONTEND_WALLETCONNECT;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, "")); 
    });
};

export const sendContractQuestion = (question: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const url_contract_service = API_URL + CONTRACT_SERVICE_URL;

        let response: AgentResponse | null = null;

        try {
            const temp = await axios.post(
                url_contract_service,
                {
                    question
                }
            );

            response = temp.data;
        } catch (e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        if (typeof response.answer !== 'string') {
            const serializedAnswer = JSON.stringify(response.answer, null, 2);
            console.log("Unexpected format for data.answer:" + response.answer);
            reject(serializedAnswer);
            return;
        }

        const rustCodeRegex = /rust([\s\S]*?)/g;
        const matches = response.answer.match(rustCodeRegex) || [];

        if (matches.length < 1) {
            reject('Code provided by agent is not in rust language');
            return;
        }

        const extractedRustCode = response.answer
            .replace(/rust|```/g, "");

        resolve(extractedRustCode);
    });
}

export const sendServerQuestion = (question: string, idl: string): Promise<[string, string]> => {
    return new Promise(async (resolve, reject) => {
        let client_code: string;
        let script_code: string;

        try {
            client_code = await server_client_code(idl);
            script_code = await server_script_code(question, idl);
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        resolve([script_code, client_code]);
    });
}

const server_client_code = (idl: string): Promise<string> => {
    const url = API_URL + SERVER_CLIENT_URL;

    return new Promise(async (resolve, reject) => {
        let response: AgentResponse | null = null;

        try {
            const temp = await axios.post(
                url,
                {
                    question: idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        console.log('Response: ');
        console.log(response);

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, ""));     
    });
}

const server_script_code = (question: string, idl: string): Promise<string> => {
    const url = API_URL + SERVER_SCRIPT_URL;

    return new Promise(async (resolve, reject) => {
        let response: AgentResponse | null = null;

        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );

            response = temp.data;
        } catch(e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
            return;
        }

        if (!response) {
            reject('Not answer received');
            return;
        }

        if ('error' in response) {
            reject(`Error: ${response.error}`);
            return;
        }

        if (!response.answer) {
            reject('No response from server');
            return;
        }

        resolve(response.answer.replace(/javascript|```|jsx|typescript/g, ""));   
    });
}