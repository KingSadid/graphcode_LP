/* ============================================
   Theater — p5.js WebGL 3D Movie Theater
   ============================================ */

export function initTheater() {
    const container = document.getElementById('theater-canvas-container');
    if (!container) return null;

    const sketch = (p) => {
        let rotX = 0;
        let rotY = 0;
        let targetRotX = 0;
        let targetRotY = 0;
        let autoRotate = 0;

        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
            canvas.parent(container);
            p.textFont('Arial');
            p.textAlign(p.CENTER, p.CENTER);
        };

        p.draw = () => {
            p.background(8, 8, 12);

            // Auto-rotate slowly
            autoRotate += 0.002;

            // Mouse interaction
            targetRotY = p.map(p.mouseX, 0, p.width, -0.15, 0.15);
            targetRotX = p.map(p.mouseY, 0, p.height, -0.08, 0.08);
            rotX += (targetRotX - rotX) * 0.05;
            rotY += (targetRotY - rotY) * 0.05;

            p.rotateX(rotX);
            p.rotateY(rotY + autoRotate);

            // Ambient lighting
            p.ambientLight(40, 30, 50);
            p.pointLight(233, 30, 140, 0, -200, 200); // Pink spotlight
            p.pointLight(108, 99, 255, 200, -100, 100); // Blue spotlight
            p.pointLight(80, 60, 100, -200, -100, 100); // Purple fill

            // Draw theater room
            drawRoom(p);
            drawScreen(p);
            drawSeats(p);
            drawFloorLights(p);
        };

        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
    };

    const p5Instance = new p5(sketch);

    // Return cleanup
    return () => {
        p5Instance.remove();
    };
}

function drawRoom(p) {
    p.push();

    // Floor
    p.push();
    p.translate(0, 120, 0);
    p.rotateX(p.HALF_PI);
    p.fill(15, 12, 25);
    p.noStroke();
    p.plane(600, 500);
    p.pop();

    // Back wall
    p.push();
    p.translate(0, -30, -250);
    p.fill(12, 10, 20);
    p.noStroke();
    p.plane(600, 300);
    p.pop();

    // Left wall
    p.push();
    p.translate(-300, -30, 0);
    p.rotateY(p.HALF_PI);
    p.fill(10, 8, 18);
    p.noStroke();
    p.plane(500, 300);
    p.pop();

    // Right wall
    p.push();
    p.translate(300, -30, 0);
    p.rotateY(p.HALF_PI);
    p.fill(10, 8, 18);
    p.noStroke();
    p.plane(500, 300);
    p.pop();

    // Ceiling
    p.push();
    p.translate(0, -180, 0);
    p.rotateX(p.HALF_PI);
    p.fill(8, 6, 14);
    p.noStroke();
    p.plane(600, 500);
    p.pop();

    p.pop();
}

function drawScreen(p) {
    p.push();
    p.translate(0, -50, -245);

    // Screen frame — glowing border
    p.push();
    p.noFill();
    p.stroke(233, 30, 140, 100);
    p.strokeWeight(3);
    p.plane(320, 180);
    p.pop();

    // Screen surface
    p.push();
    p.translate(0, 0, 1);
    p.fill(20, 18, 30);
    p.noStroke();
    p.plane(316, 176);
    p.pop();

    // "Coming soon" text on screen
    p.push();
    p.translate(0, -20, 2);
    p.fill(233, 30, 140);
    p.textSize(16);
    p.text('🎬', 0, -30);
    p.textSize(14);
    p.fill(240, 240, 240);
    p.text('La función estará', 0, 0);
    p.text('próximamente disponible', 0, 22);
    p.pop();

    // Animated glow on screen edges
    const glowPulse = p.sin(p.frameCount * 0.03) * 30 + 60;
    p.push();
    p.translate(0, 0, 0.5);
    p.noFill();
    p.stroke(233, 30, 140, glowPulse);
    p.strokeWeight(2);
    p.plane(322, 182);
    p.pop();

    p.pop();
}

function drawSeats(p) {
    p.push();
    const rows = 5;
    const seatsPerRow = 9;
    const seatWidth = 28;
    const seatDepth = 22;

    for (let r = 0; r < rows; r++) {
        for (let s = 0; s < seatsPerRow; s++) {
            const x = (s - seatsPerRow / 2 + 0.5) * (seatWidth + 6);
            const y = 100 - r * 10;
            const z = 80 + r * 50;

            p.push();
            p.translate(x, y, z);

            // Seat base
            p.fill(45, 20, 35);
            p.noStroke();
            p.box(seatWidth, 8, seatDepth);

            // Seat back
            p.push();
            p.translate(0, -12, -seatDepth / 2 + 2);
            p.fill(55, 25, 45);
            p.box(seatWidth, 24, 4);
            p.pop();

            // Armrests
            p.push();
            p.translate(-seatWidth / 2, -4, 0);
            p.fill(30, 15, 25);
            p.box(3, 10, seatDepth);
            p.pop();

            p.push();
            p.translate(seatWidth / 2, -4, 0);
            p.fill(30, 15, 25);
            p.box(3, 10, seatDepth);
            p.pop();

            p.pop();
        }
    }
    p.pop();
}

function drawFloorLights(p) {
    p.push();
    const lightCount = 10;
    const pulse = p.sin(p.frameCount * 0.04) * 0.3 + 0.7;

    for (let i = 0; i < lightCount; i++) {
        const x = (i - lightCount / 2 + 0.5) * 55;

        // Left aisle light
        p.push();
        p.translate(x, 118, 80);
        p.fill(233, 30, 140, 80 * pulse);
        p.noStroke();
        p.sphere(2);
        p.pop();

        // Right aisle light
        p.push();
        p.translate(x, 118, 200);
        p.fill(108, 99, 255, 60 * pulse);
        p.noStroke();
        p.sphere(2);
        p.pop();
    }
    p.pop();
}
