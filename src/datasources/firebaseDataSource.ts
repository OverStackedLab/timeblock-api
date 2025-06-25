import DataLoader from "dataloader";
import { db } from "../firebase";

type Block = {
  id: string;
  content: string;
  createdAt: string;
};

export const firebaseDataSource = () =>
  new DataLoader<string, Block[]>(async (userIds) => {
    const promises = userIds.map(async (userId) => {
      const snapshot = await db
        .collection(`users/${userId}/blocks`)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Block[];
    });

    return Promise.all(promises);
  });
