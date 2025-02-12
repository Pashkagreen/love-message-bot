import {db, messagesCollection} from "./db";
import {addDoc, doc, getDocs, updateDoc} from "firebase/firestore";

/**
 * Function to add an array of messages to Firestore
 * @param {string[]} messages - Array of love messages
 */
export async function addMessagesToFirestore(messages: string[]) {
  try {
    for (const text of messages) {
      await addDoc(messagesCollection, {text, sent: false});
      console.log(`Added message: ${text}`);
    }
    console.log("✅ All messages added to Firestore!");
  } catch (error) {
    console.error("❌ Error adding messages:", error);
  }
}

/**
 * Reset already sent messages status and include them into dataset
 */
export const resetMessages = async ()=> {
  try {
    const querySnapshot = await getDocs(messagesCollection);
    for (const docSnapshot of querySnapshot.docs) {
      const messageDocRef = doc(db, "loveMessages", docSnapshot.id);
      await updateDoc(messageDocRef, {sent: false});
    }
    console.log("All messages have been reset to unsent.");
  } catch (error) {
    console.error("Error resetting messages:", error);
  }
};
