import { alarmSoundAudioString } from "./alarm_sound";

let countdown;
let countdownTitle;
const rotateCircle = document.querySelector(".rotate-clock");
const rotateInClock = document.querySelectorAll(".rotate-in-clock");

// create clock lines
(function createLinesLeftSide() {
  const clockLines = document.querySelector(`.clock-lines.left-side`);
  let rotate = 0;

  function byFive(e) {
    return e / 5 === parseInt(e / 5, 10);
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
    return e / 5 === parseInt(e / 5, 10);
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
    // onMouseDown
    clearInterval(countdown);
    clearInterval(countdownTitle);
    offsetRad = getRotation(e);
    // console.log(offsetRad);
    previousRad = offsetRad;
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
  }

  function up(e) {
    // onMouseUp
    // console.log(e);
    timer(move(e));
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  function move(e) {
    // onMouseMove
    let newRad = getRotation(e);
    // console.log(newRad);
    targetRad += newRad - previousRad;
    // console.log(targetRad);
    previousRad = newRad;
    let angle = Math.floor((targetRad / Math.PI) * 180) % 360; // targetAngle
    angle = angle >= 0 ? angle : angle + 360;
    // if (angle >= 1 && angle < 6) {
    //   return
    // };

    if (angle <= 3 && angle >= 0) {
      angle = 0;
    } else if (angle < 6 && angle > 3) {
      angle = 6;
    }

    rotateInClock[0].style.transform = `rotate(${angle}deg)`;
    rotateInClock[1].style.transform = `rotate(${angle}deg)`;
    createCircle(angle);

    return angle;
  }

  function getRotation(e) {
    // getMousePositionAngle
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

function timer(seconds) {
  clearInterval(countdown);
  clearInterval(countdownTitle);
  let convertSeconds = (360 - seconds) * 10;
  if (convertSeconds === 3600) {
    convertSeconds = 0;
  }

  // console.log(convertSeconds);

  //clear any existing timers
  const now = Date.now();
  const then = now + convertSeconds * 1000;

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 20);
    // console.log(secondsLeft);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      beep();
      return;
    }

    let movement = 360 - secondsLeft / 500;

    rotateInClock[0].style.transform = `rotate(${movement}deg)`;
    rotateInClock[1].style.transform = `rotate(${movement}deg)`;
    createCircle(movement);
  }, 20);

  countdownTitle = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // console.log(secondsLeft);

    if (secondsLeft < 0) {
      clearInterval(countdownTitle);
      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);

  // return countdown;
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;

  document.title = display;
}

function beep() {
  let snd = new Audio(alarmSoundAudioString);
  snd.play();
}
