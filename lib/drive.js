const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || "";
const ROOT_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_ROOT_FOLDER_ID || "1toMlJExBP-titjEoCrn3TjKq6ToEC7rb";
const FOLDER_CATEGORY_MAP = {
  "english": "English",
  "mathematics": "Mathematics",
  "math": "Mathematics",
  "science": "Science",
  "social studies": "Social Studies",
  "computer science": "Computer Science",
  "engineering": "Engineering",
  "management": "Management"
};
function mapFolderNameToCategory(folderName) {
  const cleaned = folderName.toLowerCase().replace(/ resources$/, "").replace(/^\d+\s*[-–]\s*/, "").trim();
  return FOLDER_CATEGORY_MAP[cleaned] || cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
async function fetchFromDrive(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  return res.json();
}
async function getDriveSubfolders() {
  const data = await fetchFromDrive(
    `https://www.googleapis.com/drive/v3/files?q='${ROOT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&key=${DRIVE_API_KEY}&fields=files(id,name,mimeType)`
  );
  const folders = data.files || [];
  const results = await Promise.all(
    folders.map(async (folder) => {
      try {
        const fileData = await fetchFromDrive(
          `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+trashed=false&key=${DRIVE_API_KEY}&fields=files(id,name,mimeType,size,modifiedTime,webContentLink,webViewLink)`
        );
        return { id: folder.id, name: folder.name, files: fileData.files || [] };
      } catch (e) {
        console.error(`Failed to fetch files for folder ${folder.name}`, e);
        return { id: folder.id, name: folder.name, files: [] };
      }
    })
  );
  return results.filter((r) => r.files.length > 0);
}
function getDriveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
function getDriveFileCategory(folderName) {
  return mapFolderNameToCategory(folderName);
}
export {
  getDriveDownloadUrl,
  getDriveFileCategory,
  getDriveSubfolders
};
