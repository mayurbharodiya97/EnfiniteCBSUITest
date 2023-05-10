// import CryptoJS from "crypto-js";

const decryptString = (encryptString: string) => {
  var secretKey = "SUPERACUTE@MKS";
  // var keyBytes = CryptoJS.PBKDF2(secretKey, "Ivan Medvedev", {
  //   keySize: 48 / 4,
  //   iterations: 1000,
  // });
  //console.log(keyBytes.toString());

  // take first 32 bytes as key (like in C# code)
  // var key = new CryptoJS.lib.WordArray.init(keyBytes.words, 32);
  // skip first 32 bytes and take next 16 bytes as IV
  // var iv = new CryptoJS.lib.WordArray.init(keyBytes.words.splice(32 / 4), 16);

  //console.log(key.toString());
  //console.log(iv.toString());

  // var dec = CryptoJS.AES.decrypt(
  //   { ciphertext: CryptoJS.enc.Base64.parse(encryptString) },
  //   key,
  //   { iv: iv }
  // );
  // return dec.toString(CryptoJS.enc.Utf8).split(String.fromCharCode(0)).join("");
};

export const matchFinger = async (rows: any, captureFinger: string) => {
  var promise = new Promise((resolve, reject) => {
    rows.forEach(async (element: any, i: number) => {
      var galleryTemplate = decryptString(element.FINGER_BIO);
      var MFS100Request = {
        GalleryTemplate: galleryTemplate,
        ProbTemplate: captureFinger,
        BioType: "Iso",
      };
      var jsondata = JSON.stringify(MFS100Request);
      await fetch("http://localhost:8004/mfs100/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: jsondata,
      })
        .then((response: any) => response.json())
        .then((response: any) => {
          if (response?.ErrorCode === "0" && response["Status"]) {
            resolve({
              status: true,
              errorCode: "0",
              errorMessage: "",
            });
          }

          if (rows.length === i + 1) {
            resolve({
              status: false,
              errorCode: response.ErrorCode,
              errorMessage: response.ErrorMessage,
            });
          }
        });
    });
  });
  return promise;
};
