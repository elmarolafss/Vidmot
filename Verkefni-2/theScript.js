// nokkrar global variables
let gl = null;
let glCanvas = null;

let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

let vertexArray;
let vertexBuffer;
let vertexNumComponents;
let vertexCount;

let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;

let previousTime = 0.0;
let degreesPerSecond = 90.0;

window.addEventListener("load", startup, false);
// forrit fer af stað með load event sem heitir "startup"
function startup() {
  glCanvas = document.getElementById("glcanvas");
  gl = glCanvas.getContext("webgl");

  const shaderSet = [ // þetta array er með lista af shader föllum
    {
      type: gl.VERTEX_SHADER,
      id: "vertex-shader"
    },
    {
      type: gl.FRAGMENT_SHADER,
      id: "fragment-shader"
    }
  ];

  shaderProgram = buildShaderProgram(shaderSet); //þetta fall tekur við shaderSet og tengir það saman

  aspectRatio = glCanvas.width/glCanvas.height; //Stærðarhlutföll eru reiknuð með því að deila breidd og hæð 
  currentRotation = [0, 1]; //rotation vigur settur í 0, 1
  currentScale = [1.0, aspectRatio]; // stærðarvigur settur í 1.0, stærðarhlutfall

  vertexArray = new Float32Array([ //Þríhyrningur teiknaður
        0.0,  0.0,
        0.0, -0.5,
        0.5,  0.0
  ]);

  vertexBuffer = gl.createBuffer(); //Búum til nýjann buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //bindum ARRAY_BUFFER við nýja bufferinn
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW); //afritum þrýhyrninginn okkar í bufferinn

  vertexNumComponents = 2; // setjum fjölda hornpunkta í 2 (2D hornpunktar)
  vertexCount = vertexArray.length/vertexNumComponents; //hornpunkta fjöldi

  currentAngle = 0.0;
  rotationRate = 6; //hraði 60fps eða bara 6

  animateScene();
}

function buildShaderProgram(shaderInfo) {
  let program = gl.createProgram(); //þetta er kallað til að búa til tómt GLSL program

  shaderInfo.forEach(function(desc) { //fyrir hvern shader er kallað compileShader() til að compila þann shader
    let shader = compileShader(desc.id, desc.type);

    if (shader) {
      gl.attachShader(program, shader);
    }
  });

  gl.linkProgram(program) //þegar allir eru compilaðir þá er þessu hennt í GLSL programið

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { //villumelding
    console.log("Error linking shader program:");
    console.log(gl.getProgramInfoLog(program));
  }

  return program;
}

function compileShader(id, type) { // buildShaderProgram() kallar á compileShader()
  let code = document.getElementById(id).firstChild.nodeValue;
  let shader = gl.createShader(type);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function animateScene() { //teikning fyrir hvern ramma
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.clearColor(0.1, 0.1, 0.1,0.9);
  gl.clear(gl.COLOR_BUFFER_BIT); //byrjum á að setja bakgrunn

  let radians = currentAngle * Math.PI / 180; //snúnings vigur er reiknaður
  currentRotation[0] = Math.sin(radians);
  currentRotation[1] = Math.cos(radians);

  gl.useProgram(shaderProgram); //useProgram leyfir okkur að nota shaderProgram(lína 39)

  uScalingFactor =
      gl.getUniformLocation(shaderProgram, "uScalingFactor");
  uGlobalColor =
      gl.getUniformLocation(shaderProgram, "uGlobalColor");
  uRotationVector =
      gl.getUniformLocation(shaderProgram, "uRotationVector");
//upplýsingar um tengingu við JS kóðann og Shaders (Staðsetning á "uniforms")
  gl.uniform2fv(uScalingFactor, currentScale);
  gl.uniform2fv(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0.5, 0.2, 0.2, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// kallað á bindBuffer()(lína 52) og svo þarf að fá staðsetningu á hornpunkt með getAttributeLocation() til að geta okkur tilbuin fyrir teikningu
  aVertexPosition =
      gl.getAttribLocation(shaderProgram, "aVertexPosition"); 

  gl.enableVertexAttribArray(aVertexPosition)
  gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount); //nú er hægt að teikna einn ramma af þtíhyrning

  window.requestAnimationFrame(function(currentTime) { // næst er að kalla á næsta ramma
    let deltaAngle = ((currentTime - previousTime) / 1000.0)
          * degreesPerSecond;

    currentAngle = (currentAngle + deltaAngle) % 360;

    previousTime = currentTime;
    animateScene(); // teiknar næsta ramma
  })
}