const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export async function checkApi() {
  const response = await fetch(`${API_BASE}/health`)
  if (!response.ok) throw new Error('Backend belum dapat dihubungi')
  return response.json()
}

export async function requestPhotoshoot(formData) {
  const response = await fetch(`${API_BASE}/photoshoots`, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Gagal mengirim permintaan')
  return data
}
