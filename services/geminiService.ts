
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TransactionType } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const transactionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    amount: { type: Type.NUMBER, description: "交易的具体金额数字。" },
    category: { type: Type.STRING, description: "从以下类别中选择最合适的一个: 餐饮, 交通, 购物, 娱乐, 账单, 医疗, 薪资, 人情, 其他。" },
    type: { type: Type.STRING, enum: ["expense", "income"], description: "资金流向：支出(expense) 或 收入(income)。" },
    note: { type: Type.STRING, description: "一段简短可爱的中文备注，描述这笔交易。" },
    date: { type: Type.STRING, description: "YYYY-MM-DD 格式的日期。如果用户没说，默认为今天。" },
    emoji: { type: Type.STRING, description: "一个代表这笔交易的Emoji表情。" }
  },
  required: ["amount", "category", "type", "note", "emoji"]
};

export const parseTransactionWithGemini = async (input: string) => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `请将用户的自然语言输入解析为结构化的记账数据: "${input}". 
      根据上下文推断分类（Categories: 餐饮, 交通, 购物, 娱乐, 账单, 医疗, 薪资, 人情, 其他）。
      如果用户说 "花了", "买", "支付", "付了", "扣款", 则是支出 (expense)。
      如果用户说 "赚了", "发工资", "收到", "入账", 则是收入 (income)。
      备注(note)请使用中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema,
        systemInstruction: "你是一个可爱、乐于助人的中文记账助手。你会把用户的口语转换为精确的记账数据。"
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    throw error;
  }
};
