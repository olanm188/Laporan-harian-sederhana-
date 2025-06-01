let laporanList = JSON.parse(localStorage.getItem("laporanHarian")) || [];
const daftar = document.getElementById("daftarLaporan");

// Tampilkan laporan saat halaman dimuat
window.addEventListener("DOMContentLoaded", tampilkanLaporan);

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

    const tombolContainer = document.createElement("div");
    tombolContainer.style.display = "flex";
    tombolContainer.style.gap = "10px";
    tombolContainer.style.marginTop = "10px";

    const btnSalin = document.createElement("button");
    btnSalin.textContent = "Salin Teks";
    btnSalin.onclick = () => {
      navigator.clipboard.writeText(teksLaporan)
        .then(() => alert("Teks berhasil disalin!"))
        .catch(() => alert("Gagal menyalin teks."));
    };

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.onclick = () => {
      if (confirm("Yakin ingin menghapus item ini?")) {
        laporanList.splice(index, 1);
        localStorage.setItem("laporanHarian", JSON.stringify(laporanList));
        tampilkanLaporan();
      }
    };

    const tombolEdit = document.createElement("button");
    tombolEdit.textContent = "Edit";
    tombolEdit.onclick = () => {
      isiFormUntukEdit(index);
    };

    tombolContainer.appendChild(btnSalin);
    tombolContainer.appendChild(tombolEdit);
    tombolContainer.appendChild(tombolHapus);

    item.appendChild(tombolContainer);
    daftar.appendChild(item);
  });
}

let indexEdit = null;

document.getElementById("formAktivitas").addEventListener("submit", function (e) {
  e.preventDefault();

  const namaKapal = document.getElementById("namaKapal").value.trim();
  const jenisPekerjaan = document.getElementById("jenisPekerjaan").value.trim();
  const titikKerja = document.getElementById("titikKerja").value.trim();
  const dariSubcon = document.getElementById("dariSubcon").value.trim();
  const jumlahPekerja = document.getElementById("jumlahPekerja").value.trim();
  const gambarFile = document.getElementById("uploadGambar").files[0];

  const errorList = [];

  if (!namaKapal) errorList.push("Nama Kapal");
  if (!jenisPekerjaan) errorList.push("Jenis Pekerjaan");
  if (!titikKerja) errorList.push("Titik Kerja");
  if (!dariSubcon) errorList.push("Dari Subcon");
  if (!jumlahPekerja) errorList.push("Jumlah Pekerja");

  if (indexEdit === null && !gambarFile) errorList.push("Upload Foto");

  if (errorList.length > 0) {
    alert("Mohon lengkapi data berikut sebelum mengirim:\n- " + errorList.join("\n- "));
    return;
  }

  const sekarang = new Date();
  const hari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(sekarang);
  const tanggal = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(sekarang);
  const formatTanggal = `${hari.charAt(0).toUpperCase() + hari.slice(1)} / ${tanggal}`;
  const jam = `${sekarang.getHours().toString().padStart(2, '0')}.${sekarang.getMinutes().toString().padStart(2, '0')} WIB`;

  const simpanLaporan = (gambarBase64) => {
    const dataLaporan = {
      tanggal: formatTanggal,
      jam,
      namaKapal,
      jenisPekerjaan,
      titikKerja,
      dariSubcon,
      jumlahPekerja,
      gambar: gambarBase64
    };

    if (indexEdit !== null) {
      laporanList[indexEdit] = { ...laporanList[indexEdit], ...dataLaporan };
      indexEdit = null;
    } else {
      laporanList.push(dataLaporan);
    }

    localStorage.setItem("laporanHarian", JSON.stringify(laporanList));
    tampilkanLaporan();
    document.getElementById("formAktivitas").reset();
  };

  if (gambarFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      simpanLaporan(event.target.result);
    };
    reader.readAsDataURL(gambarFile);
  } else {
    simpanLaporan(laporanList[indexEdit].gambar);
  }
});

function isiFormUntukEdit(index) {
  const laporan = laporanList[index];
  document.getElementById("namaKapal").value = laporan.namaKapal;
  document.getElementById("jenisPekerjaan").value = laporan.jenisPekerjaan;
  document.getElementById("titikKerja").value = laporan.titikKerja;
  document.getElementById("dariSubcon").value = laporan.dariSubcon;
  document.getElementById("jumlahPekerja").value = laporan.jumlahPekerja;

  indexEdit = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
