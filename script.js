// ==========================================
// 1. DATA MASTER 35 SISWA TETAP
// ==========================================
const DAFTAR_SISWA = [
    { nis: '2026001', nama: 'Ahmad Fauzan', kelas: '7A' },
    { nis: '2026002', nama: 'Siti Nurhaliza', kelas: '7A' },
    { nis: '2026003', nama: 'Muhammad Rizky', kelas: '7A' },
    { nis: '2026004', nama: 'Aulia Putri', kelas: '7A' },
    { nis: '2026005', nama: 'Dimas Pratama', kelas: '7A' },
    { nis: '2026006', nama: 'Nabila Zahra', kelas: '7A' },
    { nis: '2026007', nama: 'Fajar Ramadhan', kelas: '7B' },
    { nis: '2026008', nama: 'Intan Permatasari', kelas: '7B' },
    { nis: '2026009', nama: 'Bagas Saputra', kelas: '7B' },
    { nis: '2026010', nama: 'Khairunnisa', kelas: '7B' },
    { nis: '2026011', nama: 'Rafi Akbar', kelas: '7B' },
    { nis: '2026012', nama: 'Salma Salsabila', kelas: '7B' },
    { nis: '2025013', nama: 'Budi Santoso', kelas: '8A' },
    { nis: '2025014', nama: 'Dewi Lestari', kelas: '8A' },
    { nis: '2025015', nama: 'Ilham Maulana', kelas: '8A' },
    { nis: '2025016', nama: 'Anisa Rahmawati', kelas: '8A' },
    { nis: '2025017', nama: 'Galih Prakoso', kelas: '8A' },
    { nis: '2025018', nama: 'Putri Ayuningtyas', kelas: '8A' },
    { nis: '2025019', nama: 'Rizki Hidayat', kelas: '8B' },
    { nis: '2025020', nama: 'Melati Kusuma', kelas: '8B' },
    { nis: '2025021', nama: 'Bayu Setiawan', kelas: '8B' },
    { nis: '2025022', nama: 'Fitri Handayani', kelas: '8B' },
    { nis: '2025023', nama: 'Aditya Nugraha', kelas: '8B' },
    { nis: '2025024', nama: 'Syifa Aulia', kelas: '8B' },
    { nis: '2024025', nama: 'Citra Lestari', kelas: '9A' },
    { nis: '2024026', nama: 'Hendra Wijaya', kelas: '9A' },
    { nis: '2024027', nama: 'Nadia Safitri', kelas: '9A' },
    { nis: '2024028', nama: 'Reza Pahlevi', kelas: '9A' },
    { nis: '2024029', nama: 'Dina Mariana', kelas: '9A' },
    { nis: '2024030', nama: 'Arif Budiman', kelas: '9A' },
    { nis: '2024031', nama: 'Farhan Kamil', kelas: '9B' },
    { nis: '2024032', nama: 'Tiara Andini', kelas: '9B' },
    { nis: '2024033', nama: 'Zaki Mubarak', kelas: '9B' },
    { nis: '2024034', nama: 'Rani Puspitasari', kelas: '9B' },
    { nis: '2024035', nama: 'Yoga Pratama', kelas: '9B' }
];

// ==========================================
// 2. BASIS DATA CLIENT-SIDE (LocalStorage)
// ==========================================
const DB_KEY = 'db_rekap_absensi_smp_yayasan';
let rekapDatabase = JSON.parse(localStorage.getItem(DB_KEY)) || {};

function simpanDatabase() {
    localStorage.setItem(DB_KEY, JSON.stringify(rekapDatabase));
    updateStatistik();
    renderRekapSemester();
}

// ==========================================
// 3. MANIPULASI DOM: TANGGAL & HARI OTOMATIS
// ==========================================
function formatTanggalIndonesia(dateString) {
    const [tahun, bulan, tanggal] = dateString.split('-');
    const dateObj = new Date(tahun, bulan - 1, tanggal);
    const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalLengkap = dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return { namaHari, tanggalLengkap };
}

function gantiTanggal() {
    const inputTanggal = document.getElementById('pilihTanggal').value;
    if (!inputTanggal) return;

    const { namaHari, tanggalLengkap } = formatTanggalIndonesia(inputTanggal);
    document.getElementById('tampilHari').value = namaHari;
    document.getElementById('tanggalHariIni').textContent = `Rekap Hari ${namaHari}, ${tanggalLengkap}`;

    if (!rekapDatabase[inputTanggal]) {
        rekapDatabase[inputTanggal] = {};
    }

    renderTabel();
}

