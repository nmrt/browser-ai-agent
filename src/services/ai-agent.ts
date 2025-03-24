import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { BrowserAction, BrowserActionSchema } from "../types/browser-actions";

export class AIAgent {
  private model: ChatOpenAI;
  
  constructor(apiKey: string) {
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0
    });
  }

  async processCommand(command: string): Promise<BrowserAction[]> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Convert the following natural language command into a series of browser actions.
      Command: {command}
      
      Return a JSON array of actions following this schema:
      {
        "action": "click" | "type" | "scroll" | "wait",
        "selector": "CSS selector" (optional),
        "text": "text to type" (optional),
        "position": { "x": number, "y": number } (optional)
      }
    `);

    const parser = new JsonOutputFunctionsParser();

    const chain = prompt.pipe(this.model).pipe(parser);

    const result = await chain.invoke({
      command
    });

    // Validate the actions
    const actions = Array.isArray(result) ? result : [result];
    return actions.map(action => BrowserActionSchema.parse(action));
  }
}