// Ambil data laporan dari localStorage (jika ada)
let laporanList = JSON.parse(localStorage.getItem('laporanHarian')) || [];

const daftar = document.getElementById('daftarLaporan');
const btnSimpan = document.getElementById('btnSimpan');

const namaKapal = document.getElementById('namaKapal');
const jenisPekerjaan = document.getElementById('jenisPekerjaan');
const titikKerja = document.getElementById('titikKerja');
const dariSubcon = document.getElementById('dariSubcon');
const jumlahPekerja = document.getElementById('jumlahPekerja');

function tampilkanLaporan() {
  daftar.innerHTML = '';

  laporanList.forEach((laporan, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      [${laporan.tanggal}]<br/>
      Aktivitas Kerja:<br/>
      - Nama Kapal: <strong>${laporan.aktivitas.namaKapal}</strong> <br/>
      - Jenis Pekerjaan: <strong>${laporan.aktivitas.jenisPekerjaan}</strong> <br/>
      - Titik Kerja: <strong>${laporan.aktivitas.titikKerja}</strong> <br/>
      - Dari Subcon: <strong>${laporan.aktivitas.dariSubcon}</strong> <br/>
      - Jumlah Pekerja dari Subcon: <strong>${laporan.aktivitas.jumlahPekerja}</strong>
    `;

    const btnHapus = document.createElement('button');
    btnHapus.textContent = 'Hapus';
    btnHapus.className = 'delete-btn';
    btnHapus.onclick = () => hapusLaporan(index);

    li.appendChild(btnHapus);
    daftar.appendChild(li);
  });
}


function tambahLaporan() {
  if (
    !namaKapal.value.trim() ||
    !jenisPekerjaan.value.trim() ||
    !titikKerja.value.trim() ||
    !dariSubcon.value.trim() ||
    !jumlahPekerja.value.trim()
  ) {
    alert('Mohon isi semua data aktivitas kerja dengan benar!');
    return;
  }

  const laporanBaru = {
    tanggal: new Date().toLocaleDateString('id-ID'),
    aktivitas: {
      namaKapal: namaKapal.value.trim(),
      jenisPekerjaan: jenisPekerjaan.value.trim(),
      titikKerja: titikKerja.value.trim(),
      dariSubcon: dariSubcon.value.trim(),
      jumlahPekerja: jumlahPekerja.value.trim(),
    },
  };

  laporanList.push(laporanBaru);
  localStorage.setItem('laporanHarian', JSON.stringify(laporanList));

  // Reset form
  namaKapal.value = '';
  jenisPekerjaan.value = '';
  titikKerja.value = '';
  dariSubcon.value = '';
  jumlahPekerja.value = '';

  tampilkanLaporan();
}


function hapusLaporan(index) {
  if (confirm('Yakin ingin menghapus laporan ini?')) {
    laporanList.splice(index, 1);
    localStorage.setItem('laporanHarian', JSON.stringify(laporanList));
    tampilkanLaporan();
  }
}

btnSimpan.addEventListener('click', tambahLaporan);

tampilkanLaporan();
