import getVaultKey from "./getVaultKey";
import getEncryptionKey from "./getEncryptionKey";

export default async function getAuthKey(email, masterPassword) {
  const vaultKey = await getVaultKey(email, masterPassword);
  const authKey = await getEncryptionKey(vaultKey, masterPassword);

  return authKey;
}