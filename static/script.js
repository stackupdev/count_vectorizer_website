document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('spam-form');
    const messageInput = document.getElementById('message');
    const resultDiv = document.getElementById('result');

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
        } catch (err) {
            resultDiv.textContent = 'Error: Could not classify message.';
            resultDiv.className = 'result';
        }
    });
});
