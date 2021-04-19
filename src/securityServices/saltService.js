function encryptSalts(masterPassword) {
  salt1 = window.crypto.getRandomValues(new Uint8Array(32));
  const passwordAsBytes = new TextEncoder("utf-8").encode(masterPassword);

  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    passwordAsBytes,
    "PBKDF2",
    false, 
    ["deriveKey"]
  );

  const encryptedSalt = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv
        },
        passwordKey,
        salt1
      );

  console.log(encryptedSalt);
}

const defaultExportObj = {
  encryptSalts
};

export default defaultExportObj;
