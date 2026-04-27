import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

async function getDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google OAuth2 credentials are missing");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function uploadToDrive(
  file: File,
  folderId?: string,
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const drive = await getDriveClient();
  const parentFolder = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!parentFolder) {
    throw new Error("Google Drive Folder ID is missing");
  }

  // Convert File to Readable Stream
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [parentFolder],
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: "id, name, webViewLink",
  });

  if (!response.data.id) {
    throw new Error("Failed to upload file to Google Drive");
  }

  // Set permission to anyone with link (read-only)
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    id: response.data.id,
    name: response.data.name!,
    webViewLink: response.data.webViewLink!,
  };
}

/**
 * Replaces the content of an existing Google Drive file in-place.
 * The file ID stays the same — no new file is created, no duplication possible.
 */
export async function replaceDriveFile(
  fileId: string,
  file: File,
  newName: string,
): Promise<{ id: string; name: string }> {
  const drive = await getDriveClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.update({
    fileId,
    requestBody: {
      name: newName,
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: "id, name",
  });

  if (!response.data.id) {
    throw new Error("Failed to replace file content in Google Drive");
  }

  return {
    id: response.data.id,
    name: response.data.name!,
  };
}

export async function deleteFromDrive(fileId: string) {
  const drive = await getDriveClient();
  try {
    console.log(`Deleting Google Drive file permanently: ${fileId}`);
    await drive.files.delete({
      fileId,
    });
    console.log(`Successfully deleted file from Google Drive: ${fileId}`);
  } catch (error: any) {
    if (error.code === 404) {
      console.warn(`File ${fileId} not found on Google Drive, skipping.`);
      return;
    }
    console.error("Error deleting file from Google Drive:", error);
    throw error;
  }
}

export function getDrivePreviewUrl(fileId: string) {
  // Opens the file in Google Drive's built-in viewer (new tab, no download)
  return `https://drive.google.com/file/d/${fileId}/view`;
}

export function getDriveDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export async function getOrCreateFolder(
  folderName: string,
  parentFolderId?: string,
) {
  const drive = await getDriveClient();
  const parentId = parentFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!parentId) {
    throw new Error("Parent Google Drive Folder ID is missing");
  }

  // Check if folder already exists
  const response = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  // If not, create it
  const folderMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentId],
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: "id",
  });

  return folder.data.id!;
}
