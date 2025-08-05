let officeTrack;
let tracks = [];
let nodes = [];
let activeZoneY = 200;
let started = false;

function preload() {
  officeTrack = new Tone.Player("sounds/office_seg073.wav").toDestination();
  officeTrack.loop = true;

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
    player.volume.value = -100;
    tracks.push(player);

    nodes.push({
      x: 150 * (i + 1),
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
  // Dynamic background based on active nodes
  let activeCount = nodes.filter(n => n.y < activeZoneY).length;
  let bgColor = lerpColor(color(30), color(20, 80, 40), activeCount / nodes.length);
  setGradient(bgColor);

  // Draw activation zone with glow
  noStroke();
  fill(60, 80, 100, 120);
  rect(0, 0, width, activeZoneY);

  // Draw draggable nodes
  for (let node of nodes) {
    let isActive = node.y < activeZoneY;

    if (isActive) {
      fill(100, 255, 100, 180); // active green
      stroke(180, 255, 180, 200);
      strokeWeight(2);
    } else {
      fill(255, 150);
      noStroke();
    }

    ellipse(node.x, node.y, node.r * 2);

    fill(255);
    noStroke();
    text(`Track ${node.trackIndex + 1}`, node.x, node.y + node.r + 15);

    if (started) {
      let vol = map(constrain(node.y, 0, activeZoneY), activeZoneY, 0, -40, 0);
      tracks[node.trackIndex].volume.value = vol;

      if (isActive && tracks[node.trackIndex].state !== "started") tracks[node.trackIndex].start();
      if (!isActive && tracks[node.trackIndex].state === "started") tracks[node.trackIndex].stop();
    }
  }

  // Manage office track fade
  if (started) {
    if (anyTrackActive()) fadeOutOfficeTrack();
    else fadeInOfficeTrack();
  }

  // Status text
  fill(255);
  textSize(16);
  if (!started) {
    text("Click to start audio", width / 2, 20);
  } else {
    text(anyTrackActive() ? "Nature Blending Active" : "Office Ambience", width / 2, 20);
  }
}

function mousePressed() {
  if (!started) {
    Tone.start().then(() => {
      console.log("Audio started");
      started = true;
      initAudio();
    });
  }

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
      node.y = mouseY;
      node.x = node.baseX;
    }
  }
}

function initAudio() {
  officeTrack.start();
  officeTrack.volume.value = 0;
}

function fadeOutOfficeTrack() {
  if (officeTrack.volume.value > -40) officeTrack.volume.rampTo(-40, 1.5);
}

function fadeInOfficeTrack() {
  if (officeTrack.volume.value < 0) officeTrack.volume.rampTo(0, 1.5);
}

function anyTrackActive() {
  return nodes.some(node => node.y < activeZoneY);
}

function setGradient(bgColor) {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(bgColor, color(10), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

