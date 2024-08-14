import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProperties,
  uploadData,
  list,
  copy,
  remove,
  getUrl,
} from "aws-amplify/storage";

import mime from "mime";
const privatePath =
  (prefix = "") =>
  ({ identityId }) =>
    `private/${identityId}/${prefix}`;

async function getPrivateRootStr() {
  let privateRoot;
  try {
    const property = await getProperties({
      path: privatePath(),
    });
    privateRoot = property.path;
    console.log("Private Root", privateRoot);
    return privateRoot;
  } catch (error) {
    // Not existing, create it
    try {
      await copy({
        source: {
          path: "public/CreateFolderOperationFolder/",
        },
        destination: {
          path: privatePath(),
        },
      });
    } catch (error) {
      console.error("Error", error);
      // Create the root folder
      await uploadData({
        path: "public/CreateFolderOperationFolder/",
        data: new Blob(),
        options: { contentType: "application/x-directory" },
      }).result;
    }
    return getPrivateRootStr();
  }
}

export async function getUrlResult(prefix) {
  const res = await getUrl({
    path: privatePath(prefix),
    // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
    options: {
      validateObjectExistence: true, // Check if object exists before creating a URL
      expiresIn: 900, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
    },
  });
  return res;
}

export const defaultFolders = [
  "Bank Statements",
  "Tax Documents",
  "Credit Card Statements",
  "Credit Reports",
];

const ensureDefaultFoldersExist = async () => {
  // console.log("Ensuring default folders exist");
  // Fetch the existing folders
  const root = await getPrivateRootStr();
  for (const folder of defaultFolders) {
    const path = `${root}${folder}/`;
    try {
      await getProperties({
        path,
      });
    } catch (error) {
      // Folder does not exist, create it
      // console.log("Creating folder", path);
      await copy({
        source: {
          path: "public/CreateFolderOperationFolder/",
        },
        destination: {
          path,
        },
      });
    }
  }
};

// Make sure the default folders exist when the app starts
export const useDefaultFolders = () => {
  const queryClient = useQueryClient();
  return useMutation(ensureDefaultFoldersExist, {
    onSuccess: () => {
      // console.log("Ensured default folders existed");
      queryClient.invalidateQueries(["contents"]);
    },
    onError: (error) => {
      console.error("Error ensuring default folders exist:", error);
    },
  });
};

// Listing files under a folder
function processStorageList(prefix, response, isPrivate) {
  let files = [];
  let folders = new Map();
  let items = response.items;
  // console.log("Items", items);
  let root = isPrivate
    ? `${items[0].path.split("/", 2).join("/")}/${prefix}`
    : `public/${prefix}`;
  items.forEach((item) => {
    const res = item.path.substring(root.length);
    if (res === "") return;
    const parts = res.split("/");
    if (parts.length >= 2) {
      if (!folders.has(`${prefix}${parts[0]}/`)) {
        folders.set(`${prefix}${parts[0]}/`, {
          name: `${parts[0]}`,
          path: `${prefix}${parts[0]}/`,
          url: `${prefix}${parts[0]}/`,
        });
      }
    } else {
      files.push({
        name: `${parts[0]}`,
        lastModified: item.lastModified,
        size: item.size,
        path: `${prefix}${parts[0]}`,
        url: `${prefix}${parts[0]}`,
      });
    }
  });
  return { files, folders: Array.from(folders.values()) };
}

// List the next level of files and folders
// If the prefix is empty, list the root level
// if the prefix ends with a '/', list the contents of the folder, otherwise we assume it's a file
async function listContents(prefix = "", isPrivate = true) {
  try {
    // See if the folder exists
    await getProperties({
      path: privatePath(prefix),
    });
    const result = await list({
      path: isPrivate ? privatePath(prefix) : `public/${prefix}`,
      options: {
        listAll: true,
      },
    });
    // console.log("List of Files ", result);
    if (result.items.length === 0) {
      return { files: [], folders: [] };
    }
    if (prefix === "" || prefix.endsWith("/")) {
      return processStorageList(prefix, result, isPrivate);
    }
    return { files: result.items, folders: [] };
  } catch (error) {
    console.log(error);
  }
}

// Retrieve the contents of the specified prefix
export const useContents = (prefix) => {
  return useQuery(["contents", prefix], () => listContents(prefix));
};

