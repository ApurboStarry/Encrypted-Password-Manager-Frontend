export default async function encryptPassword(vaultKey, passwordObj) {
  const passwordAsBytes = new TextEncoder("utf-8").encode(vaultKey);

  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    passwordAsBytes,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // SALT
  const salt = window.crypto.getRandomValues(new Uint8Array(32));
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: { name: "SHA-256" },
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"]
  );

  // IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const dataAsBytes = new TextEncoder("utf-8").encode(passwordObj);
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    dataAsBytes
  );

  const encryptedBytes = new Uint8Array(encryptedContent);
  let encryptedPackage = new Uint8Array([...salt, ...iv, ...encryptedBytes]);

  const finalOutput = Buffer.from(encryptedPackage).toString("base64");
  console.log("finalOutput", finalOutput);
}
