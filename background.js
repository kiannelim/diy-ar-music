let appMode = false;

const MARKER_TIMEOUT_DEFAULT = 75;
const MARKER = [];

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = 0;
    this.present = false;

    this.center = { x: 0, y: 0 };
    this.corners = [];
    this.rotation = 0;

    this.id = ID;
  }
  
  updateMarker(m, timenow) {
    this.present = true;
    this.timestamp = timenow;
    this.center = m.center;
    this.corners = m.corners.map(c => c);
    this.rotation = vecAngleBetween(vecSub(this.corners[0], this.corners[1]), {x:1, y:0});
  }

  updatePresence(time) {
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
      MARKER[m.id].updateMarker(m, timenow);
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

  MARKER.forEach(m => m.updatePresence(timenow));

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
    
  });

  for (let i = 0; i < 100; i++) {
    MARKER.push(new Marker(i));
  }

  updateDetection();
};



////////////////////
//
// Math methods
//
////////////////////

function vecAdd(vec1, vec2) {
  return {x:vec1.x + vec2.x, y:vec1.y + vec2.y};
}

// vector vec1 ---> vec2
function vecSub(vec1, vec2) {
  return {x:-vec1.x + vec2.x, y:-vec1.y + vec2.y};
}

function vecScale(vec, scale) {
  return {x:vec.x*scale, y:vec.y*scale};
}

function vecDot(vec1, vec2) {
  return vec1.x*vec2.x + vec1.y*vec2.y;
}

function vecMag(vec) {
  return Math.pow(Math.pow(vec.x, 2) + Math.pow(vec.y, 2), 0.5);
}

function vecMag2(vec) {
  return Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
}

function vecUnit(vec) {
  var m = vecMag(vec);
  return {
    x: vec.x/m,
    y: vec.y/m,
  };
}

function vecRot90(vec) {
  return {x:vec.y, y:-vec.x}
}

function vecRot(vec, angle) {
  var x = vec.x * Math.cos(angle) - vec.y * Math.sin(angle);
  var y = vec.x * Math.sin(angle) + vec.y * Math.cos(angle);
  return {x:x, y:y};
}

function vecAngleBetween(vec1, vec2) {
  // return Math.atan2(vec1.y, vec1.x) - Math.atan2(vec2.y, vec2.x);
  return Math.atan2(vec1.x*vec2.y-vec1.y*vec2.x, vec1.x*vec2.x+vec1.y*vec2.y);
}

function vecEMA(vec1, vec2, weight) {
  return {
    x: (vec1.x*(1-weight) + vec2.x*weight), 
    y: (vec1.y*(1-weight) + vec2.y*weight) 
  };
}

// Line closest point
// p0 is point of interest, p1: start of line, p2: end of line
function lineCP(p2, p0, p1) {
  var p10 = {x: p0.x-p1.x, y: p0.y-p1.y};
  var p12 = {x: p2.x-p1.x, y: p2.y-p1.y};
  var t = vecDot(p12, p10) / vecDot(p12, p12);
  var CPx = p1.x + t*p12.x;
  var CPy = p1.y + t*p12.y;

  return {x: CPx, y: CPy, t: t};
}

