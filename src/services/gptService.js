export async function askGPT3(messages) {
    try {
        const response = await fetch('https://chatcast-backend.onrender.com/ask', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer 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"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                max_tokens: 2048,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            console.error("Erro no servidor:", response.status);
            throw new Error("Failed to fetch from server");
        }

        const data = await response.json();

        if (data && data.choices && data.choices.length > 0) {
            console.log("O Chat respondeu: ", data.choices[0].message.content.trim());
            return data.choices[0].message.content.trim();
        } else {
            console.warn("Resposta inesperada:", data);
            return "Desculpe, não consegui gerar uma resposta.";
        }

    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.warn("Limite de solicitações atingido:", error);
            return "Estou recebendo muitas solicitações no momento. Por favor, tente novamente mais tarde.";
        }
        console.error("Erro ao solicitar ao GPT-4:", error);
        throw error;
    }
}
