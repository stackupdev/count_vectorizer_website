document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('spam-form');
    const messageInput = document.getElementById('message');
    const resultDiv = document.getElementById('result');
    const mascot = document.getElementById('mascot');
    const mascotMouth = document.getElementById('mascot-mouth');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    const originalMouthPath = 'M30 48 Q40 55 50 48';
    const frownMouthPath = 'M30 50 Q40 43 50 50';

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function confettiBurst() {
        const colors = ['#7b61ff', '#4f8cff', '#ffb347', '#ff7f7f', '#7fffd4', '#ffe066', '#f6e6ff'];
        const confetti = [];
        for (let i = 0; i < 80; i++) {
            confetti.push({ x: confettiCanvas.width / 2, y: confettiCanvas.height / 2 - 80, r: Math.random() * 7 + 4, color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * 2 * Math.PI, speed: Math.random() * 5 + 2 });
        }
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confetti.forEach(c => { c.x += Math.cos(c.angle) * c.speed; c.y += Math.sin(c.angle) * c.speed + frame * 0.05; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, 0, 0, 2 * Math.PI); ctx.fillStyle = c.color; ctx.fill(); });
            frame++;
            if (frame < 70) requestAnimationFrame(draw); else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        draw();
    }

    function junkBurst() {
        const colors = ['#a9a9a9', '#808080', '#696969', '#778899', '#2f4f4f'];
        const junk = [];
        for (let i = 0; i < 50; i++) {
            junk.push({ x: confettiCanvas.width / 2, y: confettiCanvas.height / 2 - 80, w: Math.random() * 8 + 5, h: Math.random() * 8 + 5, color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * 2 * Math.PI, speed: Math.random() * 4 + 3, rotation: Math.random() * 2 * Math.PI });
        }
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            junk.forEach(j => { j.x += Math.cos(j.angle) * j.speed; j.y += Math.sin(j.angle) * j.speed + frame * 0.08; j.rotation += 0.1; ctx.save(); ctx.translate(j.x, j.y); ctx.rotate(j.rotation); ctx.fillStyle = j.color; ctx.fillRect(-j.w / 2, -j.h / 2, j.w, j.h); ctx.restore(); });
            frame++;
            if (frame < 80) requestAnimationFrame(draw); else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        draw();
    }

    function triggerSpamAnimation() {
        mascot.style.animation = 'mascot-shake 0.5s linear';
        mascotMouth.setAttribute('d', frownMouthPath);
        junkBurst();
        setTimeout(() => {
            mascot.style.animation = 'mascot-bounce 1.4s cubic-bezier(.54,.01,.5,1.6) infinite';
            mascotMouth.setAttribute('d', originalMouthPath);
        }, 600);
    }

    function triggerNotSpamAnimation() {
        confettiBurst();
        const leftEye = mascot.querySelector('ellipse[cx="27"]');
        const rightEye = mascot.querySelector('ellipse[cx="53"]');
        if (leftEye && rightEye) {
            leftEye.setAttribute('ry', '1.2');
            rightEye.setAttribute('ry', '1.2');
            setTimeout(() => { leftEye.setAttribute('ry', '4'); rightEye.setAttribute('ry', '4'); }, 180);
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        resultDiv.textContent = 'Checking...';
        resultDiv.className = 'result';
        try {
            const response = await fetch('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: messageInput.value }) });
            const data = await response.json();
            if (data.prediction === 'Spam') {
                resultDiv.textContent = `🚫 Spam (Confidence: ${(data.probability * 100).toFixed(1)}%)`;
                resultDiv.classList.add('spam');
                triggerSpamAnimation();
            } else {
                resultDiv.textContent = `✅ Not Spam (Confidence: ${(data.probability * 100).toFixed(1)}%)`;
                resultDiv.classList.add('not-spam');
                triggerNotSpamAnimation();
            }
        } catch (err) {
            resultDiv.textContent = 'Error: Could not classify message.';
            resultDiv.className = 'result';
        }
    });
});
