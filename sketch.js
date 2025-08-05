let baseTrack;        // The office baseline sound
let overlayTracks = []; 
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
  // Load base office sound (ambient)
  baseTrack = new Tone.Player('sounds/office_seg073.wav').toDestination();
  baseTrack.loop = true;

  // Load overlay tracks (nature-inspired layers)
  for (let i = 0; i < soundFiles.length; i++) {
    let player = new Tone.Player(`sounds/${soundFiles[i]}`).toDestination();
    player.loop = true;
    overlayTracks.push(player);

    nodes.push({ 
      x: 100 * (i + 1), 
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

  let startButton = createButton("Start Audio");
  startButton.position(20, 20);
  startButton.mousePressed(() => {
    Tone.start();
    if (baseTrack.state !== "started") baseTrack.start();
  });
}

function draw() {
  background(20);

  // Draw zones
  noStroke();
  fill(50);
  rect(0, 0, width, activeZoneY);
  fill(30);
  rect(0, activeZoneY, width, height - activeZoneY);

  // Draw nodes and handle volume mixing
  for (let node of nodes) {
    fill(255, 150);
    ellipse(node.x, node.y, node.r * 2);
    fill(255);
    text(`Track ${node.trackIndex + 1}`, node.x, node.y);

    // Map vertical position to volume (-40 dB to 0 dB)
    let vol = map(constrain(node.y, 0, activeZoneY), activeZoneY, 0, -40, 0);
    overlayTracks[node.trackIndex].volume.value = vol;

    // Start or stop overlay track
    if (node.y < activeZoneY) {
      if (overlayTracks[node.trackIndex].state !== "started") 
        overlayTracks[node.trackIndex].start();
    } else {
      if (overlayTracks[node.trackIndex].state === "started") 
        overlayTracks[node.trackIndex].stop();
    }
  }

  fill(255);
  text("Drag nodes up to add layers over the baseline office sound", width / 2, 20);
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

