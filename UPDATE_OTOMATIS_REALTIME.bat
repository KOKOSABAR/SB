@echo off
title AUTOMATIC LOTTERY UPDATER BOT
echo.
echo ==================================================
echo       BOT UPDATE OTOMATIS HASIL TOGEL LIVE
echo ==================================================
echo.
echo Bot ini akan berjalan di latar belakang dan menarik
echo data terbaru dari WDBOS setiap 5 menit.
echo.
echo JANGAN TUTUP JENDELA INI AGAR DATA TETAP REALTIME.
echo.
echo ==================================================
echo.

:loop
echo [%time%] Memulai sinkronisasi data ke WDBOS...
node scrape_lottery.js
echo.
echo [%time%] ✅ Sinkronisasi Berhasil.
echo Menunggu 5 menit untuk jadwal update berikutnya...
echo (Tekan Ctrl+C untuk berhenti)
echo.
timeout /t 300 /nobreak
goto loop
