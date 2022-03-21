(function createLines() {
  const clockLines = document.querySelector(".clock-lines");
  let rotate = 0;

  function byFive(e) {
    return e / 5 === parseInt(e / 5, 10) ? true : false;
  }

  for (i = 0; i < 30; i++) {
    let span = document.createElement("span");

    if (byFive(i)) {
      span.className = "fives";
    }
    span.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
    clockLines.appendChild(span);
    rotate += 6;
  }
})();

(function minuteCircle() {
  const rotateCircle = document.querySelector(".rotate-circle");
  const rotateMinute = document.querySelector(".rotate-minute");
  let offsetRad;
  let targetRad = 0;
  let previousRad;

  console.log(this);

  try {
    rotateCircle.addEventListener("mousedown", down);
  } catch (err) {
    console.log(err);
  }

  function down(e) {
    offsetRad = getRotation(e);
    previousRad = offsetRad;
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  function move(e) {
    let newRad = getRotation(e);
    console.log(newRad);
    targetRad += newRad - previousRad;
    console.log(targetRad);
    previousRad = newRad;
    let angle = Math.floor((targetRad / Math.PI) * 180) % 360;
    angle = angle >= 0 ? angle : angle + 360;
    if (angle >= 1 && angle < 6) return;

    rotateMinute.style.transform = `rotate(${angle}deg)`;
  }

  function up() {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  }

  function getRotation(e) {
    let pos = mousePos(e, rotateCircle);
    let x = pos.x;
    let y = pos.y;

    // console.log(pos.x, pos.y);
    // console.log(rotateCircle.clientWidth, rotateCircle.clientHeight);
    console.log({ x, y });
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
