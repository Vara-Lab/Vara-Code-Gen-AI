import json
import time
import csv
import pandas as pd
import datetime
import requests
import os
import openai
from flask import Blueprint, jsonify, current_app, request
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from openai import OpenAI
from ..exceptions.exceptions import OpenAIServiceError
from config import get_openai_api_key


def generate_openai_chat_response(question: str, model: str = "gpt-4.1", temperature: float = 1.0) -> str:
   
    api_key = get_openai_api_key()
    if not api_key:
        raise OpenAIServiceError("API key Error.")

    openai.api_key = api_key
    client = OpenAI()

    try:
        response = client.chat.completions.create(
            model=model,
            temperature=temperature,
            store=True,
            messages=[{"role": "user", "content": question}],
        )
        answer = response.choices[0].message.content
        return answer
    except openai.error.OpenAIError as e:
        raise OpenAIServiceError(f"OpenAI API error: {str(e)}")
    except Exception as e:
        raise OpenAIServiceError(f"Unexpected error: {str(e)}")
