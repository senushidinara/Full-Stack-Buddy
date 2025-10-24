import { GoogleGenAI, Type, Modality } from "@google/genai";

export type Solution = {
    overview?: string;
    backend?: string;
    frontend?: string;
    instructions?: string;
    previewImage?: string;
};

const fullStackSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.STRING,
        description: "A brief, high-level overview of the proposed architecture for the full-stack solution, explaining how the frontend and backend connect. This should be in Markdown format."
      },
      backend: {
        type: Type.STRING,
        description: "The complete backend solution in a single Markdown formatted string. The markdown must contain distinct, fenced code blocks for each file. Use the format ```language:path/to/file.ext```. Include at least `backend/package.json` and a main server file."
      },
      frontend: {
        type: Type.STRING,
        description: "The complete frontend solution in a single Markdown formatted string. The markdown must contain distinct, fenced code blocks for each file. Use the format ```language:path/to/file.ext```. Include `frontend/index.html`, `frontend/src/App.jsx` (the main React component), and `frontend/package.json`."
      },
      instructions: {
        type: Type.STRING,
        description: "A detailed, step-by-step guide in Markdown format on how to set up the project. It should include instructions for installing dependencies (e.g., 'npm install') and running both the backend and frontend servers locally."
      }
    },
    required: ["overview", "backend", "frontend", "instructions"],
};

const singlePartSchema = {
    type: Type.OBJECT,
    properties: {
        code: {
            type: Type.STRING,
            description: "The complete code solution in a single Markdown formatted string. The markdown must contain distinct, fenced code blocks for each file. Use the format ```language:path/to/file.ext```."
        },
        instructions: {
            type: Type.STRING,
            description: "A detailed, step-by-step guide in Markdown format on how to set up the project. It should include instructions for installing dependencies (e.g., 'npm install') and running the application locally."
        }
    },
    required: ["code", "instructions"]
};

function getSystemInstruction(generationType: 'backend' | 'frontend' | 'fullstack'): string {
    const commonInstructions = `Your response must be in a specific JSON format. For code, you must use language-specific, fenced code blocks with file paths within a markdown formatted string, following this exact format: \`\`\`language:path/to/file.ext\n// your code here\n\`\`\`. This is crucial for parsing.`;

    switch (generationType) {
        case 'frontend':
            return `You are a world-class senior frontend engineer specializing in React, TypeScript, and Tailwind CSS. A user will request a frontend feature. Your task is to provide a complete, production-ready solution.
            The response MUST be a single valid JSON object with two keys: "code", and "instructions".
            - "code": A string containing the complete frontend solution in Markdown, including all necessary files like package.json, index.html, and React components.
            - "instructions": A string containing a step-by-step guide in Markdown on how to set up and run the frontend project.
            ${commonInstructions}`;
        case 'fullstack':
            return `You are a world-class senior full-stack engineer with expertise in Node.js, React, and various database technologies. A user will request a full-stack application. Your task is to provide a complete, integrated, production-ready, and well-documented solution.
            The response MUST be a single valid JSON object with four keys: "overview", "backend", "frontend", and "instructions".
            - "overview": A brief, high-level overview of the proposed architecture in Markdown.
            - "backend": A string containing the complete backend solution in Markdown.
            - "frontend": A string containing the complete frontend solution in Markdown.
            - "instructions": A string containing a step-by-step guide in Markdown on how to set up and run the entire project.
            ${commonInstructions}`;
        case 'backend':
        default:
            return `You are a world-class senior backend engineer with expertise in Node.js, Python, and various database technologies. A user will request a backend feature. Your task is to provide a complete, production-ready solution.
            The response MUST be a single valid JSON object with two keys: "code", and "instructions".
            - "code": A string containing the complete backend solution in Markdown, including all necessary files like package.json and the main server file.
            - "instructions": A string containing a step-by-step guide in Markdown on how to set up and run the backend project, including API usage examples with cURL.
            ${commonInstructions}`;
    }
}

async function generatePreviewImage(ai: GoogleGenAI, userInput: string): Promise<string | undefined> {
    try {
        const imagePrompt = `A visually stunning dashboard UI for a web application that does the following: "${userInput}". The image should look like a screenshot of a beautiful, modern, and intuitive dashboard interface with creative data visualizations, charts, and graphs.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: imagePrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        return undefined;

    } catch (error) {
        console.error("Error generating preview image:", error);
        // Don't throw, just return undefined so the app doesn't break if image gen fails.
        return undefined;
    }
}


export async function generateSolution(
    userInput: string, 
    generationType: 'backend' | 'frontend' | 'fullstack'
): Promise<Solution> {
  // FIX: API key is now sourced from environment variables, not passed as an argument.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-pro';
  const systemInstruction = getSystemInstruction(generationType);

  try {
    const schema = generationType === 'fullstack' ? fullStackSchema : singlePartSchema;
    
    const codeGenPromise = ai.models.generateContent({
        model: model,
        contents: userInput,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const imageGenPromise = (generationType === 'frontend' || generationType === 'fullstack')
        ? generatePreviewImage(ai, userInput)
        : Promise.resolve(undefined);

    const [codeGenResponse, previewImage] = await Promise.all([codeGenPromise, imageGenPromise]);
    
    const parsedResponse = JSON.parse(codeGenResponse.text);

    let solution: Solution;

    if (generationType === 'fullstack') {
        solution = parsedResponse as Solution;
    } else {
        const key = generationType === 'backend' ? 'backend' : 'frontend';
        solution = { 
            [key]: parsedResponse.code,
            instructions: parsedResponse.instructions
        };
    }
    
    if (previewImage) {
        solution.previewImage = previewImage;
    }

    return solution;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // FIX: Removed specific API key error message as it's no longer user-provided.
        throw new Error(`Error generating solution: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while contacting the AI model.");
  }
}