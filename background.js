let appMode = false;

const MARKER_TIMEOUT_DEFAULT = 50;
const MARKER = [];

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = 0;
    this.present = false;

    this.center = { x: 0, y: 0 };
    this.corners = [];

    this.id = ID;
  }

  update(time) {
    this.present = time - this.timestamp > this.timeout ? false : this.present;
  }
}

function updateDetection() {
  // console.log('num markers: ', markers.length, deltaTime);
  const markers = beholder.detect();

  // draw markers here
  const dctx = beholder.ctx;
  dctx.lineWidth = 3;

  const timenow = Date.now();
  markers.forEach(m => {
    if (m.id < MARKER.length) {
      MARKER[m.id].present = true;
      MARKER[m.id].timestamp = timenow;
      MARKER[m.id].center = m.center;
      MARKER[m.id].corners = m.corners.map(c => c);
    }

    const center = m.center;
    const corners = m.corners;
    const dctx = beholder.ctx;

    dctx.strokeStyle = "#FF00AA";
    dctx.beginPath();

    corners.forEach((c, i) => {
      dctx.moveTo(c.x, c.y);
      c2 = corners[(i + 1) % corners.length];
      dctx.lineTo(c2.x, c2.y);
    });

    dctx.stroke();
    dctx.closePath();

    // draw first corner
    dctx.strokeStyle = "blue";
    dctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);

    dctx.strokeStyle = "#FF00AA";
    dctx.strokeRect(center.x - 1, center.y - 1, 2, 2);

    dctx.font = "12px monospace";
    dctx.fillStyle = "#FF00AA";
    dctx.fillText(m.id, center.x + 5, center.y);
  });

  MARKER.forEach(m => m.update(timenow));

  requestAnimationFrame(updateDetection);
}

window.onload = function() {
  // initialize detection stuff and hack in to detection loop
  beholder.init("#detection-canvas");

  // Detection param field changes
  document
    .querySelector("#MIN_MARKER_DISTANCE")
    .addEventListener("change", e => {
      beholder.setParam("MIN_MARKER_DISTANCE", e.target.value);
    });
  document
    .querySelector("#MIN_MARKER_PERIMETER")
    .addEventListener("change", e => {
      beholder.setParam("MIN_MARKER_PERIMETER", e.target.value);
    });
  document
    .querySelector("#MAX_MARKER_PERIMETER")
    .addEventListener("change", e => {
      beholder.setParam("MAX_MARKER_PERIMETER", e.target.value);
    });
  document
    .querySelector("#SIZE_AFTER_PERSPECTIVE_REMOVAL")
    .addEventListener("change", e => {
      beholder.setParam("SIZE_AFTER_PERSPECTIVE_REMOVAL", e.target.value);
    });

  const cameraSelect = document.querySelector("#CAMERA_INDEX");
  beholder.getCameraFeeds().then(feeds => {
    cameraSelect.innerHTML = "";

    feeds.forEach((f, i) => {
      if (f.kind === "videoinput") {
        const opt = document.createElement("option");
        opt.value = f.deviceId;
        opt.label = f.label ? f.label : i;
        if (i === 0) opt.selected = true;
        cameraSelect.appendChild(opt);
      }
    });

    cameraSelect.addEventListener("change", e => {
      console.log(e.target.value);
      beholder.setCamera(e.target.value);
    });
  });

  document.querySelector("#VIDEO_SIZE_INDEX").addEventListener("change", e => {
    console.log(e.target.value);
    beholder.setVideoSize(e.target.value);
  });
  
  document.querySelector("#toggleScreen").addEventListener("click", e => {
    
    appMode = !appMode;
    document.querySelector("#toggleScreen").classList.toggle("active");
    document.querySelector("#app").classList.toggle("active");
    document.querySelector("#detectionDiv").classList.toggle("active");
    
    if (!appMode) {
      document.querySelector("#toggleScreen").innerHTML = "&searr;";
    } else {
      document.querySelector("#toggleScreen").innerHTML = "&nwarr;";
    }
  });

  for (let i = 0; i < 100; i++) {
    MARKER.push(new Marker(i));
  }

  updateDetection();
};
