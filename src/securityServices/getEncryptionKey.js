export default async function getVaultKey(secretText1, secretText2) {
  const passwordAsBytes = new TextEncoder("utf-8").encode(
    secretText1 + secretText2
  );
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    passwordAsBytes,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(32));
  const keyBuffer = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: 250000,
    },
    passwordKey,
    256
  );

  const keyArray = Array.from(new Uint8Array(keyBuffer));
  // console.log("keyArray:", keyArray);

  // Uint8Array to Base64 String
  const encryptionKey = Buffer.from(keyArray).toString("base64");

  // check if "vaultKey" can be reconstructed to same "keyArray"
  // console.log(Buffer.from(vaultKey, "base64"));

  return encryptionKey;
}
