// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview


client<llm> Groq {
  provider "openai-generic"
  options {
    base_url "https://api.groq.com/openai/v1"
    model "llama3-70b-8192"
    api_key env.GROQ_API_KEY
    // api_key defaults to env.OPENAI_API_KEY
  }
}



client<llm> Fast {
  provider round-robin
  options {
    // This will alternate between the two clients
    strategy [GPT4oMini, Haiku]
  }
}

client<llm> Openai {
  provider fallback
  options {
    // This will try the clients in order until one succeeds
    strategy [GPT4o, GPT4oMini]
  }
}