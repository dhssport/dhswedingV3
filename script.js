document.addEventListener('DOMContentLoaded', () => {

    // --- Parse URL Params for Guest Name ---
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || "Tamu Undangan";
    document.getElementById('guest-name-display').innerText = guestName;

    // --- Opening Gate Logic ---
    window.openInvitation = () => {
        const cover = document.getElementById('opening-cover');
        const musicBtn = document.getElementById('music-btn');
        const bgMusic = document.getElementById('bg-music');

        // 1. Animate Cover
        cover.classList.add('open');

        // 2. Unlock Scroll
        document.body.classList.remove('scroll-locked');
        document.body.classList.add('scroll-unlocked');

        // 3. Play Music
        bgMusic.play().then(() => {
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.classList.add('music-playing');
            window.isPlaying = true;
        }).catch(e => console.log("Audio autoplay prevented"));

        // 4. Trigger Animations for Hero
        setTimeout(() => {
            document.querySelector('#hero .reveal').classList.add('active');
        }, 500);
    };

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // --- Reveal Animations on Scroll (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed if you only want it to happen once
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px"
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // --- Countdown Timer ---
    const weddingDate = new Date();
    weddingDate.setMonth(weddingDate.getMonth() + 1);
    weddingDate.setHours(9, 0, 0);

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "The Big Day Has Arrived!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Music Player ---
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    window.isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (window.isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicBtn.classList.remove('music-playing');
        } else {
            bgMusic.play();
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.classList.add('music-playing');
        }
        window.isPlaying = !window.isPlaying;
    });

    // --- Google Maps Modal ---
    const mapModal = document.getElementById('map-modal');
    const openMapBtn = document.getElementById('open-map-btn');
    const closeMapBtn = document.getElementById('close-map-btn');

    if (openMapBtn) {
        openMapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mapModal.classList.add('open');
        });
    }

    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.remove('open');
        });
    }

    if (mapModal) {
        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                mapModal.classList.remove('open');
            }
        });
    }

    // --- Copy to Clipboard ---
    window.copyToClipboard = (text, elementId) => {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(elementId);
            const originalText = btn.innerHTML; // Store HTML (icon)
            btn.innerText = "Tersalin!";
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // --- RSVP & Wishes to WhatsApp ---
    window.sendRSVP = (status) => {
        const phoneNumber = "6281234567890";
        const message = `Halo DHS Wedding, saya ${status} hadir di pernikahan kalian. Terima kasih!`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    window.sendWish = () => {
        const name = document.getElementById('guest-name').value;
        const wish = document.getElementById('guest-wish').value;

        if (!name || !wish) {
            alert("Mohon isi nama dan ucapan Anda.");
            return;
        }

        const wishes = JSON.parse(localStorage.getItem('dhs_wishes') || '[]');
        wishes.push({ name, wish, date: new Date().toISOString() });
        localStorage.setItem('dhs_wishes', JSON.stringify(wishes));

        const phoneNumber = "6281234567890";
        const message = `Ucapan dari ${name}: ${wish}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        document.getElementById('guest-name').value = '';
        document.getElementById('guest-wish').value = '';
    }

});
