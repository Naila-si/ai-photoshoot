# AI Engine (belum dikonfigurasi)

Folder ini disiapkan untuk workflow ComfyUI dan prompt service LM Studio.

Rencana alur:
1. Laravel menerima dan memvalidasi foto.
2. Laravel membuat job antrean.
3. Prompt service (Qwen di LM Studio) menyusun prompt sesuai tema.
4. ComfyUI menjalankan workflow image generation + metode identity preservation yang sudah diuji.
5. Laravel menyimpan hasil dan memperbarui status photoshoot.

Jangan isi endpoint atau model secara asal. Versi Qwen, model gambar, workflow ComfyUI, dan metode menjaga identitas wajah perlu dipastikan lebih dulu.