const isValidFileName = (fileName) => {
  // Basic validation: check if the file name is not empty and does not contain illegal characters
  return (
    fileName &&
    /^(?!^(PRN|AUX|NUL|CON|COM[1-9]|LPT[1-9]|CLOCK\$)$)(?!.*[<>:"/\\|?*])(?!.*[ .]$).+[^. ]$/i.test(
      fileName.trim()
    )
  );
};

const isValidFolderName = (folderName) => {
  return (
    folderName &&
    /^(?!^(PRN|AUX|NUL|CON|COM[1-9]|LPT[1-9]|CLOCK\$)$)(?!.*[<>:"/\\|?*])(?!.*[ .]$).+$/i.test(
      folderName.trim()
    )
  );
};

async function createFolder({ folderName, currentPrefix }) {
  if (folderName.endsWith("/")) {
    folderName = folderName.substring(0, folderName.length - 1);
  }
  if (!isValidFolderName(folderName)) {
    throw new Error("Invalid folder name!");
  }
  try {
    await copy({
      source: {
        path: "public/CreateFolderOperationFolder/",
      },
      destination: {
        path: privatePath(`${currentPrefix}${folderName.trim()}/`),
      },
    });
    // console.log("Folder Created", result);
  } catch (error) {
    console.error("Error", error);
  }
}

// Handle folder creation
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation(createFolder, {
    onSuccess: () => {
      // Optionally refetch the contents list to reflect the new folder
      queryClient.invalidateQueries(["contents"]);
    },
    onError: (error) => {
      console.error("Error deleting folder and its contents:", error);
    },
  });
};

// Assume the destination is a empty folder
const copyFolderContents = async ({
  isFromPrivate = true,
  from,
  isToPrivate = true,
  to,
}) => {
  const fromPath = isFromPrivate ? privatePath(from) : `public/${from}`;
  const result = await list({
    path: fromPath,
    options: {
      listAll: true,
    },
  });
  // console.log("from", from);
  // console.log("Copying folder contents", result);
  if (result.items.length === 0) {
    return;
  }

  const fromSystemRoot = isFromPrivate
    ? `${await getPrivateRootStr()}`
    : `public/`;
  const fromSystemPath = `${fromSystemRoot}${from}`;
  const toSystemRoot = isToPrivate ? `${await getPrivateRootStr()}` : `public/`;
  const toSystemPath = `${toSystemRoot}${to}`;

  for (const item of result.items) {
    // Skip the parent folder
    // if (property && item.path === property.path) continue;
    // console.log("Copying", item.path, "to", toSystemPath);
    await copy({
      source: {
        path: item.path,
      },
      destination: {
        path: `${toSystemPath}${item.path.substring(fromSystemPath.length)}`,
      },
    });
  }
};

const copyFileOrFolders = async ({
  isFromPrivate = true,
  from,
  isToPrivate = true,
  to,
}) => {
  console.log("Copying file or folder:", from, to);
  // Check if it's a folder by looking for a '/' at the end of the key
  if (from.endsWith("/")) {
    await copyFolderContents({ isFromPrivate, from, isToPrivate, to });
  } else {
    // It's a single file, perform the copy
    copy({
      source: {
        path: isFromPrivate ? privatePath(from) : `public/${from}`,
      },
      destination: {
        path: isToPrivate ? privatePath(to) : `public/${to}`,
      },
    }).then((result) => {
      console.log("Copied", result);
    });
  }
};

const deleteFolderAndContents = async ({ isPrivate = true, prefix }) => {
  // List all objects in the folder
  const result = await list({
    path: isPrivate ? privatePath(prefix) : `public/${prefix}`,
    options: {
      listAll: true,
    },
  });
  console.log("Deleting folder and its contents:", prefix);
  for (const item of result.items) {
    try {
      await remove({
        path: item.path,
      });
    } catch (error) {
      console.log("Error ", error);
    }
  }
};
//Handle folder deletion
export const useDeleteFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolderAndContents,
    onSuccess: () => {
      queryClient.invalidateQueries(["contents"]);
    },
    onError: (error) => {
      console.error("Error deleting folder and its contents:", error);
    },
  });
};

async function uploadFileToS3(file, prefix = "") {
  const contentType = mime.getType(file.name);
  try {
    const result = await uploadData({
      //   path: `public/${file.name}`,
      path: privatePath(`${prefix}${file.name}`),
      data: file,
      options: { contentType },
    }).result;
    // console.log("Succeeded: ", result);
    return result;
  } catch (error) {
    console.log("Error : ", error);
  }
}
// Handle file upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, prefix }) => uploadFileToS3(file, prefix),
    onSuccess: () => {
      // Invalidate and refetch data to update the UI after a successful upload
      queryClient.invalidateQueries(["contents"]);
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
    },
  });
};

async function checkIfFileExists(filePath, isPrivate = true) {
  // Check if the filePath already exists in the folder
  const result = await list({
    path: isPrivate ? privatePath(filePath) : `public/${filePath}`,
    options: {
      listAll: true,
    },
  });

  if (result.items.length > 0) {
    throw new Error("The destination file or folder already exists.");
  }
}

const renameFile = async ({
  oldKey,
  newKey,
  isFolder,
  currentPrefix,
  isPrivate = true,
}) => {
  console.log("Renaming file:", oldKey, newKey, isFolder, currentPrefix);
  if (!oldKey || !newKey) {
    throw new Error("New filename must be provided");
  }
  if (oldKey === newKey) {
    console.log("Old and new key are the same, no need to rename");
    return;
  }
  if (isFolder) {
    if (!isValidFolderName(newKey)) throw new Error("Invalid folder name");
  } else {
    if (!isValidFileName(newKey)) throw new Error("Invalid file name");
  }

  oldKey = `${currentPrefix}${oldKey}${isFolder ? "/" : ""}`;
  newKey = `${currentPrefix}${newKey}${isFolder ? "/" : ""}`;
  console.log("oldKey", oldKey);
  console.log("newKey", newKey);
  await checkIfFileExists(newKey, isPrivate);
  await copyFileOrFolders({
    isFromPrivate: isPrivate,
    from: oldKey,
    isToPrivate: isPrivate,
    to: newKey,
  });
  await deleteFolderAndContents({ isPrivate, prefix: oldKey });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldKey, newKey, isFolder, currentPrefix }) =>
      renameFile({ oldKey, newKey, isFolder, currentPrefix }),
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries(["contents"]);
    },
  });
};