// ==========================================
// 4. MANIPULASI DOM: STATISTIK & TABEL HARIAN
// ==========================================
function updateStatistik() {
    const tanggalAktif = document.getElementById('pilihTanggal').value;
    const dataHariIni = rekapDatabase[tanggalAktif] || {};

    let hadir = 0, sakit = 0, izin = 0, alpa = 0;

    DAFTAR_SISWA.forEach(siswa => {
        const status = dataHariIni[siswa.nis] || 'Belum Diisi';
        if (status === 'Hadir') hadir++;
        else if (status === 'Sakit') sakit++;
        else if (status === 'Izin') izin++;
        else if (status === 'Alpa') alpa++;
    });

    document.getElementById('statTotal').textContent = DAFTAR_SISWA.length;
    document.getElementById('statHadir').textContent = hadir;
    document.getElementById('statSakit').textContent = sakit;
    document.getElementById('statIzin').textContent = izin;
    document.getElementById('statAlpa').textContent = alpa;
}

function renderTabel() {
    const tbody = document.getElementById('tabelBody');
    const keyword = document.getElementById('cariNama').value.toLowerCase();
    const filterKelas = document.getElementById('filterKelas').value;
    const filterStatus = document.getElementById('filterStatus').value;
    const tanggalAktif = document.getElementById('pilihTanggal').value;
    const { namaHari, tanggalLengkap } = formatTanggalIndonesia(tanggalAktif);

    const dataHariIni = rekapDatabase[tanggalAktif] || {};
    tbody.innerHTML = '';

    const siswaTersaring = DAFTAR_SISWA.filter(siswa => {
        const statusSiswa = dataHariIni[siswa.nis] || 'Belum Diisi';
        const cocokNama = siswa.nama.toLowerCase().includes(keyword) || siswa.nis.toLowerCase().includes(keyword);
        const cocokKelas = filterKelas === 'Semua' || siswa.kelas === filterKelas;
        const cocokStatus = filterStatus === 'Semua' || statusSiswa === filterStatus;
        return cocokNama && cocokKelas && cocokStatus;
    });

    if (siswaTersaring.length === 0) {
        const trKosong = document.createElement('tr');
        trKosong.innerHTML = `<td colspan="7" style="text-align:center; color:#888;">Tidak ada siswa yang sesuai dengan filter.</td>`;
        tbody.appendChild(trKosong);
        updateStatistik();
        return;
    }

    siswaTersaring.forEach((siswa, index) => {
        const statusSiswa = dataHariIni[siswa.nis] || 'Belum Diisi';
        const kelasBadge = statusSiswa === 'Belum Diisi' ? 'bg-Belum' : `bg-${statusSiswa}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${siswa.nis}</td>
            <td><strong>${siswa.nama}</strong></td>
            <td>${siswa.kelas}</td>
            <td>${namaHari}, ${tanggalLengkap}</td>
            <td><span class="badge ${kelasBadge}">${statusSiswa}</span></td>
            <td>
                <select class="select-status" onchange="ubahStatus('${siswa.nis}', this.value)">
                    <option value="Belum Diisi" ${statusSiswa === 'Belum Diisi' ? 'selected' : ''}>-- Pilih Status --</option>
                    <option value="Hadir" ${statusSiswa === 'Hadir' ? 'selected' : ''}>Hadir</option>
                    <option value="Sakit" ${statusSiswa === 'Sakit' ? 'selected' : ''}>Sakit</option>
                    <option value="Izin" ${statusSiswa === 'Izin' ? 'selected' : ''}>Izin</option>
                    <option value="Alpa" ${statusSiswa === 'Alpa' ? 'selected' : ''}>Alpa</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateStatistik();
}

// ==========================================
// 5. OPERASI CRUD ABSENSI PER TANGGAL
// ==========================================
function ubahStatus(nis, statusBaru) {
    const tanggalAktif = document.getElementById('pilihTanggal').value;
    if (!rekapDatabase[tanggalAktif]) {
        rekapDatabase[tanggalAktif] = {};
    }

    if (statusBaru === 'Belum Diisi') {
        delete rekapDatabase[tanggalAktif][nis];
    } else {
        rekapDatabase[tanggalAktif][nis] = statusBaru;
    }

    simpanDatabase();
    renderTabel();
}

function hadirSemuaTanggalIni() {
    const tanggalAktif = document.getElementById('pilihTanggal').value;
    if (!rekapDatabase[tanggalAktif]) {
        rekapDatabase[tanggalAktif] = {};
    }

    DAFTAR_SISWA.forEach(siswa => {
        rekapDatabase[tanggalAktif][siswa.nis] = 'Hadir';
    });

    simpanDatabase();
    renderTabel();
}

function resetTanggalIni() {
    const tanggalAktif = document.getElementById('pilihTanggal').value;
    const { namaHari, tanggalLengkap } = formatTanggalIndonesia(tanggalAktif);

    if (confirm(`Reset semua absensi pada hari ${namaHari}, ${tanggalLengkap}?`)) {
        rekapDatabase[tanggalAktif] = {};
        simpanDatabase();
        renderTabel();
    }
}

// ==========================================
// 6. REKAP PER SEMESTER & EXPORT EXCEL MURNI (TANPA LIBRARY)
// ==========================================
function hitungDataSemester() {
    const semesterDipilih = document.getElementById('pilihSemester').value;
    const filterKelas = document.getElementById('filterKelasSemester').value;

    const daftarTanggalValid = Object.keys(rekapDatabase).filter(tgl => {
        const bulan = parseInt(tgl.split('-')[1], 10);
        if (semesterDipilih === 'Ganjil') return bulan >= 7 && bulan <= 12;
        if (semesterDipilih === 'Genap') return bulan >= 1 && bulan <= 6;
        return true;
    });

    const siswaTersaring = DAFTAR_SISWA.filter(s => filterKelas === 'Semua' || s.kelas === filterKelas);

    return siswaTersaring.map((siswa, index) => {
        let hadir = 0, sakit = 0, izin = 0, alpa = 0;

        daftarTanggalValid.forEach(tgl => {
            const status = rekapDatabase[tgl][siswa.nis];
            if (status === 'Hadir') hadir++;
            else if (status === 'Sakit') sakit++;
            else if (status === 'Izin') izin++;
            else if (status === 'Alpa') alpa++;
        });

        const totalHari = hadir + sakit + izin + alpa;
        const persentase = totalHari === 0 ? '0.0%' : ((hadir / totalHari) * 100).toFixed(1) + '%';

        return {
            no: index + 1,
            nis: siswa.nis,
            nama: siswa.nama,
            kelas: siswa.kelas,
            hadir,
            sakit,
            izin,
            alpa,
            totalHari,
            persentase
        };
    });
}

function renderRekapSemester() {
    const tbody = document.getElementById('tabelRekapSemesterBody');
    const hasilRekap = hitungDataSemester();
    tbody.innerHTML = '';

    hasilRekap.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.no}</td>
            <td>${row.nis}</td>
            <td><strong>${row.nama}</strong></td>
            <td>${row.kelas}</td>
            <td style="color:#28a745; font-weight:bold;">${row.hadir}</td>
            <td style="color:#d39e00; font-weight:bold;">${row.sakit}</td>
            <td style="color:#17a2b8; font-weight:bold;">${row.izin}</td>
            <td style="color:#dc3545; font-weight:bold;">${row.alpa}</td>
            <td><strong>${row.totalHari}</strong></td>
            <td><span class="badge bg-Hadir">${row.persentase}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Export Excel murni menggunakan Blob API & tabel HTML Excel tanpa library eksternal
function exportRekapExcelMurni() {
    const semesterDipilih = document.getElementById('pilihSemester').value;
    const filterKelas = document.getElementById('filterKelasSemester').value;
    const hasilRekap = hitungDataSemester();

    let tabelHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"></head>
        <body>
            <h3>REKAPITULASI ABSENSI SISWA PER SEMESTER - SMP YAYASAN NUSANTARA</h3>
            <p>Semester: ${semesterDipilih} | Kelas: ${filterKelas}</p>
            <table border="1">
                <thead>
                    <tr style="background-color:#1e3c72; color:white; font-weight:bold;">
                        <th>No</th>
                        <th>NIS</th>
                        <th>Nama Siswa</th>
                        <th>Kelas</th>
                        <th>Total Hadir</th>
                        <th>Total Sakit</th>
                        <th>Total Izin</th>
                        <th>Total Alpa</th>
                        <th>Total Hari Tercatat</th>
                        <th>Persentase Kehadiran</th>
                    </tr>
                </thead>
                <tbody>
    `;

    hasilRekap.forEach(r => {
        tabelHTML += `
            <tr>
                <td>${r.no}</td>
                <td>'${r.nis}</td>
                <td>${r.nama}</td>
                <td>${r.kelas}</td>
                <td>${r.hadir}</td>
                <td>${r.sakit}</td>
                <td>${r.izin}</td>
                <td>${r.alpa}</td>
                <td>${r.totalHari}</td>
                <td>${r.persentase}</td>
            </tr>
        `;
    });

    tabelHTML += `</tbody></table></body></html>`;

    const blob = new Blob([tabelHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Absensi_Semester_${semesterDipilih}_SMP_Yayasan.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==========================================
// 7. INISIALISASI SAAT HALAMAN DIBUKA
// ==========================================
function init() {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
    const tanggal = String(sekarang.getDate()).padStart(2, '0');
    const hariIniISO = `${tahun}-${bulan}-${tanggal}`;

    document.getElementById('pilihTanggal').value = hariIniISO;
    document.getElementById('pilihSemester').value = parseInt(bulan, 10) >= 7 ? 'Ganjil' : 'Genap';

    gantiTanggal();
    renderRekapSemester();
}

init();