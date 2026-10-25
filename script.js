const guest = new URLSearchParams(location.search).get('to');
if (guest) {
    document.getElementById('guest').textContent = guest;
}

document.getElementById('openBtn').addEventListener('click', () => {
    document.getElementById('cover').classList.add('hidden');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
});

const target = new Date('2026-12-12T09:00:00+08:00');

function updateCountdown() {
    const diff = Math.max(0, target - new Date());

    document.getElementById('d').textContent = Math.floor(diff / 86400000);
    document.getElementById('h').textContent = Math.floor(diff / 3600000) % 24;
    document.getElementById('m').textContent = Math.floor(diff / 60000) % 60;
    document.getElementById('s').textContent = Math.floor(diff / 1000) % 60;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const copyBtn = document.getElementById('copy');

copyBtn.addEventListener('click', async () => {
    const nomor = document.getElementById('rek').textContent.trim();

    try {
        await navigator.clipboard.writeText(nomor);
        copyBtn.textContent = 'Tersalin ✓';
    } catch {
        copyBtn.textContent = 'Gagal menyalin';
    }

    setTimeout(() => (copyBtn.textContent = 'Salin Nomor'), 2000);
});

const rsvpForm = document.getElementById('rsvpForm');
const wishesBox = document.getElementById('wishes');
const errBox = document.getElementById('err');
const jumlahEl = document.getElementById('jumlah');

let wishes = [];
try {
    wishes = JSON.parse(localStorage.getItem('wishes')) || [];
} catch {
    wishes = [];
}

function renderWishes() {
    wishesBox.replaceChildren();

    for (const w of wishes) {
        const item = document.createElement('div');
        item.className = 'wish';

        const nama = document.createElement('b');
        nama.textContent = w.nama;

        const status = document.createElement('small');
        status.textContent = w.hadir;

        item.append(nama, status);

        if (w.pesan) {
            const pesan = document.createElement('p');
            pesan.textContent = w.pesan;
            item.append(pesan);
        }

        wishesBox.append(item);
    }
}

document.getElementById('minus').addEventListener('click', () => {
    jumlahEl.textContent = Math.max(1, Number(jumlahEl.textContent) - 1);
});

document.getElementById('plus').addEventListener('click', () => {
    jumlahEl.textContent = Math.min(10, Number(jumlahEl.textContent) + 1);
});

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const hadir = document.getElementById('hadir').value;
    const jumlah = jumlahEl.textContent;
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama) {
        errBox.textContent = 'Nama wajib diisi.';
        return;
    }
    errBox.textContent = '';

    wishes.unshift({ nama, hadir, jumlah, pesan });
    try {
        localStorage.setItem('wishes', JSON.stringify(wishes));
    } catch {}
    renderWishes();

    rsvpForm.reset();
    jumlahEl.textContent = 1;
});

renderWishes();
