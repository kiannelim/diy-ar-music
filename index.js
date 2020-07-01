function update() {
  // console.log('num markers: ', markers.length, deltaTime);
  const markers = beholder.detect();

  // draw markers here
  const ctx = beholder.ctx;
  ctx.lineWidth = 3;

  markers.forEach((m) => {
    const center = m.center;
    const corners = m.corners;
    const ctx = beholder.ctx;

    ctx.strokeStyle = "red";
    ctx.beginPath();

    corners.forEach((c, i) => {
      ctx.moveTo(c.x, c.y);
      c2 = corners[(i + 1) % corners.length];
      ctx.lineTo(c2.x, c2.y);
    });

    ctx.stroke();
    ctx.closePath();

    // draw first corner
    ctx.strokeStyle = "green";
    ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);

    ctx.strokeStyle = "yellow";
    ctx.strokeRect(center.x - 2, center.y - 2, 4, 4);
  });

  requestAnimationFrame(update);
}


  
window.onload = function() {
  // initialize detection stuff and hack in to detection loop
  beholder.init('#detection-canvas');
  
  
  // Detection param field changes
  document.querySelector('#MIN_MARKER_DISTANCE').addEventListener('change', (e) => {
    beholder.setParam('MIN_MARKER_DISTANCE', e.target.value)
  });
  document.querySelector('#MIN_MARKER_PERIMETER').addEventListener('change', (e) => {
    beholder.setParam('MIN_MARKER_PERIMETER', e.target.value)
  });
  document.querySelector('#MAX_MARKER_PERIMETER').addEventListener('change', (e) => {
    beholder.setParam('MAX_MARKER_PERIMETER', e.target.value)
  });
  document.querySelector('#SIZE_AFTER_PERSPECTIVE_REMOVAL').addEventListener('change', (e) => {
    beholder.setParam('SIZE_AFTER_PERSPECTIVE_REMOVAL', e.target.value)
  });

  const cameraSelect = document.querySelector('#CAMERA_INDEX')
  beholder.getCameraFeeds().then((feeds) => {
    cameraSelect.innerHTML = '';

    feeds.forEach((f, i) => {
      if (f.kind === 'videoinput') {
        const opt = document.createElement('option');
        opt.value = f.deviceId;
        opt.label = f.label ? f.label : i;
        if (i === 0) opt.selected = true;
        cameraSelect.appendChild(opt);
      }
    });

    cameraSelect.addEventListener('change', (e) => {
      console.log(e.target.value)
      beholder.setCamera(e.target.value);
    });
  });
  
  update();
}
