import "dotenv/config";

import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim();

if (!storageBucket) {
  throw new Error("FIREBASE_STORAGE_BUCKET is not configured.");
}

// ----------------------------------------------------------------------
// FIREBASE
// ----------------------------------------------------------------------

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        storageBucket,
      });

export const firebaseAuth = getAuth(firebaseApp);

export const firestore = getFirestore(firebaseApp);

export const firebaseStorage = getStorage(firebaseApp);
