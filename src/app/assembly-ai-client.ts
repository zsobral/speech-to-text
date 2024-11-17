import { AssemblyAI } from "assemblyai";

export const assemblyAi = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY as string,
});
