import { AgentResponse } from "@/home/models/agent_call";
import axios from "axios";

const API_URL = 'https://vara-code-gen-ia-api.vercel.app/ia-generator/';
const CONTRACT_SERVICE_URL = 'service_smartcontract_agent';
const CONTRACT_LIB_URL = 'lib_smartcontract_agent';

export const sendContractQuestion = (question: string): Promise<[string, string]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractService = await contract_service(question);
            const contractLib = await contract_lib(contractService);

            resolve([contractLib, contractService]);
        } catch (e) {
            console.log(e);
            const error_message = (e as Error).message;
            reject(`Error: ${error_message}`);
        } 
    });
}

const contract_service = (question: string): Promise<string> => {
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

const contract_lib = (contractService: String): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const url_contract_service = API_URL + CONTRACT_LIB_URL;

        let response: AgentResponse | null = null;

        try {
            const temp = await axios.post(
                url_contract_service,
                {
                    question: contractService
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