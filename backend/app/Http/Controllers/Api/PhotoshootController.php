<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PhotoshootController
{
    public function store(Request $request): JsonResponse
    {
        // Validasi dasar file. Penyimpanan permanen dan pipeline AI ditambahkan
        // setelah autentikasi, izin pemrosesan foto, serta model AI diputuskan.
        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'style' => ['required', 'in:studio,creative'],
            'theme' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
        ]);

        return response()->json([
            'status' => 'accepted',
            'message' => 'Permintaan diterima. Engine AI belum dikonfigurasi.',
            'selected_theme' => $validated['theme'],
        ], 202);
    }
}
