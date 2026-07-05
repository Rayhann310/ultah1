document.addEventListener('DOMContentLoaded', () => {

    // ====== ELEMENTS ======
    const section1     = document.getElementById('section1');
    const section2     = document.getElementById('section2');
    const section3     = document.getElementById('section3');

    const openGiftBtn  = document.getElementById('openGiftBtn');
    const nextBtn      = document.getElementById('nextBtn');
    const ageCounter   = document.getElementById('ageCounter');
    const ageText      = document.getElementById('ageText');
    const displayAge   = document.getElementById('displayAge');

    const bgMusic      = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const introOverlay = document.getElementById('introOverlay');
    const introText    = document.getElementById('introText');

    let isPlaying = false;
    let heartsInterval = null;

    // ====== INTRO OVERLAY: Layar Hitam 3 Detik ======
    const introMessages = ['Sebentar...', 'Ada kejutan nih...', 'Siap-siap ya sayang...'];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
        msgIdx++;
        if (msgIdx < introMessages.length) {
            introText.style.opacity = 0;
            setTimeout(() => {
                introText.textContent = introMessages[msgIdx];
                introText.style.transition = 'opacity 0.5s';
                introText.style.opacity = 1;
            }, 400);
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(msgInterval);
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            section1.style.opacity       = '1';
            section1.style.pointerEvents = 'auto';
            section1.classList.add('animate__animated', 'animate__fadeIn');
        }, 1000);
    }, 3000);

    // ====== KALKULASI UMUR ======
    // Fenny lahir: 5 Juli 2002
    const birthDate = new Date('2002-07-05');
    const today     = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    displayAge.innerText = age;

    // ====== FUNGSI PINDAH HALAMAN (FULL PAGE TRANSITION) ======
    function switchPage(fromSection, toSection, exitAnim, enterAnim) {
        fromSection.classList.remove('animate__fadeIn', 'animate__slideInRight', 'animate__slideInUp', 'animate__zoomIn');
        fromSection.classList.add('animate__animated', exitAnim);

        toSection.classList.remove('d-none');
        toSection.classList.add('animate__animated', enterAnim);

        setTimeout(() => {
            fromSection.classList.add('d-none');
            fromSection.classList.remove('animate__animated', exitAnim);
        }, 800);
    }

    // ====== FUNGSI FLOATING HEARTS (HUJAN HATI) ======
    function startFloatingHearts() {
        const icons = ['fa-heart', 'fa-star', 'fa-music'];
        heartsInterval = setInterval(() => {
            const heart = document.createElement('i');
            // Random antara ikon hati, bintang, dan musik
            const icon = icons[Math.floor(Math.random() * icons.length)];
            heart.className = `fa-solid ${icon} floating-heart`;
            heart.style.left = (Math.random() * 100) + 'vw';
            heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
            heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
            // Warna random romantis
            const colors = ['#e84393', '#ff758c', '#fd79a8', '#f1c40f', '#c471f5'];
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 8000);
        }, 350);
    }

    // ====== EVENT: BUKA KADO (Halaman 1 → Halaman 2) ======
    openGiftBtn.addEventListener('click', () => {
        // Coba putar musik langsung
        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicControl) musicControl.innerHTML = '<i class="fa-solid fa-pause"></i> Jeda Musik';
        }).catch(e => console.log("Autoplay diblokir browser, user harus tap tombol musik.", e));

        // Ganti halaman: 1 → 2 (slide naik)
        switchPage(section1, section2, 'animate__slideOutUp', 'animate__slideInUp');

        // Jalankan GSAP count-up setelah halaman 2 siap
        setTimeout(() => {
            const target = { val: 0 };
            gsap.to(target, {
                val: age,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: function () {
                    ageCounter.innerText = Math.ceil(target.val);
                },
                onComplete: function () {
                    // Efek detak pada angka
                    ageCounter.classList.add('animate__animated', 'animate__heartBeat');

                    // Ledakan confetti
                    confetti({
                        particleCount: 280,
                        spread: 130,
                        origin: { y: 0.6 },
                        colors: ['#ff758c', '#ff7eb3', '#fbc2eb', '#f1c40f', '#e84393', '#c471f5']
                    });
                    // Confetti kedua sedikit delay, dari sisi kiri & kanan
                    setTimeout(() => {
                        confetti({ angle: 60,  spread: 60, particleCount: 100, origin: { x: 0, y: 0.8 } });
                        confetti({ angle: 120, spread: 60, particleCount: 100, origin: { x: 1, y: 0.8 } });
                    }, 400);

                    // Tampilkan teks + tombol lanjut
                    setTimeout(() => {
                        ageText.classList.remove('d-none');
                        ageText.classList.add('animate__animated', 'animate__fadeIn');
                        nextBtn.classList.remove('d-none');
                    }, 600);
                }
            });
        }, 900);
    });

    // ====== EVENT: TOMBOL LANJUT (Halaman 2 → Halaman 3) ======
    nextBtn.addEventListener('click', () => {
        switchPage(section2, section3, 'animate__slideOutLeft', 'animate__slideInRight');
        // Mulai hujan hati setelah halaman foto & pesan muncul
        setTimeout(() => startFloatingHearts(), 900);
    });

    // ====== EVENT: KONTROL MUSIK ======
    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicControl.innerHTML = '<i class="fa-solid fa-play"></i> Putar Musik';
            musicControl.classList.replace('btn-danger', 'btn-outline-danger');
        } else {
            bgMusic.play();
            isPlaying = true;
            musicControl.innerHTML = '<i class="fa-solid fa-pause"></i> Jeda Musik';
            musicControl.classList.replace('btn-outline-danger', 'btn-danger');
        }
    });
});
