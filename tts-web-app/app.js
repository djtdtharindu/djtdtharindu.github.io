/* ============================================
   VoxWave - Text to Speech App
   Application Logic
   ============================================ */

(function () {
    'use strict';

    // ─── State ───
    const state = {
        synth: window.speechSynthesis,
        voices: [],
        utterance: null,
        isSpeaking: false,
        isPaused: false,
        history: JSON.parse(localStorage.getItem('voxwave-history') || '[]'),
        globalBoundaryIndex: 0,
        startBoundaryIndex: 0,
        isRestarting: false,
        restartTimeout: null,
    };

    // ─── DOM Elements ───
    const elements = {
        textInput: document.getElementById('textInput'),
        charCount: document.getElementById('charCount'),
        voiceSelect: document.getElementById('voiceSelect'),
        speedRange: document.getElementById('speedRange'),
        speedValue: document.getElementById('speedValue'),
        pitchRange: document.getElementById('pitchRange'),
        pitchValue: document.getElementById('pitchValue'),
        volumeRange: document.getElementById('volumeRange'),
        volumeValue: document.getElementById('volumeValue'),
        playBtn: document.getElementById('playBtn'),
        playIcon: document.getElementById('playIcon'),
        pauseIcon: document.getElementById('pauseIcon'),
        stopBtn: document.getElementById('stopBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        clearBtn: document.getElementById('clearBtn'),
        pasteBtn: document.getElementById('pasteBtn'),
        sampleBtn: document.getElementById('sampleBtn'),
        waveformBars: document.getElementById('waveformBars'),
        waveformContainer: document.getElementById('waveformContainer'),
        statusText: document.getElementById('statusText'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        bgParticles: document.getElementById('bgParticles'),
    };

    // ─── Sample Texts ───
    const sampleTexts = [
        "Welcome to VoxWave! This is a modern text-to-speech application that transforms your written words into natural-sounding speech. Try adjusting the voice, speed, and pitch to find your perfect settings.",
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once, making it a popular phrase for testing fonts and speech synthesis.",
        "In a world full of technology, the ability to convert text into speech opens up incredible possibilities for accessibility, learning, and communication. Let your words be heard!",
        "Artificial intelligence is transforming the way we interact with technology. From voice assistants to automated translation, the future of human-computer interaction is voice-first.",
        "Reading is to the mind what exercise is to the body. With text-to-speech technology, knowledge becomes accessible to everyone, everywhere, at any time.",
    ];

    // ─── Initialize ───
    function init() {
        createWaveformBars();
        createParticles();
        loadVoices();
        bindEvents();
        renderHistory();
        updateCharCount();
        registerServiceWorker();

        // Voices may load asynchronously
        if (state.synth.onvoiceschanged !== undefined) {
            state.synth.onvoiceschanged = loadVoices;
        }
    }

    // ─── Service Worker ───
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.warn('ServiceWorker registration failed: ', err);
            });
        }
    }

    // ─── Voices ───
    function loadVoices() {
        state.voices = state.synth.getVoices();
        const select = elements.voiceSelect;
        select.innerHTML = '';

        if (state.voices.length === 0) {
            select.innerHTML = '<option value="">No voices available</option>';
            return;
        }

        // Group voices by language
        const grouped = {};
        state.voices.forEach((voice, index) => {
            const lang = voice.lang.split('-')[0].toUpperCase();
            if (!grouped[lang]) grouped[lang] = [];
            grouped[lang].push({ voice, index });
        });

        // Sort language groups
        const sortedLangs = Object.keys(grouped).sort();

        sortedLangs.forEach(lang => {
            const group = document.createElement('optgroup');
            group.label = lang;
            grouped[lang].forEach(({ voice, index }) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice.default) option.selected = true;
                group.appendChild(option);
            });
            select.appendChild(group);
        });
    }

    // ─── Waveform ───
    function createWaveformBars() {
        const container = elements.waveformBars;
        container.innerHTML = '';
        const barCount = 50;
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            bar.style.height = '4px';
            bar.style.setProperty('--bar-height', `${Math.random() * 40 + 10}px`);
            bar.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(bar);
        }
    }

    function setWaveformActive(active) {
        const bars = elements.waveformBars.querySelectorAll('.waveform-bar');
        bars.forEach(bar => {
            if (active) {
                bar.classList.add('active');
                bar.style.setProperty('--bar-height', `${Math.random() * 45 + 10}px`);
            } else {
                bar.classList.remove('active');
                bar.style.height = '4px';
            }
        });
    }

    // ─── Particles ───
    function createParticles() {
        const container = elements.bgParticles;
        const count = 25;
        const colors = ['#a78bfa', '#06b6d4', '#14b8a6', '#ec4899'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(particle);
        }
    }

    // ─── Events ───
    function bindEvents() {
        elements.textInput.addEventListener('input', () => {
            updateCharCount();
            if (!state.isSpeaking) state.globalBoundaryIndex = 0;
        });

        elements.voiceSelect.addEventListener('change', updateRealTimeSettings);

        elements.speedRange.addEventListener('input', () => {
            elements.speedValue.textContent = `${parseFloat(elements.speedRange.value).toFixed(1)}x`;
            updateRealTimeSettings();
        });
        elements.pitchRange.addEventListener('input', () => {
            elements.pitchValue.textContent = parseFloat(elements.pitchRange.value).toFixed(1);
            updateRealTimeSettings();
        });
        elements.volumeRange.addEventListener('input', () => {
            elements.volumeValue.textContent = `${Math.round(elements.volumeRange.value * 100)}%`;
            updateRealTimeSettings();
        });

        elements.playBtn.addEventListener('click', togglePlay);
        elements.stopBtn.addEventListener('click', stopSpeaking);
        elements.clearBtn.addEventListener('click', clearText);
        elements.pasteBtn.addEventListener('click', pasteText);
        elements.sampleBtn.addEventListener('click', loadSample);
        elements.clearHistoryBtn.addEventListener('click', clearHistory);
        elements.downloadBtn.addEventListener('click', handleDownload);

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                togglePlay();
            }
            if (e.key === 'Escape') {
                stopSpeaking();
            }
        });
    }

    // ─── Character Count ───
    function updateCharCount() {
        const count = elements.textInput.value.length;
        elements.charCount.textContent = count;
        const counter = elements.charCount.parentElement;
        counter.classList.remove('warning', 'danger');
        if (count > 45000) counter.classList.add('danger');
        else if (count > 35000) counter.classList.add('warning');
    }

    // ─── Speech Controls ───
    function updateRealTimeSettings() {
        if (state.isSpeaking && !state.isPaused) {
            state.isRestarting = true;
            clearTimeout(state.restartTimeout);
            state.restartTimeout = setTimeout(() => {
                startSpeaking(state.globalBoundaryIndex);
            }, 250);
        }
    }

    function togglePlay() {
        if (state.isSpeaking && !state.isPaused) {
            pauseSpeaking();
        } else if (state.isPaused) {
            resumeSpeaking();
        } else {
            startSpeaking();
        }
    }

    function startSpeaking(fromIndex = 0) {
        const fullText = elements.textInput.value.trim();
        if (!fullText) {
            showToast('Please enter some text first', 'error');
            elements.textInput.focus();
            return;
        }

        const textToSpeak = fullText.substring(fromIndex);
        if (!textToSpeak) {
            stopSpeaking();
            return;
        }

        state.startBoundaryIndex = fromIndex;
        if (!state.isRestarting) {
            state.globalBoundaryIndex = fromIndex;
        }

        // Cancel any ongoing speech
        state.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Set voice
        const voiceIndex = elements.voiceSelect.value;
        if (voiceIndex !== '' && state.voices[voiceIndex]) {
            utterance.voice = state.voices[voiceIndex];
        }

        // Set parameters
        utterance.rate = parseFloat(elements.speedRange.value);
        utterance.pitch = parseFloat(elements.pitchRange.value);
        utterance.volume = parseFloat(elements.volumeRange.value);

        // Events
        utterance.onstart = () => {
            state.isSpeaking = true;
            state.isPaused = false;
            state.isRestarting = false;
            updateUI('speaking');
        };

        utterance.onboundary = (e) => {
            if (e.name === 'word') {
                state.globalBoundaryIndex = state.startBoundaryIndex + e.charIndex;
            }
        };

        utterance.onend = () => {
            if (state.isRestarting) return;
            state.isSpeaking = false;
            state.isPaused = false;
            state.globalBoundaryIndex = 0;
            updateUI('ready');
            if (fromIndex === 0) {
                addToHistory(fullText);
            }
        };

        utterance.onerror = (e) => {
            if (e.error !== 'canceled' && !state.isRestarting) {
                state.isSpeaking = false;
                state.isPaused = false;
                updateUI('ready');
                showToast('Speech synthesis error: ' + e.error, 'error');
            }
        };

        utterance.onpause = () => {
            if (state.isRestarting) return;
            state.isPaused = true;
            updateUI('paused');
        };

        utterance.onresume = () => {
            state.isPaused = false;
            updateUI('speaking');
        };

        state.utterance = utterance;
        state.synth.speak(utterance);
    }

    function pauseSpeaking() {
        if (state.synth.speaking) {
            state.synth.pause();
            state.isPaused = true;
            updateUI('paused');
        }
    }

    function resumeSpeaking() {
        if (state.synth.paused) {
            state.synth.resume();
            state.isPaused = false;
            updateUI('speaking');
        }
    }

    function stopSpeaking() {
        state.synth.cancel();
        state.isSpeaking = false;
        state.isPaused = false;
        state.globalBoundaryIndex = 0;
        updateUI('ready');
    }

    // ─── UI State Updates ───
    function updateUI(status) {
        const { playBtn, playIcon, pauseIcon, statusText } = elements;
        statusText.className = 'status-text';

        switch (status) {
            case 'speaking':
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                playBtn.classList.add('speaking');
                statusText.textContent = 'Speaking...';
                statusText.classList.add('speaking');
                setWaveformActive(true);
                break;
            case 'paused':
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                playBtn.classList.remove('speaking');
                statusText.textContent = 'Paused';
                statusText.classList.add('paused');
                setWaveformActive(false);
                break;
            case 'ready':
            default:
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                playBtn.classList.remove('speaking');
                statusText.textContent = 'Ready to speak';
                setWaveformActive(false);
                break;
        }
    }

    // ─── Text Actions ───
    function clearText() {
        elements.textInput.value = '';
        updateCharCount();
        stopSpeaking();
        elements.textInput.focus();
        showToast('Text cleared', 'success');
    }

    async function pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            elements.textInput.value = text;
            updateCharCount();
            elements.textInput.focus();
            showToast('Text pasted from clipboard', 'success');
        } catch {
            showToast('Could not access clipboard. Please paste manually.', 'error');
        }
    }

    function loadSample() {
        const randomIndex = Math.floor(Math.random() * sampleTexts.length);
        elements.textInput.value = sampleTexts[randomIndex];
        updateCharCount();
        elements.textInput.focus();
        showToast('Sample text loaded', 'success');
    }

    // ─── Download ───
    async function handleDownload() {
        const fullText = elements.textInput.value.trim();
        if (!fullText) {
            showToast('Please enter text to download', 'error');
            return;
        }

        if (!navigator.onLine) {
            showToast('You are offline. Downloading text script instead of MP3...', 'warning');
            const blob = new Blob([fullText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `VoxWave_Script_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            return;
        }

        showToast('Generating MP3 audio... Please wait.', 'info');
        elements.downloadBtn.disabled = true;
        elements.downloadBtn.style.opacity = '0.5';

        try {
            // We use StreamElements TTS API (Amazon Polly) as a free fallback for MP3 downloads
            // because browser native SpeechSynthesis cannot be exported to audio files natively.
            const voice = 'Brian'; // Default high-quality English voice
            
            // Split text into chunks to avoid API limits (max ~500 chars)
            const words = fullText.split(' ');
            const chunks = [];
            let currentChunk = '';
            
            for (const word of words) {
                if (currentChunk.length + word.length > 400) {
                    chunks.push(currentChunk);
                    currentChunk = word + ' ';
                } else {
                    currentChunk += word + ' ';
                }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());

            const audioBlobs = [];
            
            for (let i = 0; i < chunks.length; i++) {
                const textChunk = encodeURIComponent(chunks[i]);
                const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${textChunk}`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch audio chunk');
                
                const blob = await response.blob();
                audioBlobs.push(blob);
                
                // Small delay to prevent rate-limiting
                if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 300));
            }

            // Concatenate all MP3 blobs
            const finalBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
            const url = URL.createObjectURL(finalBlob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `VoxWave_Audio_${Date.now()}.mp3`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            showToast('MP3 downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            showToast('Failed to generate MP3. Network error or text too long.', 'error');
        } finally {
            elements.downloadBtn.disabled = false;
            elements.downloadBtn.style.opacity = '1';
        }
    }

    // ─── History ───
    function addToHistory(text) {
        const entry = {
            id: Date.now(),
            text: text.substring(0, 200),
            fullText: text,
            timestamp: new Date().toISOString(),
            voice: elements.voiceSelect.options[elements.voiceSelect.selectedIndex]?.textContent || 'Default',
        };

        // Avoid duplicate consecutive entries
        if (state.history.length > 0 && state.history[0].text === entry.text) return;

        state.history.unshift(entry);
        if (state.history.length > 20) state.history.pop(); // Keep last 20

        localStorage.setItem('voxwave-history', JSON.stringify(state.history));
        renderHistory();
    }

    function renderHistory() {
        const list = elements.historyList;

        if (state.history.length === 0) {
            list.innerHTML = `
                <div class="history-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p>No history yet. Start speaking to build your history.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = state.history.map(entry => `
            <div class="history-item" data-id="${entry.id}">
                <div class="history-item-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 3 20 12 6 21 6 3"/>
                    </svg>
                </div>
                <div class="history-item-content">
                    <div class="history-item-text">${escapeHTML(entry.text)}</div>
                    <div class="history-item-meta">${formatTime(entry.timestamp)} &middot; ${escapeHTML(entry.voice)}</div>
                </div>
                <button class="history-item-delete" data-delete-id="${entry.id}" title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Bind clicks
        list.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking delete button
                if (e.target.closest('.history-item-delete')) return;
                const id = parseInt(item.dataset.id);
                const entry = state.history.find(h => h.id === id);
                if (entry) {
                    elements.textInput.value = entry.fullText || entry.text;
                    updateCharCount();
                    startSpeaking();
                }
            });
        });

        list.querySelectorAll('.history-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.deleteId);
                state.history = state.history.filter(h => h.id !== id);
                localStorage.setItem('voxwave-history', JSON.stringify(state.history));
                renderHistory();
                showToast('History item removed', 'success');
            });
        });
    }

    function clearHistory() {
        state.history = [];
        localStorage.setItem('voxwave-history', '[]');
        renderHistory();
        showToast('History cleared', 'success');
    }

    // ─── Toast ───
    function showToast(message, type = 'info') {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'error'
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        toast.innerHTML = `${icon} ${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ─── Utilities ───
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // ─── Boot ───
    document.addEventListener('DOMContentLoaded', init);
})();
