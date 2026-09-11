import crypto from "crypto";

const COOKIE_NAME = "qfc_admin_session";

function base64urlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function verifySessionToken(token) {
  try {
    if (!token || !process.env.SESSION_SECRET) {
      return false;
    }

    const parts = token.split(".");

    if (parts.length !== 2) {
      return false;
    }

    const [encodedPayload, receivedSignature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.SESSION_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    if (!safeEqual(receivedSignature, expectedSignature)) {
      return false;
    }

    const payload = JSON.parse(
      base64urlDecode(encodedPayload)
    );

    if (!payload.authenticated) {
      return false;
    }

    // Session lifetime: 8 hours
    const sessionAge = Date.now() - payload.createdAt;

    const eightHours = 8 * 60 * 60 * 1000;

    if (sessionAge < 0 || sessionAge > eightHours) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Session verification error:", error);
    return false;
  }
}

export function isAdmin(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}