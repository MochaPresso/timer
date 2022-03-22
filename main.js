// create clock lines
(function createLinesLeftSide() {
  const clockLines = document.querySelector(`.clock-lines.left-side`);
  let rotate = 0;

  function byFive(e) {
    return e / 5 === parseInt(e / 5, 10) ? true : false;
  }

  for (i = 1; i < 31; i++) {
    let span = document.createElement("span-left");

    if (byFive(i)) {
      span.className = "fives";
    }
    span.style.transform = `translate(-50%, -50%) rotate(${rotate + 6}deg)`;
    clockLines.appendChild(span);
    rotate += 6;
  }
})();

(function createLinesRightSide() {
  const clockLines = document.querySelector(`.clock-lines.right-side`);
  let rotate = 0;

  function byFive(e) {
    return e / 5 === parseInt(e / 5, 10) ? true : false;
  }

  for (i = 1; i < 31; i++) {
    let span = document.createElement("span-right");

    if (byFive(i)) {
      span.className = "fives";
    }
    span.style.transform = `translate(-50%, -50%) rotate(${rotate + 6}deg)`;
    clockLines.appendChild(span);
    rotate += 6;
  }
})();

// make minute hand turn when click mouse
(function minuteCircle() {
  const rotateCircle = document.querySelector(".rotate-clock");
  const rotateInClock = document.querySelectorAll(".rotate-in-clock");
  const wrapperSpinner = document.querySelector(".spinner");
  const wrapperFilter = document.querySelector(".filter");
  const rightMask = document.querySelector(".mask-right");
  const aaa = document.querySelector(".left-side");
  let offsetRad;
  let targetRad = 0;
  let previousRad;

  // console.log(this);

  try {
    rotateCircle.addEventListener("mousedown", down);
  } catch (err) {
    console.log(err);
  }

  function down(e) {
    offsetRad = getRotation(e);
    previousRad = offsetRad;
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
  }

  function up(e) {
    // console.log(e);
    console.log(timer(move(e)));
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  function move(e) {
    let newRad = getRotation(e);
    // console.log(newRad);
    targetRad += newRad - previousRad;
    // console.log(targetRad);
    previousRad = newRad;
    let angle = Math.floor((targetRad / Math.PI) * 180) % 360;
    angle = angle >= 0 ? angle : angle + 360;
    if (angle >= 1 && angle < 6) return;

    // if (angle == 0) {
    //   rightMask.style.opacity = 1;
    //   wrapperSpinner.style.transform = `rotate(${angle}deg)`;
    //   wrapperFilter.style.transform = `rotate(${angle}deg)`;
    // } else if (angle >= 180 && angle <= 360) {
    //   rightMask.style.opacity = 1;
    //   wrapperSpinner.style.transform = `rotate(${angle}deg)`;
    // } else if (angle >= 6 && angle <= 180) {
    //   rightMask.style.opacity = 0;
    //   wrapperSpinner.style.transform = `rotate(180deg)`;
    //   wrapperFilter.style.transform = `rotate(${180 + angle}deg)`;
    // }

    rotateInClock[0].style.transform = `rotate(${angle}deg)`;
    rotateInClock[1].style.transform = `rotate(${angle}deg)`;
    let aa = createCircle(angle);
    console.log(aa);

    return angle;
  }

  function getRotation(e) {
    let pos = mousePos(e, rotateCircle);
    let x = pos.x;
    let y = pos.y;

    // console.log(pos.x, pos.y);
    // console.log(rotateCircle.clientWidth, rotateCircle.clientHeight);
    // console.log({ x, y });
    // console.log(Math.atan2(y, x));

    return Math.atan2(y, x);
  }

  function mousePos(e, currentElement) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while ((currentElement = currentElement.offsetParent));

    canvasX = e.pageX - totalOffsetX;
    canvasY = e.pageY - totalOffsetY;

    // console.log({ canvasX, canvasY });
    // console.log(e.pageX, e.pageY);

    return { x: canvasX, y: canvasY };
  }
})();

function timer(seconds) {
  let convertSeconds = (360 - seconds) * 10;
  let countdown;

  console.log(convertSeconds);

  //clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = (now + convertSeconds) * 1000;

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // console.log(secondsLeft);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
  }, 1000);

  // console.log(countdown);
}

function createCircle(element) {
  refreshCanvas(element);

  function refreshCanvas(e) {
    let radius = 208;
    const canvas = document.querySelector("#vvCanvas");
    const pixelDensity = window.devicePixelRatio;
    setupCanvas(canvas, pixelDensity, radius, radius);

    let ctx = canvas.getContext("2d");
    ctx.setTransform(pixelDensity, 0, 0, pixelDensity, 0, 0);

    let size = radius;
    ctx.fillStyle = "hotpink";
    ctx.beginPath();
    ctx.moveTo(size / 2, size / 2);
    ctx.arc(
      size / 2,
      size / 2,
      size / 2 - 3 * 2,
      (Math.PI / 180) * 270,
      (Math.PI / 180) * (270 + e),
      true
    );
    ctx.lineTo(size / 2, size / 2);
    ctx.fill();
    ctx.closePath();
  }

  function setupCanvas(canvasTarget, pixelDensity, drawWidth, drawHeight) {
    let nativeCanvasWidth = drawWidth * pixelDensity;
    let nativeCanvasHeight = drawHeight * pixelDensity;

    canvasTarget.width = nativeCanvasWidth;
    canvasTarget.height = nativeCanvasHeight;
    canvasTarget.style.width = drawWidth + "px";
    canvasTarget.style.height = drawHeight + "px";
  }

  window.onresize = () => {
    refreshCanvas(element);
  };

  return element;
}
