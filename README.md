# Messenger viewer
If you've downloaded your Facebook data in JSON format, this tool lets you read the chats more intuitively.

As raw JSON, it's hard to read:
![raw json](img/rawjson.png)

Using this Facebook Messenger JSON viewer, it looks much better:
![viewer](img/viewer.png)

## How to use

Here's a quick demo:

![demo](img/demo.gif)

### Step 1.
Clone this repo and run `chat_display.html` on your browser.

### Step 2.
Once you've opened the link or cloned the repo and opened the HTML file, you will need to choose your JSON file that you want to parse using the file selector.

After selecting your file, you'll be asked which participant you are. This will put your messages on blue bubbles on the right side, and everyone else's messages on the left, in grey bubbles.

Voilà, your chats can now be easily read.

## Media File Renaming (Optional)

If your Facebook export has media files with UUID filenames (e.g., `a17d86fc-f54a-40c3-8b3a-578aca7317cc.jpeg`), you can use the included renaming script to organize them.

**Prerequisites:**
- Node.js installed on your system

**Usage:**
```bash
# Rename media for a single JSON file
node media_rename.js your_conversation.json

# Rename media for all JSON files in the messages folder
node media_rename.js all
```

**What it does:**
1. Scans the JSON file for media references
2. Renames media files to `prefix-0001.jpg`, `prefix-0002.jpg`, etc. (where prefix is the JSON filename)
3. Updates the JSON file with the new media filenames

**Note:** Place your JSON files and media folder in a `messages/` directory at the project root before running the script.

## Features

- **Message Display**: Messages are displayed in chronological order with proper chat bubble styling
- **Media Support**: View images, videos, and file attachments directly in the chat
  - Images display as thumbnails and can be clicked for full-size popup view
  - Videos play inline with controls
  - Other files show as downloadable links
- **Reactions**: Message reactions (emojis) are displayed below messages with the reactor's name
- **Timestamps**: Full timestamps are shown for each message (YYYY-MM-DD HH:MM:SS format)
- **Participant Selection**: Choose which participant you are to properly align your messages
- **Client-side Processing**: All data processing happens in your browser - no data is sent to external servers
- **Save to HTML**: Generated pages can be saved as complete HTML files with all images and styling preserved
  - **Firefox**: Automatically saves as "Complete Web Page" with resources in a subfolder
  - **Chrome/Edge**: Select "Webpage, Complete" in the "Save as type" dropdown to save all resources



## Ideas / TODO
* Do some advanced searching/filtering on the chat data in JSON format using my [Facebook Messenger tool](https://github.com/simonwongwong/Facebook-Messenger-Statistics/) and then view the messages using this viewer
* Add a slider or calendar picker to filter dates in the chat (not supported by Facebook Messenger unless you want to spend hours scrolling and loading)
* Add search functionality within conversations
* Export conversations to different formats (PDF, HTML, etc.)

## Completed Features
* ✅ Timestamps are now displayed for all messages
* ✅ Media viewing (images, videos, files) is fully supported
* ✅ Message reactions are displayed
* ✅ Improved message styling and layout
* ✅ Save generated pages as complete HTML with working image popups

## Technical Details

- Built with React 16 and vanilla JavaScript
- Supports both old and new Facebook JSON export formats
- Handles various media types and file attachments
- Responsive design for different screen sizes
- Keyboard shortcuts (ESC to close image popups)
