let token = null;

export function setTempToken(novoToken) {
  token = novoToken;
}

export function getTempToken() {
  return token;
}
