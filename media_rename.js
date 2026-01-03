const fs = require('fs');
const path = require('path');

const messagesDir = './messages';
const mediaDir = './messages/media';

// Get command line arguments
const args = process.argv.slice(2);
const targetFile = args[0];

function processJsonFile(jsonFile) {
  const jsonPath = path.join(messagesDir, jsonFile);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Extract prefix from JSON filename (remove .json extension and sanitize)
  const prefix = jsonFile.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_');
  let jsonModified = false;
  const renameMap = new Map();
  let mediaCounter = 1;
  
  // Scan messages for media URIs
  if (jsonData.messages) {
    jsonData.messages.forEach(message => {
      if (message.media) {
        message.media.forEach(mediaItem => {
          if (mediaItem.uri && mediaItem.uri.startsWith('./media/')) {
            const mediaFileName = mediaItem.uri.replace('./media/', '');
            const oldPath = path.join(mediaDir, mediaFileName);
            
            // Get file extension
            const fileExtension = path.extname(mediaFileName);
            
            // Create new filename with counter
            const counterStr = mediaCounter.toString().padStart(4, '0');
            const newFileName = `${prefix}-${counterStr}${fileExtension}`;
            const newPath = path.join(mediaDir, newFileName);
            
            if (fs.existsSync(oldPath)) {
              renameMap.set(oldPath, newPath);
              // Update URI in JSON
              mediaItem.uri = `./media/${newFileName}`;
              jsonModified = true;
              mediaCounter++;
            }
          }
        });
      }
    });
  }
  
  // Perform the renames
  renameMap.forEach((newPath, oldPath) => {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } catch (error) {
      console.error(`Error renaming ${oldPath}:`, error.message);
    }
  });
  
  // Write updated JSON file
  if (jsonModified) {
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log(`Updated JSON: ${jsonFile}`);
  }
  
  return renameMap.size;
}

if (!targetFile) {
  console.log('Usage: node media_rename.js <filename.json> | all');
  process.exit(1);
}

if (targetFile === 'all') {
  // Process all JSON files
  const jsonFiles = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));
  let totalRenamed = 0;
  
  jsonFiles.forEach(jsonFile => {
    console.log(`Processing: ${jsonFile}`);
    totalRenamed += processJsonFile(jsonFile);
  });
  
  console.log(`Processed ${jsonFiles.length} JSON files and renamed ${totalRenamed} media files.`);
} else {
  // Process single JSON file
  if (!targetFile.endsWith('.json')) {
    console.error('File must have .json extension');
    process.exit(1);
  }
  
  const jsonPath = path.join(messagesDir, targetFile);
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${targetFile}`);
    process.exit(1);
  }
  
  console.log(`Processing: ${targetFile}`);
  const renamed = processJsonFile(targetFile);
  console.log(`Renamed ${renamed} media files for ${targetFile}.`);
}