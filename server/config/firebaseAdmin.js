// server/config/firebaseAdmin.js
import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import serviceAccount from ("../serviceAccountKey.json"); // ✅ Works in Node 22+

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export { admin };
