export function getSub(token: string) {
  try {
    const parts = token.split(".");
    const payload_base64 = parts[1].replace("-", "+").replace("_", "/");
    const payload_decode = atob(payload_base64);
    const payload_json = JSON.parse(payload_decode);
    return payload_json.sub;
  } catch (error) {
    return null;
  }
}
