import { client_idl_code } from "@/home/api/agent_calls/idl";
import type { AgentResponse } from "@/home/models/agent_call";
import axios from "axios";

const API_URL = 'https://vara-code-gen-ia-api.vercel.app/ia-generator/';
const FRONTEND_GASLESS = 'gasless_frontend_agent ';
const FRONTEND_SIGNLESS = 'signless_frontend_agent';

export const sendFrontendGaslessQuestion = (question: string, idl: string): Promise<[string, string]> => {
    const url = API_URL + FRONTEND_GASLESS;
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

        const gaslessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "");

        resolve([gaslessComponent, client_code]); 
    });
};

export const sendFrontendSignlessQuestion = (question: string, idl: string): Promise<[string, string]> => {
    const url = API_URL + FRONTEND_SIGNLESS;
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

        const signlessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "");

        resolve([signlessComponent, client_code]); 
    });
};