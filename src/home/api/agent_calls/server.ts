import { client_idl_code } from "@/home/api/agent_calls/idl";
import type { AgentResponse } from "@/home/models/agent_call";
import axios from "axios";

const API_URL = 'https://vara-code-gen-ia-api.vercel.app/ia-generator/';
const SERVER_SCRIPT_URL = 'script_server_agent';

export const sendServerQuestion = (question: string, idl: string): Promise<[string, string]> => {
    return new Promise(async (resolve, reject) => {
        let client_code: string;
        let script_code: string;

        try {
            client_code = await client_idl_code(idl);
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