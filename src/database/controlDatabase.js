import { ref, set, push, remove, get } from "firebase/database";
import {
  ref as sRef,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../firebase";

// new reference
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

// edit reference
const editReference = (UID, RefId, Item) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);
  set(reference, Item);
};

// delete reference
const deleteReference = async (UID, RefId, RefFileName) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);

  // delete pdf
  if (RefFileName !== undefined) {
    const storageRef = sRef(
      storage,
      `referenceList/${UID}/${RefId}/${RefFileName}`
    );

    await deleteObject(storageRef)
      .then(() => {
        console.log("pdf removed");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  // delete json
  await remove(reference)
    .then(() => {
      console.log("location removed");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

// download file
const downloadFile = async (UID, RefId, fileName) => {
  const storageRef = sRef(storage, `referenceList/${UID}/${RefId}/${fileName}`);

  try {
    const url = await getDownloadURL(storageRef);
    console.log(url);

    window.open(url, "_blank");

    return url;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

const enterLink = async (UID, RefId) => {
  const reference = ref(db, `referenceList/${UID}/${RefId}`);
  const snapshot = await get(reference);
  if (snapshot.exists()) {
    window.open(snapshot.val().link, "_blank");
    return 1;
  } else {
    return null;
  }
};

// get file url
const getFileUrl = async (UID, RefId, fileName) => {
  const storageRef = sRef(storage, `referenceList/${UID}/${RefId}/${fileName}`);

  try {
    const url = await getDownloadURL(storageRef);
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
  getFileUrl,
  enterLink,
};
