// generative-bg.js
function setupGenerativeBackground() {
    // Creează canvas-ul
    const canvas = createCanvas(windowWidth, windowHeight);
    
    // Atașează canvas-ul la div-ul corespunzător
    canvas.parent('generative-bg');
    
    // Setări inițiale
    background(0);
}

function draw() {
    background(0, 25);
    translate(width / 2, height / 2);
    
    noFill();
    stroke(255, 10);
    strokeWeight(1);

    const time = frameCount * 0.008;
    const numLines = 80; 
    const numPoints = 200; 

    for (let i = 0; i < numLines; i++) {
        const linePhase = (i / numLines) * TWO_PI; 

        beginShape();
        for (let j = 0; j <= numPoints; j++) {
            const pointPhase = j / numPoints;
            
            const y = map(pointPhase, 0, 1, -height / 2.5, height / 2.5);

            const envelope = sin(pointPhase * PI);
            const wave1 = sin(time + linePhase) * 60;
            const wave2 = sin(pointPhase * 8 + time * 2) * 40;
            const centerComplexity = pow(cos(pointPhase * PI - HALF_PI), 2) * 100;
            const wave3 = cos(linePhase * 4 - time) * centerComplexity;
            const x = envelope * (wave1 + wave2 + wave3 + 60);

            vertex(-x, y); 
        }
        endShape();

        beginShape();
        for (let j = 0; j <= numPoints; j++) {
            const pointPhase = j / numPoints;
            const y = map(pointPhase, 0, 1, -height / 2.5, height / 2.5);
            
            const envelope = sin(pointPhase * PI);
            const wave1 = sin(time + linePhase) * 60;
            const wave2 = sin(pointPhase * 8 + time * 2) * 40;
            const centerComplexity = pow(cos(pointPhase * PI - HALF_PI), 2) * 100;
            const wave3 = cos(linePhase * 4 - time) * centerComplexity;
            const x = envelope * (wave1 + wave2 + wave3 + 60);

            vertex(x, y); 
        }
        endShape();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Inițializează când se încarcă pagina
document.addEventListener('DOMContentLoaded', function() {
    // Verifică dacă p5.js este încărcat
    if (typeof createCanvas !== 'undefined') {
        setupGenerativeBackground();
    }
});
