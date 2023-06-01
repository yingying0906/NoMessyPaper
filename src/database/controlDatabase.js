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
  writeNewMindmap(UID, newReference.key);

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
  const reference = ref(db, `referenceList/${UID}/${RefId}`);
  await remove(reference)
    .then(() => {
      console.log("location removed");
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  // delete mindmap
  const mindmapReference = ref(db, `mindmapList/${UID}/${RefId}`);
  await remove(mindmapReference)
    .then(() => {
      console.log("mindmap removed");
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
// mindmap
const writeNewMindmap = (UID, RefId) => {
  const item = {
    anchorPoint: {},
    shapes: [],
    shapesMap: {},
  };
  const reference = ref(db, `mindmapList/${UID}/${RefId}`);
  set(reference, item)
    .then(() => {
      console.log("new mindmap created");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

const updateMindmap = (UID, RefID, Obj) => {
  console.log(UID, RefID, Obj);
  const reference = ref(db, `mindmapList/${UID}/${RefID}`);
  set(reference, Obj);
};

export {
  writeNewReference,
  deleteReference,
  writeNewFile,
  downloadFile,
  editReference,
  getFileUrl,
  enterLink,
  writeNewMindmap,
  updateMindmap,
};
