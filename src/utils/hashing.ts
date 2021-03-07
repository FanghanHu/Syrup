import crypto from "crypto";

declare global {
    interface String {
      /**
       * Generate a hashcode in hexadecimal, using sha256.
       */
        sha256(): string;
    }
}

String.prototype.sha256 = function sha256() {
  return crypto.createHmac("SHA256", "userDefinedSecret").update(this as string).digest("hex");
}