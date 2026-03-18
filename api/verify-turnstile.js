const DEFAULT_ORIGIN = "https://survivusmc.com";

function isValidTokenFormat(token) {
  return typeof token === "string" && /^[A-Za-z0-9\-_\.]+$/.test(token) && token.length <= 2048;
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.setHeader("Cache-Control", "no-store");

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token não fornecido",
      });
    }

    if (!isValidTokenFormat(token)) {
      return res.status(400).json({
        success: false,
        error: "Formato de token inválido",
      });
    }

    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

    if (!SECRET_KEY) {
      console.error("[verify-turnstile] TURNSTILE_SECRET_KEY não configurada");
      return res.status(500).json({
        success: false,
        error: "Configuração do servidor incorreta",
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
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
        body: formData.toString(),
      }
    );

    if (!verifyResponse.ok) {
      console.error(
        "[verify-turnstile] Cloudflare retornou status inesperado:",
        verifyResponse.status
      );
      return res.status(502).json({
        success: false,
        error: "Erro ao contatar serviço de verificação",
      });
    }

    const result = await verifyResponse.json();

    return res.status(200).json({
      success: result.success,
      message: result.success ? "Verificação bem-sucedida" : "Verificação falhou",
      errors:
        process.env.NODE_ENV !== "production"
          ? result["error-codes"] || []
          : undefined,
    });
  } catch (error) {
    console.error("[verify-turnstile] Erro interno:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
}
