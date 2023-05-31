import { db } from "../firebase";

import { ref, set, push, remove } from "firebase/database";

const editCategoriesDb = (uid, RefId, newName) => {
  const reference = ref(db, "categories/" + uid + "/" + RefId);
  set(reference, newName);
};

const writeCategoriesDb = (uid, categories) => {
  const reference = ref(db, "categories/" + uid);
  const refID = push(reference, categories);
  return refID.key;
};

const deleteCategoriesDb = (uid, RefId) => {
  const reference = ref(db, "categories/" + uid + "/" + RefId);
  remove(reference);
};

export { editCategoriesDb, writeCategoriesDb, deleteCategoriesDb };
