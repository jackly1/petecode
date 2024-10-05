from .baml_client.async_client import b
from .baml_client.types import Solution

async def get_answer(description: str, language: str) -> Solution: 
  response = await b.SolveLeetcode(description, language)
  return response
