import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY, // Use an environment variable for the API key
});


let cachedAdvice = null;
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log("Input Values:", totalBudget, totalIncome, totalSpend);
  if (cachedAdvice) return cachedAdvice;
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ₹${totalBudget}
      - Expenses: ₹${totalSpend}
      - Income: ₹${totalIncome}
        Analyze the financial situation carefully and provide a **detailed financial strategy** in 3-4 sentences.  
     Provide a **clear and easy-to-understand financial strategy**:  
     1. **Financial Health Check:** Summarize in 1 sentence whether the user is saving well or needs to control spending.  
     2. **Budgeting Tip:** Give 1 simple, practical budgeting rule to improve savings.  
     3. **Investment Plan:** Suggest where to invest the extra money based on a balanced risk approach (Stocks, SIP, FD, Gold, etc.).  
     4. **Simple Explanation:** Explain why each investment option is good in an easy way, without using technical terms.  

Keep the language **very simple** as if explaining to a beginner. No complicated financial jargon.  
    `;


    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use the appropriate model
      contents: userPrompt,
    });
    cachedAdvice = response.text;
    return cachedAdvice;

    const advice = response.text; // Extract the response text
    console.log("AI Advice:", advice);
    return advice;
  } catch (error) {
    if (error.response?.data?.error?.code === 429) {
      console.error("Rate limit exceeded:", error);
      return "The service is currently busy. Please try again later.";
    }

    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment.";
  }
};

export default getFinancialAdvice;