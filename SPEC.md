# PK ONLINE - Dashboard Notepad

## Concept & Vision

Dashboard notepad interaktif dengan nuansa cyberpunk/hacker bergaya hijau glowing yang memberikan kesan "matrix" dan futuristic. Animasi laser yang mengalir menciptakan atmosfer teknologi tinggi, sementara interface yang bersih memastikan usability tetap optimal.

## Design Language

### Aesthetic Direction
- **Theme**: Cyberpunk Hacker Green Glow - terinspirasi dari estetika Matrix dan terminal hacking
- **Mood**: Futuristik, teknologi tinggi, energik dengan sentuhan misterius

### Color Palette
- **Primary**: `#00ff41` (Matrix Green)
- **Secondary**: `#008f11` (Dark Matrix Green)
- **Accent**: `#39ff14` (Neon Green)
- **Background**: `#0a0a0a` (Almost Black)
- **Surface**: `#0d1a0d` (Dark Green Tint)
- **Text Primary**: `#00ff41`
- **Text Secondary**: `#7dff7d`
- **Glow Color**: `rgba(0, 255, 65, 0.8)`

### Typography
- **Font Primary**: 'Share Tech Mono', monospace (untuk kesan terminal)
- **Font Secondary**: 'Orbitron', sans-serif (untuk heading)
- **Fallback**: 'Courier New', monospace

### Spatial System
- Base unit: 8px
- Padding: 16px (2 units), 24px (3 units)
- Border radius: 8px untuk cards, 4px untuk buttons
- Gap: 16px antar elemen

### Motion Philosophy
- **Laser Animation**: Gradient bergerak horizontal/vertikal dengan efek "sweeping laser"
- **Glow Pulse**: Efek pulsing pada elemen aktif dengan box-shadow animasi
- **Hover Effects**: Scale 1.02 dengan intensitas glow meningkat
- **Transitions**: 300ms ease-out untuk interaksi normal
- **Scanline Effect**: Overlay animasi scanline tipis untuk kesan CRT monitor

### Visual Assets
- Icons: Lucide Icons (green stroke)
- Decorative: CSS-based laser beams, grid patterns, corner accents

## Layout & Structure

### Page Structure
```
┌─────────────────────────────────────────────────┐
│  [HEADER: Logo + Title "PK ONLINE" + Actions]   │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐   │
│  │  [SEARCH BAR]                            │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │   NOTE 1   │ │   NOTE 2   │ │   NOTE 3   │   │
│  │  + Title   │ │  + Title   │ │  + Title   │   │
│  │  + Preview │ │  + Preview │ │  + Preview │   │
│  │  [Actions] │ │  [Actions] │ │  [Actions] │   │
│  └────────────┘ └────────────┘ └────────────┘   │
│                                                 │
│  [+ ADD NEW NOTE BUTTON - Full Width]          │
├─────────────────────────────────────────────────┤
│  [FOOTER: Status + Stats]                      │
└─────────────────────────────────────────────────┘
```

### Modal Structure
```
┌─────────────────────────────────────────────┐
│  MODAL: Add/Edit Note                        │
│  ┌─────────────────────────────────────────┐ │
│  │  JUDUL: [________________________]     │ │
│  │  ISI:   [________________________]     │ │
│  │         [________________________]     │ │
│  │         [________________________]     │ │
│  └─────────────────────────────────────────┘ │
│              [CANCEL]  [SAVE]                │
└─────────────────────────────────────────────┘
```

## Features & Interactions

### Core Features

1. **Tambah Note Baru**
   - Click tombol "+" atau "Tambah Note"
   - Modal form dengan field JUDUL dan ISI
   - Validasi: JUDUL wajib diisi, minimal 1 karakter
   - Simpan ke spreadsheet dengan timestamp

2. **Edit Note**
   - Click tombol edit pada card note
   - Modal form terisi dengan data existing
   - Update data di spreadsheet

3. **Hapus Note**
   - Click tombol hapus pada card note
   - Konfirmasi sebelum hapus
   - Hapus dari spreadsheet

