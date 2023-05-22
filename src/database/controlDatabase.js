import { ref, set, push, remove } from "firebase/database";
import { db } from "../firebase";

const writeNewReference = (UID, Item) => {
  const reference = ref(db, "referenceList/" + UID);
  push(reference, Item);
};

const deleteReference = async (UID, RefId) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);
  console.log(`referenceList/${UID}/${RefId}`);
  await remove(reference)
    .then(() => {
      console.log("location removed");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

export { writeNewReference, deleteReference };
