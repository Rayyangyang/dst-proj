/**
 * JSEncrypt 加密解密
 */

import JSEncrypt from 'jsencrypt';

// 公钥
const key = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlnUXEdIG7Jb26ph5hGrlAq9yOri47C8IXAb
 SrHlNd5YozUQVSJ5hexF7lBbUMNUASXcyH+vt+ecbIFnSkJhPrHeunDqYHLwLapUpHu80hx92JowIyqHQHv14c940TTLM15OW
 PU1DHOo6GSLAJdPiBBux+ntaPuZvZJ8Vg67uM+n2PV2jioEGLp/X93eoDpmhdK4SoztAyoObmMEs0kopiL3KJKyh5vO6I1201D
 F4VoEGOmtE78qX2Cx3zbWtkkZKowSIA9ECnmFIMpE/e81Z0uLNgO9Ii3R0jxkwxJVT0uczhLHwtIJZ3Qzc9AlD+4EYPkOjcoM858WIQLgb/KmApwIDAQAB`;

// 加密
export function setEncrypt(msg: string) {
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(key);
  return jsencrypt.encrypt(msg);
}
