import { ref, set, push, remove } from "firebase/database";
import { ref as sRef, getDownloadURL, deleteObject } from "firebase/storage";

import { db, storage } from "../firebase";
import { uploadBytes } from "firebase/storage";

const writeNewReference = (UID, Item) => {
  const reference = ref(db, "referenceList/" + UID);
  const newReference = push(reference, Item);
  return newReference.key;
};

const writeNewFile = async (UID, RefId, file) => {
  const storageRef = sRef(
    storage,
    `referenceList/${UID}/${RefId}/${file.name}`
  );
  uploadBytes(storageRef, file)
    .then((snapshot) => {
      console.log("Uploaded a blob or file!");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

const editReference = (UID, RefId, Item) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);
  set(reference, Item);
};

const deleteReference = async (UID, RefId, RefFileName) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);

  const storageRef = sRef(
    storage,
    `referenceList/${UID}/${RefId}/${RefFileName}`
  );

  // delete pdf
  if (RefFileName !== null) {
    await deleteObject(storageRef)
      .then(() => {
        console.log("pdf removed");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  //delete json
  await remove(reference)
    .then(() => {
      console.log("location removed");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

const downloadFile = async (UID, RefId, fileName) => {
  const storageRef = sRef(storage, `referenceList/${UID}/${RefId}/${fileName}`);

  console.log(storageRef);
  try {
    const url = await getDownloadURL(storageRef);
    console.log(url);

    window.open(url, "_blank"); // Open URL in a new tab

    return url;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export {
  writeNewReference,
  deleteReference,
  writeNewFile,
  downloadFile,
  editReference,
};
