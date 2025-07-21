document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('spam-form');
    const messageInput = document.getElementById('message');
    const resultDiv = document.getElementById('result');
    const mascot = document.getElementById('mascot');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    // Resize confetti canvas to fill viewport
    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Confetti burst
    function confettiBurst() {
        const colors = ['#7b61ff', '#4f8cff', '#ffb347', '#ff7f7f', '#7fffd4', '#ffe066', '#f6e6ff'];
        const confetti = [];
        const count = 80;
        for (let i = 0; i < count; i++) {
            confetti.push({
                x: confettiCanvas.width / 2,
                y: confettiCanvas.height / 2 - 80,
                r: Math.random() * 7 + 4,
                d: Math.random() * 80 + 30,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngle: 0,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                angle: Math.random() * 2 * Math.PI,
                speed: Math.random() * 5 + 2
            });
        }
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confetti.forEach(c => {
                c.x += Math.cos(c.angle) * c.speed;
                c.y += Math.sin(c.angle) * c.speed + frame * 0.05;
                c.tiltAngle += c.tiltAngleIncremental;
                c.tilt = Math.sin(c.tiltAngle) * 12;
                ctx.beginPath();
                ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, c.tilt, 0, 2 * Math.PI);
                ctx.fillStyle = c.color;
                ctx.globalAlpha = 0.9;
                ctx.fill();
                ctx.globalAlpha = 1;
            });
            frame++;
            if (frame < 70) {
                requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
        draw();
    }

    // Mascot blink animation (scales eyes)
    function mascotBlink() {
        // Find the two eye ellipses
        const leftEye = mascot.querySelector('ellipse[cx="27"]');
        const rightEye = mascot.querySelector('ellipse[cx="53"]');
        if (leftEye && rightEye) {
            leftEye.setAttribute('ry', '1.2');
            rightEye.setAttribute('ry', '1.2');
            setTimeout(() => {
                leftEye.setAttribute('ry', '4');
                rightEye.setAttribute('ry', '4');
            }, 180);
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        resultDiv.textContent = 'Checking...';
        resultDiv.className = 'result';
        const message = messageInput.value;
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            if (data.prediction === 'Spam') {
                resultDiv.textContent = `🚫 Spam (Confidence: ${(data.probability * 100).toFixed(1)}%)`;
                resultDiv.classList.add('spam');
            } else {
                resultDiv.textContent = `✅ Not Spam (Confidence: ${(data.probability * 100).toFixed(1)}%)`;
                resultDiv.classList.add('not-spam');
            }
            confettiBurst();
            mascotBlink();
        } catch (err) {
            resultDiv.textContent = 'Error: Could not classify message.';
            resultDiv.className = 'result';
        }
    });
});
