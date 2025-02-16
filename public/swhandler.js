document.getElementById("searchBar").addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();

        startLoader();

        let query = document.getElementById("searchBar").value;
        let url;

        if (/^https?:\/\/[^\s]+(\.[^\s]+)+$/.test(query)) {
            url = query;
        } else if (/^[^\s]+(\.[^\s]+)+$/.test(query)) {
            url = `https://${query}`;
        } else {
            url = `https://www.google.com?q=${encodeURIComponent(query)}`;
        }

        console.log(url);

        document.getElementById("youtubeIframe").src = __uv$config.prefix + __uv$config.encodeUrl(url);
        document.getElementById("youtubeIframe").onload = stopLoader;
        document.getElementById("youtubeOverlay").style.display = "flex";
    }
});

document.getElementById("youtubeIframe").addEventListener("load", function () {
    stopLoader(); // Ensure loader hides when the page loads
});


function startLoader() {
    document.getElementById("loader").style.display = "flex";

}

function stopLoader() {
    document.getElementById("loader").style.display = "none";

}

function closeIframe(event) {
    console.log("closing iframe");
    document.getElementById("youtubeOverlay").style.display = "none";
    document.getElementById("youtubeIframe").src = "";
}

const containerEl = document.querySelector(".container");
const canvasEl = document.querySelector("canvas#neuro");
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

const pointer = {
	x: 0,
	y: 0,
	tX: 0,
	tY: 0
};

let uniforms;
const gl = initShader();


resizeCanvas();
window.addEventListener("resize", resizeCanvas);

render();

function initShader() {
	const vsSource = document.getElementById("vertShader").innerHTML;
	const fsSource = document.getElementById("fragShader").innerHTML;

	const gl =
		canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

	if (!gl) {
		alert("WebGL is not supported by your browser.");
	}

	function createShader(gl, sourceCode, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, sourceCode);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(
				"An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
			);
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
	const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

	function createShaderProgram(gl, vertexShader, fragmentShader) {
		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(
				"Unable to initialize the shader program: " + gl.getProgramInfoLog(program)
			);
			return null;
		}

		return program;
	}

	const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
	uniforms = getUniforms(shaderProgram);

	function getUniforms(program) {
		let uniforms = [];
		let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			let uniformName = gl.getActiveUniform(program, i).name;
			uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
		}
		return uniforms;
	}

	const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	gl.useProgram(shaderProgram);

	const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	return gl;
}

function render() {
	const currentTime = performance.now();

	pointer.x += (pointer.tX - pointer.x) * 0.2;
	pointer.y += (pointer.tY - pointer.y) * 0.2;

	gl.uniform1f(uniforms.u_time, currentTime);
	gl.uniform2f(
		uniforms.u_pointer_position,
		pointer.x / window.innerWidth,
		1 - pointer.y / window.innerHeight
	);
	gl.uniform1f(
		uniforms.u_scroll_progress,
		window["pageYOffset"] / (2 * window.innerHeight)
	);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	requestAnimationFrame(render);
}

function resizeCanvas() {
	canvasEl.width = window.innerWidth * devicePixelRatio;
	canvasEl.height = window.innerHeight * devicePixelRatio;
	gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
	gl.viewport(0, 0, canvasEl.width, canvasEl.height);
}


