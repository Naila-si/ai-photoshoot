import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ImagePlus, Sparkles, Download, Moon, Sun, WandSparkles, RefreshCw, X } from 'lucide-react'
import { categories } from './data/themes'
import { checkApi, requestPhotoshoot } from './lib/api'

export default function App() {
  const [uiTheme, setUiTheme] = useState(() => localStorage.getItem('ui-theme') || 'dark')
  const [style, setStyle] = useState('studio')
  const [categoryId, setCategoryId] = useState('space')
  const [selectedTheme, setSelectedTheme] = useState('Astronaut')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [status, setStatus] = useState('Siap membuat konsep photoshoot ✨')
  const [busy, setBusy] = useState(false)
  const [apiStatus, setApiStatus] = useState('Memeriksa backend…')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [facingMode, setFacingMode] = useState('user')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const category = useMemo(() => categories.find(c => c.id === categoryId), [categoryId])

  useEffect(() => {
    document.documentElement.dataset.theme = uiTheme
    localStorage.setItem('ui-theme', uiTheme)
  }, [uiTheme])

  useEffect(() => {
    checkApi().then(() => setApiStatus('Backend terhubung'))
      .catch(() => setApiStatus('Backend belum dijalankan'))
  }, [])

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraOpen, facingMode])

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
  }, [])

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  async function startCamera(mode = facingMode) {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Browser ini tidak mendukung akses kamera.')
      return
    }
    streamRef.current?.getTracks().forEach(track => track.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      })
      streamRef.current = stream
      setFacingMode(mode)
      setCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStatus('Kamera aktif. Posisikan wajah lalu tekan Ambil Foto.')
    } catch (error) {
      setCameraOpen(false)
      if (error?.name === 'NotAllowedError') {
        setStatus('Izin kamera ditolak. Izinkan akses kamera di browser.')
      } else {
        setStatus('Kamera tidak ditemukan atau sedang dipakai aplikasi lain.')
      }
    }
  }

  function switchCamera() {
    const nextMode = facingMode === 'user' ? 'environment' : 'user'
    startCamera(nextMode)
  }

  function capturePhoto() {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setStatus('Kamera belum siap, tunggu sebentar lalu coba lagi.')
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (!blob) {
        setStatus('Gagal mengambil gambar dari kamera.')
        return
      }
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
      stopCamera()
      handlePhoto(file)
    }, 'image/jpeg', 0.92)
  }

  function handlePhoto(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus('Pilih file gambar seperti JPG, PNG, atau WEBP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus('Ukuran foto maksimal 10 MB.')
      return
    }
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
    setStatus('Foto berhasil dipilih. Periksa preview sebelum melanjutkan.')
  }

  async function handleGenerate() {
    if (!photo) {
      setStatus('Upload foto terlebih dahulu ya.')
      return
    }
    setBusy(true)
    setStatus('Mengirim permintaan ke backend…')
    try {
      const form = new FormData()
      form.append('photo', photo)
      form.append('style', style)
      form.append('theme', selectedTheme)
      form.append('category', category.name)
      const result = await requestPhotoshoot(form)
      setStatus(result.message || 'Permintaan diterima backend.')
    } catch (error) {
      setStatus(`${error.message}. Pastikan Laravel sudah dijalankan.`)
    } finally {
      setBusy(false)
    }
  }

  function downloadOriginal() {
    if (!preview) return
    const link = document.createElement('a')
    link.href = preview
    link.download = photo?.name || 'foto-saya'
    link.click()
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark"><WandSparkles size={19}/></span> photoshoot<span> studio</span></a>
        <div className="top-actions">
          <span className="api-pill"><i/> {apiStatus}</span>
          <button className="icon-button" onClick={() => setUiTheme(uiTheme === 'dark' ? 'light' : 'dark')} title="Ganti tampilan">
            {uiTheme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={14}/> YOUR PERSONAL AI PHOTO STUDIO</div>
        <h1>Imagine it.<br/><span>Then become it.</span></h1>
        <p>Ubah ide photoshoot menjadi konsep visual yang kamu impikan.</p>
      </section>

      <section className="workspace">
        <div className="panel upload-panel">
          <div className="section-heading"><div><span className="step">01</span><h2>Upload your photo</h2></div><span className="muted">JPG, PNG, WEBP · maks. 10 MB</span></div>
          {cameraOpen ? (
            <div className="camera-box">
              <video ref={videoRef} autoPlay playsInline muted className={facingMode === 'user' ? 'mirrored' : ''} />
              <div className="camera-controls">
                <button type="button" className="secondary-button" onClick={switchCamera} title="Ganti kamera">
                  <RefreshCw size={15}/> Ganti kamera
                </button>
                <button type="button" className="capture-button" onClick={capturePhoto}>
                  <Camera size={16}/> Ambil Foto
                </button>
                <button type="button" className="secondary-button" onClick={stopCamera} title="Tutup kamera">
                  <X size={15}/> Tutup
                </button>
              </div>
            </div>
          ) : (
            <label className={`dropzone ${preview ? 'has-image' : ''}`}>
              {preview ? <img src={preview} alt="Preview foto yang dipilih"/> : <div className="upload-placeholder"><span className="upload-icon"><ImagePlus size={25}/></span><strong>Letakkan foto di sini</strong><span>atau klik untuk memilih dari perangkat</span><small><Camera size={14}/> Foto wajah terlihat jelas disarankan</small></div>}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => handlePhoto(e.target.files?.[0])}/>
            </label>
          )}
          <div className="upload-actions">
            {!cameraOpen && (
              <button type="button" className="secondary-button" onClick={() => startCamera()}>
                <Camera size={15}/> {preview ? 'Foto ulang pakai kamera' : 'Ambil foto langsung'}
              </button>
            )}
            {preview && !cameraOpen && (
              <button type="button" className="text-button" onClick={() => { setPhoto(null); setPreview(''); }}>
                Hapus foto dan pilih ulang
              </button>
            )}
          </div>
          <p className="privacy-note">🔒 Foto hanya digunakan untuk proses yang kamu minta. Hindari memakai foto orang lain tanpa izin.</p>
        </div>

        <div className="panel options-panel">
          <div className="section-heading"><div><span className="step">02</span><h2>Choose your style</h2></div></div>
          <div className="style-grid">
            <button className={`style-card ${style === 'studio' ? 'active' : ''}`} onClick={() => setStyle('studio')}><span>📸</span><strong>Studio Photoshoot</strong><small>Clean, polished, professional</small></button>
            <button className={`style-card ${style === 'creative' ? 'active' : ''}`} onClick={() => setStyle('creative')}><span>🎨</span><strong>Creative Photoshoot</strong><small>Artistic, dreamy, expressive</small></button>
          </div>

          <div className="section-heading theme-heading"><div><span className="step">03</span><h2>Pick a theme</h2></div></div>
          <div className="category-list">
            {categories.map(item => <button key={item.id} className={`category-chip ${categoryId === item.id ? 'selected' : ''}`} onClick={() => { setCategoryId(item.id); setSelectedTheme(item.themes[0]); }}><span>{item.emoji}</span>{item.name}</button>)}
          </div>
          <label className="field-label" htmlFor="theme-select">Photoshoot concept</label>
          <select id="theme-select" value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
            {category.themes.map(theme => <option key={theme}>{theme}</option>)}
          </select>

          <button className="generate-button" onClick={handleGenerate} disabled={busy}>
            <Sparkles size={18}/> {busy ? 'Mengirim…' : 'Create my photoshoot'}
          </button>
          <p className="status-message" role="status">{status}</p>
        </div>
      </section>

      <section className="result-panel panel">
        <div className="section-heading"><div><span className="step">04</span><h2>Your preview</h2></div></div>
        <div className="result-content">
          {preview ? <><img className="result-preview" src={preview} alt="Preview foto asli"/><div><strong>Foto pilihanmu</strong><p className="muted">Ini masih preview foto asli. Hasil AI akan tampil di area ini setelah engine AI dihubungkan.</p><button className="secondary-button" onClick={downloadOriginal}><Download size={16}/> Download foto asli</button></div></> : <div className="empty-result"><Sparkles size={25}/><strong>Your next favorite photo starts here</strong><span>Upload foto untuk melihat preview.</span></div>}
        </div>
      </section>
      <footer>Made for your imagination <span>✦</span> AI Photoshoot Studio</footer>
    </main>
  )
}
