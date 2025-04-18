import { client_idl_code } from "@/home/api/agent_calls/idl";
import type { AgentResponse } from "@/home/models/agent_call";
import axios from "axios";

const API_URL = 'https://vara-code-gen-ia-api.vercel.app/ia-generator/';
const FRONTEND_SAILSCALLS = 'sailscalls_frontend_agent';
const FRONTEND_SAILSJS = 'sailsjs_frontend_agent';
const FRONTEND_WALLETCONNECT = 'walletconnect_frontend_agent';
const FRONTEND_GEARJS = 'gearjs_frontend_agent';

export const sendFrontendGearjsQuestion = (question: string, idl: string): Promise<[string, string]> => {
    const url = API_URL + FRONTEND_GEARJS;
    let response: AgentResponse | null = null;
    let client_code: string;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );
            client_code = await client_idl_code(idl);

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

        const sailsCallsComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "");

        resolve([sailsCallsComponent, client_code]);   
    });
}

export const sendFrontendSailsCallsQuestion = (question: string, idl: string): Promise<[string, string]> => {
    const url = API_URL + FRONTEND_SAILSCALLS;
    let response: AgentResponse | null = null;
    let client_code: string;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );
            client_code = await client_idl_code(idl);

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

        const sailsCallsComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "");

        resolve([sailsCallsComponent, client_code]);   
    });
};

export const sendFrontendSailsjsQuestion = (question: string, idl: string): Promise<[string, string]> => {
    const url = API_URL + FRONTEND_SAILSJS;
    let response: AgentResponse | null = null;
    let client_code: string;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question + '\n' + idl
                }
            );
            client_code = await client_idl_code(idl);   

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

        const sailsJsComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "");

        resolve([sailsJsComponent, client_code]);    
    });
};

export const sendFrontendWalletconnectQuestion = (question: string): Promise<string> => {
    const url = API_URL + FRONTEND_WALLETCONNECT;
    let response: AgentResponse | null = null;

    return new Promise(async (resolve, reject) => {
        try {
            const temp = await axios.post(
                url,
                {
                    question: question
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