import getEncryptionKey from "./getEncryptionKey";

export default async function getVaultKey(email, masterPassword) {
  const vaultKey = await getEncryptionKey(email, masterPassword);
  return vaultKey;
}
