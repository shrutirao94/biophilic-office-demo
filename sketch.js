let tracks = [];
let nodes = [];
let activeZoneY = 200;

let soundFiles = [
  'office-bird-typing-1.wav',
  'office-bird-typing.wav',
  'office-wind-rave-2.wav',
  'office-wind-rave.wav',
  'wind-style-transfer-better.wav',
  'wind-style-transfer-poor.wav'
];

function preload() {
  // Load each sound file using Tone.js Player
  for (let i = 0; i < soundFiles.length; i++) {
    let player = new Tone.Player(`sounds/${soundFiles[i]}`).toDestination();
    player.loop = true;
    tracks.push(player);

    // Create draggable nodes
    nodes.push({
      x: 150 * (i + 1),
      y: 400,
      r: 30,
      dragging: false,
      trackIndex: i
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(20);

  // Draw activation zone
  noStroke();
  fill(50);
  rect(0, 0, width, activeZoneY);
  fill(30);
  rect(0, activeZoneY, width, height - activeZoneY);

  // Draw and control nodes
  for (let node of nodes) {
    fill(255, 150);
    ellipse(node.x, node.y, node.r * 2);
    fill(255);
    text(soundFiles[node.trackIndex], node.x, node.y + 40);

    // Map vertical position to volume
    let vol = map(constrain(node.y, 0, activeZoneY), activeZoneY, 0, -40, 0);
    tracks[node.trackIndex].volume.value = vol;

    // Start or stop playback based on node position
    if (node.y < activeZoneY) {
      if (tracks[node.trackIndex].state !== "started") tracks[node.trackIndex].start();
    } else {
      if (tracks[node.trackIndex].state === "started") tracks[node.trackIndex].stop();
    }
  }

  fill(255);
  text("Drag nodes up to activate sound (volume increases as you move higher)", width / 2, 20);
}

function mousePressed() {
  for (let node of nodes) {
    if (dist(mouseX, mouseY, node.x, node.y) < node.r) {
      node.dragging = true;
    }
  }
}

function mouseReleased() {
  for (let node of nodes) node.dragging = false;
}

function mouseDragged() {
  for (let node of nodes) {
    if (node.dragging) {
      node.x = mouseX;
      node.y = mouseY;
    }
  }
}

