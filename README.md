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

## Technical Details

- Built with React 16 and vanilla JavaScript
- Supports both old and new Facebook JSON export formats
- Handles various media types and file attachments
- Responsive design for different screen sizes
- Keyboard shortcuts (ESC to close image popups)
