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
        const matrixChars = [];
        
        // Create matrix rain (make it more prominent)
        for (let i = 0; i < 120; i++) {
            matrixChars.push({
                x: Math.random() * confettiCanvas.width,
                y: -40,
                char: String.fromCharCode(0x30A0 + Math.random() * 96),
                speed: Math.random() * 3.5 + 2.5,
                alpha: Math.random() * 0.7 + 0.6
            });
        }
        
        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            // Draw matrix rain (larger, brighter, more)
            ctx.fillStyle = '#39ff14';
            ctx.font = '22px monospace';
            matrixChars.forEach(char => {
                ctx.globalAlpha = char.alpha;
                ctx.shadowColor = '#39ff14';
                ctx.shadowBlur = 14;
                ctx.fillText(char.char, char.x, char.y);
                ctx.shadowBlur = 0;
                char.y += char.speed;
                if (char.y > confettiCanvas.height) {
                    char.y = -40;
                    char.x = Math.random() * confettiCanvas.width;
                }
            });
            

            
            frame++;
            if (frame < 240) requestAnimationFrame(draw); else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        draw();
    }

    function redAlertGlitch() {
        const centerX = confettiCanvas.width / 2;
        const centerY = confettiCanvas.height / 2;
        const glitchLines = [];
        
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
            setTimeout(() => { leftEye.setAttribute('ry', '4'); rightEye.setAttribute('ry', '4'); }, 240);
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
        
        // Re-enable message input
        messageInput.disabled = false;
        messageInput.style.opacity = '1';
        messageInput.style.cursor = 'text';
        console.log('Reset completed - analyze button and message input re-enabled');
        
        // Reset mascot completely
        mascotMouth.setAttribute('d', originalMouthPath);
        mascot.style.transform = '';
        mascot.style.animation = 'mascot-bounce 1.4s cubic-bezier(.54,.01,.5,1.6) infinite'; // Reset to default animation
        
        // Reset mascot eyes to original state
        const leftEye = mascot.querySelector('ellipse[cx="27"]');
        const rightEye = mascot.querySelector('ellipse[cx="53"]');
        if (leftEye && rightEye) {
            leftEye.setAttribute('ry', '4');
            rightEye.setAttribute('ry', '4');
        }
        
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
        
        // Disable analyze button and message input immediately
        btnAnalyze.disabled = true;
        btnAnalyze.style.opacity = '0.6';
        btnAnalyze.style.cursor = 'not-allowed';
        btnAnalyze.style.pointerEvents = 'none';
        
        // Make message box non-editable during analysis
        messageInput.disabled = true;
        messageInput.style.opacity = '0.7';
        messageInput.style.cursor = 'not-allowed';
        
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
                console.log('Analysis complete - only reset button is active');
            }, 800);
            
        } catch (err) {
            resultContent.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
                <div style="font-size: 1.2rem; font-weight: 600;">Analysis Failed</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Please try again</div>
            `;
            resultDiv.className = 'result show';
            
            // Re-enable analyze button on error so user can try again
            btnAnalyze.disabled = false;
            btnAnalyze.style.opacity = '1';
            btnAnalyze.style.cursor = 'pointer';
            btnAnalyze.style.pointerEvents = 'auto';
            console.log('Analysis failed - analyze button re-enabled for retry');
        }
    });
});
