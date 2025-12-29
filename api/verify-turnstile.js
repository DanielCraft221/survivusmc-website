export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token não fornecido",
      });
    }

    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

    if (!SECRET_KEY) {
      console.error("TURNSTILE_SECRET_KEY não configurada");
      return res.status(500).json({
        success: false,
        error: "Configuração do servidor incorreta",
      });
    }

    const ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress ||
      "unknown";

    const formData = new URLSearchParams();
    formData.append("secret", SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const result = await verifyResponse.json();

    return res.status(200).json({
      success: result.success,
      message: result.success
        ? "Verificação bem-sucedida"
        : "Verificação falhou",
      errors: result["error-codes"] || [],
    });
  } catch (error) {
    console.error("Erro na verificação:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
}