4. **Salin Note**
   - Click tombol salin
   - Copy JUDUL dan ISI ke clipboard
   - Toast notification "Berhasil disalin!"

5. **Search/Filter**
   - Input search untuk filter berdasarkan JUDUL
   - Real-time filtering saat mengetik
   - Case insensitive

6. **Export to Spreadsheet**
   - Data tersimpan ke file CSV (PK_ONLINE.csv)
   - Sheet name: "PK ONLINE"
   - Headers: JUDUL, ISI
   - Auto-save setiap perubahan

### Interaction Details

- **Card Hover**: Scale up 1.02, glow intensitas tinggi, shadow lebih besar
- **Button Hover**: Background color shift, glow effect
- **Button Active**: Scale down 0.98, instant feedback
- **Modal Open**: Fade in + scale from 0.9 to 1, backdrop blur
- **Modal Close**: Fade out + scale to 0.9
- **Toast Notification**: Slide in from right, auto-dismiss after 3s
- **Delete Confirmation**: Red glow theme, warning icon

### Edge Cases
- Empty state: Tampilkan ilustrasi + "Belum ada note. Tambahkan note pertama!"
- Search no results: "Tidak ada note yang cocok dengan pencarian."
- Form validation error: Border merah + pesan error di bawah field
- Clipboard failure: "Gagal menyalin. Izinkan akses clipboard."

## Component Inventory

### 1. Header
- Logo/Title "PK ONLINE" dengan glow effect
- Subtitle "Dashboard Notepad"
- States: Default only

### 2. SearchBar
- Input dengan icon search
- Placeholder: "Cari note..."
- States: Default, Focus (green glow border), Filled

### 3. NoteCard
- Displays: JUDUL, ISI preview (max 100 chars), timestamp
- Action buttons: Edit (pencil), Hapus (trash), Salin (copy)
- States: Default, Hover (elevated + glow), Loading

### 4. AddButton
- Full width button dengan icon +
- Text: "Tambah Note Baru"
- States: Default, Hover (glow intensify), Active (pressed)

### 5. Modal
- Backdrop: Semi-transparent black with blur
- Card: Dark surface dengan green border glow
- Close button: X di corner
- States: Opening animation, Open, Closing animation

### 6. FormInput
- Label + Input field
- Textarea untuk ISI (auto-resize)
- States: Default, Focus (green glow), Error (red glow), Disabled

### 7. ActionButton
- Icon button dengan tooltip
- Variants: Edit (blue-green), Delete (red), Copy (green)
- States: Default, Hover, Active, Disabled

### 8. Toast
- Notification popup di corner
- Variants: Success (green), Error (red), Info (blue)
- Auto-dismiss with progress bar

### 9. ConfirmDialog
- Modal konfirmasi untuk delete
- Warning icon, message, Cancel/Confirm buttons
- Red glow theme untuk danger action

### 10. EmptyState
- Ilustrasi/icon, message text
- Call-to-action button

## Technical Approach

### Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for immediate persistence
- **Spreadsheet Export**: CSV file generation (downloadable)

### Architecture
```
/
├── index.html          # Main dashboard
├── styles.css          # All styles with CSS animations
├── app.js              # Main application logic
├── Code.gs           # Google Apps Script untuk Sheets
└── SPEC.md             # This specification
```

### Data Model
```javascript
Note {
  id: string (UUID),
  judul: string,
  isi: string,
  createdAt: ISO timestamp,
  updatedAt: ISO timestamp
}
```

### Spreadsheet Format
- File: PK_ONLINE.csv
- Encoding: UTF-8
- Delimiter: comma
- Headers: JUDUL, ISI
- Quoting: Fields containing comma enclosed in double quotes

### Google Sheets Integration
- Sheet Name: "PK ONLINE"
- Headers: JUDUL, ISI
- Connection: Via Google Apps Script Web App
- URL Configuration: Saved in localStorage

### Storage Strategy
1. Primary: LocalStorage for instant UI updates
2. Google Sheets: Optional sync via Web App URL configuration
3. Export: CSV download on demand
