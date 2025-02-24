// lib/firebase/messageCounter.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const MESSAGE_LIMIT = 8;

const MESSAGE_COUNTS_COLLECTION = "messageCounts";

export async function checkAndUpdateMessageCount(userId: string): Promise<{
  canSendMessage: boolean;
  remainingMessages: number;
}> {
  try {
    // Reference to user's message count document
    const countDocRef = doc(db, MESSAGE_COUNTS_COLLECTION, userId);
    const countDoc = await getDoc(countDocRef);

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    if (!countDoc.exists()) {
      // First message for this user
      await setDoc(countDocRef, {
        count: 1,
        lastReset: today,
        userId: userId,
      });
      return {
        canSendMessage: true,
        remainingMessages: MESSAGE_LIMIT - 1,
      };
    }

    const data = countDoc.data();
    const lastReset = data.lastReset;

    // Check if we need to reset the counter (new day)
    if (lastReset < today) {
      await updateDoc(countDocRef, {
        count: 1,
        lastReset: today,
      });
      return {
        canSendMessage: true,
        remainingMessages: MESSAGE_LIMIT - 1,
      };
    }

    // Check if user has reached the limit
    if (data.count >= MESSAGE_LIMIT) {
      return {
        canSendMessage: false,
        remainingMessages: 0,
      };
    }

    // Increment the counter
    const newCount = data.count + 1;
    await updateDoc(countDocRef, {
      count: newCount,
    });

    return {
      canSendMessage: true,
      remainingMessages: MESSAGE_LIMIT - newCount,
    };
  } catch (error) {
    console.error("Error in checkAndUpdateMessageCount:", error);
    // In case of error, allow the message but don't count it
    return {
      canSendMessage: true,
      remainingMessages: MESSAGE_LIMIT,
    };
  }
}
