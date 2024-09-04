import { Injectable } from '@angular/core';
import  * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {

  //private secretKey = 'YourSecretKeyHere';
  private secretKey ="22eb12ca3430de9844b5b4d09c4cdc76";

  constructor() { }


  encryptData(data: any): string {
    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    //  console.log('encrypdat',encryptedData)
      return encryptedData;
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  decryptData(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     // console.log('decryptdata',decryptedData)
      return decryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}
