let tracks = [];
let nodes = [];
let activeZoneY = 200;

function preload() {
  // Load 6 tracks
  for (let i = 1; i <= 6; i++) {
    let player = new Tone.Player(`sounds/track${i}.mp3`).toDestination();
    player.loop = true;
    tracks.push(player);

    nodes.push({ x: 100 * i, y: 400, r: 30, dragging: false, trackIndex: i - 1 });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(20);

  // Draw zones
  noStroke();
  fill(50);
  rect(0, 0, width, activeZoneY);
  fill(30);
  rect(0, activeZoneY, width, height - activeZoneY);

  // Draw nodes
  for (let node of nodes) {
    fill(255, 150);
    ellipse(node.x, node.y, node.r * 2);
    fill(255);
    text(`Track ${node.trackIndex + 1}`, node.x, node.y);

    // Map vertical position to volume
    let vol = map(constrain(node.y, 0, activeZoneY), activeZoneY, 0, -40, 0);
    tracks[node.trackIndex].volume.value = vol;

    // Start or stop playback
    if (node.y < activeZoneY) {
      if (tracks[node.trackIndex].state !== "started") tracks[node.trackIndex].start();
    } else {
      if (tracks[node.trackIndex].state === "started") tracks[node.trackIndex].stop();
    }
  }

  fill(255);
  text("Drag nodes up to activate sound", width / 2, 20);
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

