import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists to avoid crash on load, 
// though actual calls will fail gracefully if key is missing.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getDailyMotivation = async (): Promise<string> => {
  if (!ai) return "API Key未設定: 今日も安全運転で頑張りましょう！";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "トラックドライバーに向けた、短くて力強い、情熱的な応援メッセージを1つ作成してください。テーマは「プロ意識」「安全」「ドラコン優勝」です。30文字以内で、感嘆符などを使って勢いよく。",
    });
    return response.text?.trim() || "今日もプロの誇りを胸に！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "安全は、家族への最高の土産です。";
  }
};

export const getAiExplanation = async (questionText: string, userAnswerText: string, correctAnswerText: string): Promise<string> => {
  if (!ai) return "AI機能を利用するにはAPIキーが必要です。";

  try {
    const prompt = `
    あなたは交通法規と安全運転技術に精通した、エキスパートインストラクターです。
    以下の問題について、なぜユーザーの回答が間違っているのか、そして正解の根拠は何かを、専門的な視点から簡潔に（150文字以内）解説してください。
    語り口調は、信頼感のある落ち着いた「です・ます」調で、論理的に説明してください。

    問題: ${questionText}
    ユーザーの誤答: ${userAnswerText}
    正解: ${correctAnswerText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "解説の生成に失敗しました。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI解説への接続に失敗しました。";
  }
};