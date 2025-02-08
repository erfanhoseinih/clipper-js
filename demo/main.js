let shape = [];
let shapeskit;
let canvas;
let ctx;
let colors = [];

function main() {
  canvas = document.getElementById("canvas");
  ctx = canvas.createCanvasContext(500, 500);

  ctx.background(200, 200, 200);
 

  shapeskit = new ShapesKit();

  shape.push(shapeskit.rect(100, 100, 100, 100));

  shape.push(shapeskit.circle(111, 119, 60));

  shape.forEach((a) => {
    ctx.fill(200, 200, 200);
    ctx.beginPath();
    a.forEach((b) => {
      ctx.lineTo(b.x, b.y);
    });

    ctx.closePath();
  });

  let result = clipper.clip(clipper.initShape(shape[0]), clipper.initShape(shape[1]));
  for (let i = 0; i < 10; i++) {
    colors.push([
      Math.random() * 250,
      Math.random() * 250,
      Math.random() * 250,
    ]);
  }

  console.log(result);

  result.forEach((a, i) => {
    ctx.fill(...colors[i]);
    ctx.stroke(0, 0, 0);
    ctx.beginPath();
    a.forEach((b) => {
      ctx.lineTo(b.x, b.y);
    });

    ctx.closePath();
  });
}

// document.addEventListener("mousemove", (ev) => {

//   ctx.background(200, 200, 200);

//   shape[1] = shapeskit.circle(ev.clientX, ev.clientY, 60);

//   shape.forEach((a) => {
//     ctx.fill(200,200,200);
//     ctx.beginPath();
//     a.forEach((b) => {
//       ctx.lineTo(b.x, b.y);
//     });

//     ctx.closePath();
//     ctx.stroke();
//   });

//   let result = clipper(shapeClipper(shape[0]), shapeClipper(shape[1]));

//   result.forEach((a, i) => {
//     ctx.fill(...colors[i]);
//     ctx.beginPath();
//     a.forEach((b) => {
//       ctx.lineTo(b.x, b.y);
//     });

//     ctx.closePath();

//   });
// });
