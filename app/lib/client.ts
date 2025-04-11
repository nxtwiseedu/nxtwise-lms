/**
 * Firebase client utilities
 */
import { db, auth, storage } from "./firebase";
import {
  doc,
  getDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";

/**
 * Get currently authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get user document from Firestore
 */
export const getUserDoc = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  }

  return null;
};

/**
 * Get user's enrolled course IDs
 */
export const getUserCourseIds = async (userId: string): Promise<string[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userData: any = await getUserDoc(userId);
  return userData?.courseIds || [];
};

/**
 * Convert Firestore timestamp to ISO string
 */
export const timestampToString = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString();
};

/**
 * Convert Firestore document to typed object
 */
export function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const converted: any = { id: doc.id };

  // Convert Firestore timestamps to ISO strings
  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Timestamp) {
      converted[key] = timestampToString(data[key]);
    } else {
      converted[key] = data[key];
    }
  });

  return converted as T;
}

/**
 * Get download URL for a file in Firebase Storage
 */
export const getFileUrl = async (path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
};
