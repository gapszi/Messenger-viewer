const e = React.createElement;
var myName;
var cleanedData;

const fileSelector = document.getElementById('fileupload');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  readJSON(fileList[0]);
});

const domButton = document.querySelector('#submit-button');
ReactDOM.render(
  e('button', {onClick: () => handleSubmit()}, "Submit"),
  domButton
);


function handleSubmit(){
  ReactDOM.render(e(ChatArea), document.querySelector('#chat-area'))
  const domChat = document.querySelector('#chat-display');
  ReactDOM.render(e(ChatBubble, cleanedData.msgs), domChat);
  addChatTitle();
}

function readJSON(file) {
  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    console.log("JSON load sucessful");
    msgObject = JSON.parse(event.target.result);
    cleanedData = cleanData(msgObject);
    promptParticipantRadio(cleanedData.participants);
  });

  reader.readAsText(file);

  
}

function cleanData(raw) {
  var participants = raw.participants.map(person => 
    typeof person === 'string' ? person : person.name
  );
  var title = raw.title || raw.threadName;
  var msgs = raw.messages; // Remove .reverse() to keep chronological order
  var cleaned = {
    "participants": participants,
    "title": title,
    "msgs": msgs,
  }

  return cleaned
}

function addChatTitle() {
  const chatTitle = document.querySelector('#chat-title')
  ReactDOM.render(e('h2', {}, cleanedData.title), chatTitle);
}

function promptParticipantRadio(participants){
  const participantsRadio = document.querySelector('#participants-radio');
  var radioElements = []

  radioElements.push(e('p', {}, 'Which participant are you?'))

  participants.forEach(function (n, i) {
    radioElements.push(
      e('input', {
        type: 'radio', 
        name: 'participant', 
        onClick: () => radioClick(n), 
        id: ("radio-button-" + i)
      })
    );
    radioElements.push(
      e('label', {onClick: () => document.getElementById('radio-button-' + i).click()}, n)
    );
    radioElements.push(e('br'));
  });
  ReactDOM.render(radioElements, 
                  participantsRadio);
        
  document.querySelector("#radio-button-0").click();

}

function radioClick(name) {
  myName = name;
  console.log(`Setting ${name} as blue bubble`);
}

class ChatBubble extends React.Component {
  generateBubbles(msg) {
    var senderName = msg.sender_name || msg.senderName;
    var content = msg.content || msg.text;
    var timestamp = msg.timestamp_ms || msg.timestamp;
    var media = msg.media || [];
    var reactions = msg.reactions || [];
    
    var bubbleContent = [];
    var hasMedia = media && media.length > 0;
    
    // Add text content if exists
    if (content) {
      bubbleContent.push(e('div', {}, content));
    }
    
    // Add media if exists
    if (hasMedia) {
      media.forEach(mediaItem => {
        if (mediaItem.uri) {
          var mediaPath = mediaItem.uri.replace('./media', './messages/media');
          var fileExtension = mediaPath.split('.').pop().toLowerCase();
          
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            bubbleContent.push(
              e('img', {
                src: mediaPath,
                style: {maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', margin: '5px 0', cursor: 'pointer'},
                alt: 'Image',
                onClick: () => showImagePopup(mediaPath)
              })
            );
          } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExtension)) {
            bubbleContent.push(
              e('video', {
                src: mediaPath,
                controls: true,
                style: {maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', margin: '5px 0'}
              })
            );
          } else {
            bubbleContent.push(
              e('a', {
                href: mediaPath,
                target: '_blank',
                style: {color: '#0084ff', textDecoration: 'underline'}
              }, `📎 ${mediaPath.split('/').pop()}`)
            );
          }
        }
      });
    }
    
    var bubbleClass;
    if (hasMedia && !content) {
      bubbleClass = senderName == myName ? 'media-frame-right' : 'media-frame-left';
    } else {
      bubbleClass = senderName == myName ? 'bubble-right' : 'bubble-left';
    }
    var nameClass = senderName == myName ? 'name-right' : 'name-left';
    
    var messageElements = [
      e('div', {className: nameClass}, `${senderName} @ ${timeConverter(timestamp)}`),
      e('div', {className: bubbleClass}, bubbleContent)
    ];
    
    // Add reactions if they exist
    if (reactions && reactions.length > 0) {
      var reactionElements = reactions.map(reaction => {
        return e('span', {
          style: {
            fontSize: '16px', 
            margin: '0 2px',
            color: reaction.reaction.charCodeAt(0) === 10084 ? 'red' : 'inherit'
          },
          title: reaction.actor
        }, reaction.reaction);
      });
      
      var reactionClass = senderName == myName ? 'reactions-right' : 'reactions-left';
      
      messageElements.push(
        e('div', {
          className: reactionClass
        }, reactionElements)
      );
    }
    
    return e('div', {className: "message-container"}, messageElements);

  }
  render() {
    return (
      cleanedData.msgs.map(msg => this.generateBubbles(msg))
      )
  }
}

class ChatArea extends React.Component {
  render() {
    return (
      e('div', {id: "chat-display"}, null)
    );
      
  }
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = (a.getMonth() + 1).toString().padStart(2, '0');
  var date = a.getDate().toString().padStart(2, '0');
  var hour = a.getHours().toString().padStart(2, '0');
  var min = a.getMinutes().toString().padStart(2, '0');
  var sec = a.getSeconds().toString().padStart(2, '0');
  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

function showImagePopup(imageSrc) {
  const popup = document.createElement('div');
  popup.id = 'image-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:1000;cursor:pointer';
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain';
  
  popup.appendChild(img);
  document.body.appendChild(popup);
  
  popup.onclick = closeImagePopup;
  document.addEventListener('keydown', handleEscapeKey);
}

function closeImagePopup() {
  const popup = document.getElementById('image-popup');
  if (popup) {
    popup.remove();
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeImagePopup();
  }
}