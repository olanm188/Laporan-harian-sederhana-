// Ambil data dari localStorage saat No dimuat
let laporanList = JSON.parse(localStorage.getItem("laporanHarian")) || [];
const daftar = document.getElementById("daftarLaporan");

// Tampilkan laporan saat halaman dimuat
window.addEventListener("DOMContentLoaded", tampilkanLaporan);

// Fungsi untuk menampilkan semua laporan
function tampilkanLaporan() {
  daftar.innerHTML = "";
  laporanList.forEach((laporan, index) => {
    const item = document.createElement("li");
    item.style.marginBottom = "20px";

    const teksLaporan = `

Waktu: ${laporan.tanggal}
Jam Upload: ${laporan.jam}
Nama Kapal: ${laporan.namaKapal}
Jenis Pekerjaan: ${laporan.jenisPekerjaan}
Titik Kerja: ${laporan.titikKerja}
Dari Subcon: ${laporan.dariSubcon}
Jumlah Pekerja: ${laporan.jumlahPekerja}
    `.trim();

    item.innerHTML = `
      
      <strong>Waktu:</strong> ${laporan.tanggal}<br/>
      <strong>Jam Upload:</strong> ${laporan.jam}<br/>
      <strong>Nama Kapal:</strong> ${laporan.namaKapal}<br/>
      <strong>Jenis Pekerjaan:</strong> ${laporan.jenisPekerjaan}<br/>
      <strong>Titik Kerja:</strong> ${laporan.titikKerja}<br/>
      <strong>Dari Subcon:</strong> ${laporan.dariSubcon}<br/>
      <strong>Jumlah Pekerja:</strong> ${laporan.jumlahPekerja}<br/>
    `;

    // Tambahkan gambar jika ada
    if (laporan.gambar) {
      const img = document.createElement("img");
      img.src = laporan.gambar;
      img.style.maxWidth = "200px";
      img.style.display = "block";
      img.style.marginTop = "10px";
      item.appendChild(img);
    }

    // Bungkus tombol dalam satu container flex
    const tombolContainer = document.createElement("div");
    tombolContainer.style.display = "flex";
    tombolContainer.style.gap = "10px";
    tombolContainer.style.marginTop = "10px";

    // Tombol Salin
    const btnSalin = document.createElement("button");
    btnSalin.textContent = "Salin Teks";
    btnSalin.onclick = function () {
      navigator.clipboard.writeText(teksLaporan)
        .then(() => alert("Teks berhasil disalin!"))
        .catch(() => alert("Gagal menyalin teks."));
    };

    // Tombol Hapus
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.onclick = function () {
      if (confirm("Yakin ingin menghapus item ini?")) {
        laporanList.splice(index, 1);
        localStorage.setItem("laporanHarian", JSON.stringify(laporanList));
        tampilkanLaporan();
      }
    };

    // Tambahkan tombol ke dalam container
    tombolContainer.appendChild(btnSalin);
    tombolContainer.appendChild(tombolHapus);

    // Tambahkan container ke item
    item.appendChild(tombolContainer);
    daftar.appendChild(item);
  });
}


// Event submit form
document.getElementById("formAktivitas").addEventListener("submit", function (e) {
  e.preventDefault();

  const namaKapal = document.getElementById("namaKapal").value;
  const jenisPekerjaan = document.getElementById("jenisPekerjaan").value;
  const titikKerja = document.getElementById("titikKerja").value;
  const dariSubcon = document.getElementById("dariSubcon").value;
  const jumlahPekerja = document.getElementById("jumlahPekerja").value;
  const gambarFile = document.getElementById("uploadGambar").files[0];

  // Format tanggal dan jam
  const sekarang = new Date();
  const hari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(sekarang);
  const tanggal = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(sekarang);
  const formatTanggal = `${hari.charAt(0).toUpperCase() + hari.slice(1)} / ${tanggal}`;
  const jam = sekarang.toLocaleTimeString("id-ID", {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const tambahLaporan = (gambarBase64) => {
    const dataBaru = {
      tanggal: formatTanggal,
      jam,
      namaKapal,
      jenisPekerjaan,
      titikKerja,
      dariSubcon,
      jumlahPekerja,
      gambar: gambarBase64 || null
    };

    laporanList.push(dataBaru);
    localStorage.setItem("laporanHarian", JSON.stringify(laporanList));
    tampilkanLaporan();
    document.getElementById("formAktivitas").reset();
  };

  if (gambarFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      tambahLaporan(event.target.result);
    };
    reader.readAsDataURL(gambarFile);
  } else {
    tambahLaporan(null);
  }
});
