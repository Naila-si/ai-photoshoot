# AI Photoshoot Studio — Starter Project

Project awal untuk aplikasi AI Photoshoot Studio:
- Frontend: React + Vite
- Backend: Laravel REST API (source overlay)
- Database: MySQL (migration awal)
- AI: integrasi Qwen/ComfyUI disiapkan sebagai tahap berikutnya

> Catatan penting: fitur AI belum pura-pura aktif. Model image-generation dan metode face identity belum dipilih, jadi tombol generate saat ini memberi status bahwa backend AI perlu dikonfigurasi. Upload dan preview foto sudah bisa dicoba.

## 1. Kebutuhan
- Node.js 20.19+ atau 22.12+
- PHP 8.2+
- Composer
- MySQL
- VS Code

## 2. Jalankan frontend
Buka PowerShell di folder `frontend`:

```powershell
npm install
npm run dev
```

Buka URL yang muncul (biasanya http://localhost:5173).

## 3. Siapkan Laravel backend
Di folder utama project, jalankan:

```powershell
composer create-project laravel/laravel backend
```

Setelah selesai, salin isi folder `backend-overlay` ke folder `backend` sesuai struktur (gabungkan folder `app`, `routes`, dan `database`; jangan hapus file bawaan Laravel).

Lalu:

```powershell
cd backend
php artisan key:generate
```

Buat database MySQL bernama `ai_photoshoot_studio`, lalu atur `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_photoshoot_studio
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan:

```powershell
php artisan migrate
php artisan serve
```

API berjalan di http://127.0.0.1:8000.

## 4. Hubungkan frontend ke API
Frontend memakai `VITE_API_BASE_URL`. Buat file `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Restart `npm run dev` setelah mengubah `.env`.

## 5. Batasan versi starter
- Upload/preview foto berjalan di browser.
- Daftar kategori dan tema awal berasal dari data frontend.
- Backend menyediakan endpoint status layanan dan endpoint pembuatan photoshoot dasar.
- Belum ada proses AI image generation, face identity, login, pembayaran, atau penyimpanan foto permanen.
- Jangan unggah foto pribadi ke server publik sebelum autentikasi, otorisasi, dan kebijakan penghapusan data selesai dibuat.

## 6. Struktur
```text
AI-Photoshoot-Studio/
├── frontend/
├── backend-overlay/
├── ai-engine/
└── README.md
```
