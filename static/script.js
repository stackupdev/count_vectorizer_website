document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('spam-form');
    const messageInput = document.getElementById('message');
    const resultDiv = document.getElementById('result');
    const resultContent = document.querySelector('.result-content');
    const mainBtn = document.getElementById('main-btn');
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnReset = document.getElementById('btn-reset');
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

    function digitalShieldAnimation() {
        const centerX = confettiCanvas.width / 2;
        const centerY = confettiCanvas.height / 2 - 50;
        const shieldParticles = [];
        const matrixChars = [];
        
        // Create shield particles
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const radius = 80 + Math.random() * 40;
            shieldParticles.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                targetX: centerX + Math.cos(angle) * 60,
                targetY: centerY + Math.sin(angle) * 60,
                size: Math.random() * 4 + 2,
                alpha: 0
            });
        }
        
        // Create matrix rain
        for (let i = 0; i < 50; i++) {
            matrixChars.push({
                x: Math.random() * confettiCanvas.width,
                y: -20,
                char: String.fromCharCode(0x30A0 + Math.random() * 96),
                speed: Math.random() * 3 + 2,
                alpha: Math.random() * 0.8 + 0.2
            });
        }
        
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            // Draw matrix rain
            ctx.fillStyle = '#00ff41';
            ctx.font = '14px monospace';
            matrixChars.forEach(char => {
                ctx.globalAlpha = char.alpha;
                ctx.fillText(char.char, char.x, char.y);
                char.y += char.speed;
                if (char.y > confettiCanvas.height) {
                    char.y = -20;
                    char.x = Math.random() * confettiCanvas.width;
                }
            });
            
            // Draw shield formation
            ctx.globalAlpha = 1;
            shieldParticles.forEach(particle => {
                particle.x += (particle.targetX - particle.x) * 0.1;
                particle.y += (particle.targetY - particle.y) * 0.1;
                particle.alpha = Math.min(particle.alpha + 0.02, 0.8);
                
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = '#00ff41';
                ctx.shadowColor = '#00ff41';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
            frame++;
            if (frame < 120) requestAnimationFrame(draw); else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        draw();
    }

    function redAlertGlitch() {
        const centerX = confettiCanvas.width / 2;
        const centerY = confettiCanvas.height / 2;
        const firewallBlocks = [];
        const glitchLines = [];
        
        // Create firewall blocks
        for (let i = 0; i < 12; i++) {
            firewallBlocks.push({
                x: centerX - 150 + (i * 25),
                y: centerY + 100,
                targetY: centerY - 50 - (Math.random() * 100),
                width: 20,
                height: Math.random() * 60 + 40,
                alpha: 0,
                delay: i * 5
            });
        }
        
        // Create glitch scan lines
        for (let i = 0; i < 8; i++) {
            glitchLines.push({
                y: Math.random() * confettiCanvas.height,
                width: confettiCanvas.width,
                height: Math.random() * 4 + 2,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 10 + 5
            });
        }
        
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            // Screen glitch effect
            if (frame < 30 && frame % 3 === 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                ctx.fillRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
            
            // Draw glitch scan lines
            glitchLines.forEach(line => {
                ctx.globalAlpha = line.alpha;
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(0, line.y, line.width, line.height);
                line.y += line.speed;
                if (line.y > confettiCanvas.height) {
                    line.y = -line.height;
                    line.alpha = Math.random() * 0.8 + 0.2;
                }
            });
            
            // Draw firewall blocks
            ctx.globalAlpha = 1;
            firewallBlocks.forEach(block => {
                if (frame > block.delay) {
                    block.y += (block.targetY - block.y) * 0.15;
                    block.alpha = Math.min(block.alpha + 0.05, 0.9);
                    
                    ctx.globalAlpha = block.alpha;
                    ctx.fillStyle = '#ff3333';
                    ctx.shadowColor = '#ff0000';
                    ctx.shadowBlur = 15;
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                    
                    // Add warning triangles
                    ctx.fillStyle = '#ffff00';
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 8;
                    const triSize = 8;
                    ctx.beginPath();
                    ctx.moveTo(block.x + block.width/2, block.y - triSize);
                    ctx.lineTo(block.x + block.width/2 - triSize, block.y + triSize);
                    ctx.lineTo(block.x + block.width/2 + triSize, block.y + triSize);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                }
            });
            
            frame++;
            if (frame < 100) requestAnimationFrame(draw); else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        draw();
    }

    function triggerSpamAnimation() {
        mascot.style.animation = 'mascot-shake 0.5s linear';
        mascotMouth.setAttribute('d', frownMouthPath);
        redAlertGlitch();
        setTimeout(() => {
            mascot.style.animation = 'mascot-bounce 1.4s cubic-bezier(.54,.01,.5,1.6) infinite';
            mascotMouth.setAttribute('d', originalMouthPath);
        }, 600);
    }

    function triggerNotSpamAnimation() {
        digitalShieldAnimation();
        const leftEye = mascot.querySelector('ellipse[cx="27"]');
        const rightEye = mascot.querySelector('ellipse[cx="53"]');
        if (leftEye && rightEye) {
            leftEye.setAttribute('ry', '1.2');
            rightEye.setAttribute('ry', '1.2');
            setTimeout(() => { leftEye.setAttribute('ry', '4'); rightEye.setAttribute('ry', '4'); }, 180);
        }
    }

    // Reset functionality
    function resetAll() {
        // Clear input and results
        messageInput.value = '';
        resultDiv.className = 'result';
        resultContent.innerHTML = '';
        
        // Reset button state
        mainBtn.classList.remove('has-reset');
        
        // Re-enable analyze button completely
        btnAnalyze.disabled = false;
        btnAnalyze.style.opacity = '1';
        btnAnalyze.style.cursor = 'pointer';
        btnAnalyze.style.pointerEvents = 'auto';
        console.log('Reset completed - analyze button re-enabled');
        
        // Reset mascot
        mascotMouth.setAttribute('d', originalMouthPath);
        mascot.style.transform = '';
        
        // Clear canvas
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // Focus back on textarea
        messageInput.focus();
    }
    
    // Reset button click handler
    btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetAll();
    });

    // Analyze button click handler
    btnAnalyze.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent multiple clicks if already disabled
        if (btnAnalyze.disabled) {
            console.log('Button already disabled, ignoring click');
            return;
        }
        
        console.log('Analyze button clicked - starting analysis');
        
        // Validate message is not empty
        const message = messageInput.value.trim();
        if (!message) {
            // Show error for empty message
            resultContent.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
                <div style="font-size: 1.2rem; font-weight: 600; color: #ff6b6b;">Please enter a message</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Enter some text to analyze for spam</div>
            `;
            resultDiv.className = 'result show';
            messageInput.focus();
            return;
        }
        
        // Disable analyze button immediately
        btnAnalyze.disabled = true;
        btnAnalyze.style.opacity = '0.6';
        btnAnalyze.style.cursor = 'not-allowed';
        btnAnalyze.style.pointerEvents = 'none';
        
        // Clear previous results and animations
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // Show loading state
        resultContent.textContent = '🔍 Analyzing message...';
        resultDiv.className = 'result show';
        
        try {
            const response = await fetch('/predict', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ message: message }) 
            });
            const data = await response.json();
            
            // Add slight delay for better UX
            setTimeout(() => {
                if (data.prediction === 'Spam') {
                    resultContent.innerHTML = `
                        <div style="font-size: 2rem; margin-bottom: 8px;">🚨</div>
                        <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 4px;">THREAT DETECTED</div>
                        <div style="font-size: 1rem; opacity: 0.9;">Confidence: ${(data.probability * 100).toFixed(1)}%</div>
                    `;
                    resultDiv.className = 'result show spam';
                    triggerSpamAnimation();
                } else {
                    resultContent.innerHTML = `
                        <div style="font-size: 2rem; margin-bottom: 8px;">✅</div>
                        <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 4px;">MESSAGE SECURE</div>
                        <div style="font-size: 1rem; opacity: 0.9;">Confidence: ${(data.probability * 100).toFixed(1)}%</div>
                    `;
                    resultDiv.className = 'result show not-spam';
                    triggerNotSpamAnimation();
                }
                
                // Show reset button after analysis
                mainBtn.classList.add('has-reset');
            }, 800);
            
        } catch (err) {
            resultContent.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
                <div style="font-size: 1.2rem; font-weight: 600;">Analysis Failed</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Please try again</div>
            `;
            resultDiv.className = 'result show';
        }
    });

    // Reset button functionality - use the consolidated resetAll function
    btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetAll();
    });
});
