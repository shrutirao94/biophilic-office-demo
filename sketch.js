let officeTrack;
let tracks = [];
let nodes = [];
let activeZoneY = 200;
let started = false;

function preload() {
  // Load office base sound
  officeTrack = new Tone.Player("sounds/office_seg073.wav").toDestination();
  officeTrack.loop = true;

  // Load 6 nature-like tracks
  const soundFiles = [
    "sounds/office-bird-typing.wav",
    "sounds/office-bird-typing-1.wav",
    "sounds/office-wind-rave.wav",
    "sounds/office-wind-rave-2.wav",
    "sounds/wind-style-transfer-better.wav",
    "sounds/wind-style-transfer-poor.wav"
  ];

  for (let i = 0; i < soundFiles.length; i++) {
    let player = new Tone.Player(soundFiles[i]).toDestination();
    player.loop = true;
    player.volume.value = -100; // start muted
    tracks.push(player);

    nodes.push({
      x: 150 * (i + 1),  // horizontal position fixed
      baseX: 150 * (i + 1),
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
  noStroke();
}

function draw() {
  background(20);

  // Draw activation zone
  fill(50);
  rect(0, 0, width, activeZoneY);
  fill(30);
  rect(0, activeZoneY, width, height - activeZoneY);

  // Draw draggable nodes
  for (let node of nodes) {
    fill(255, 150);
    ellipse(node.x, node.y, node.r * 2);
    fill(255);
    text(`Track ${node.trackIndex + 1}`, node.x, node.y);

    if (started) {
      // Map Y-position to volume
      let vol = map(constrain(node.y, 0, activeZoneY), activeZoneY, 0, -40, 0);
      tracks[node.trackIndex].volume.value = vol;

      // Start or stop playback
      if (node.y < activeZoneY) {
        if (tracks[node.trackIndex].state !== "started") tracks[node.trackIndex].start();
      } else {
        if (tracks[node.trackIndex].state === "started") tracks[node.trackIndex].stop();
      }
    }
  }

  // Manage office track fade logic
  if (started) {
    if (anyTrackActive()) {
      fadeOutOfficeTrack();
    } else {
      fadeInOfficeTrack();
    }
  }

  fill(255);
  if (!started) {
    text("Click anywhere to start audio", width / 2, 20);
  } else {
    text("Drag circles up to activate sounds", width / 2, 20);
  }
}

function mousePressed() {
  if (!started) {
    // Start Tone context and all sounds
    Tone.start().then(() => {
      console.log("Audio started");
      started = true;
      initAudio();
    });
  }

  // Dragging nodes
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
      // Restrict dragging vertically only
      node.y = mouseY;
      node.x = node.baseX;
    }
  }
}

function initAudio() {
  officeTrack.start();
  officeTrack.volume.value = 0;
  console.log("Office track playing");
}

function fadeOutOfficeTrack() {
  if (officeTrack.volume.value > -40) {
    officeTrack.volume.rampTo(-40, 1.5); // fade out
  }
}

function fadeInOfficeTrack() {
  if (officeTrack.volume.value < 0) {
    officeTrack.volume.rampTo(0, 1.5); // fade in
  }
}

function anyTrackActive() {
  return nodes.some(node => node.y < activeZoneY);
}

