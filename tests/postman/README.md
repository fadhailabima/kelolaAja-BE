## KelolaAja Landing API Tests

Koleksi Postman di folder ini berisi skenario utama untuk modul landing page (Industries, Feature Pages, dan Analytics). Gunakan file berikut:

- `kelolaaja-landing.postman_collection.json` – Daftar request publik dan admin.
- `kelolaaja-landing.postman_environment.json` – Variable dasar (`baseUrl`, `adminToken`, `visitorId`).

### Cara Menggunakan di Postman
1. Import **Collection** dan **Environment** dari folder ini.
2. Set variabel:
   - `baseUrl`: endpoint API Anda (contoh `http://localhost:8080/api`).
   - `adminToken`: token Bearer admin, diperoleh dari endpoint login.
   - `visitorId`: ID visitor yang sudah terekam (boleh dikosongkan lalu isi manual setelah memanggil `Analytics - Track Visitor`).
3. Jalankan request sesuai urutan berikut agar data saling terkait:
   1. `Analytics - Track Visitor`
   2. Copy `visitorId` dari respons, update variable environment.
   3. `Analytics - Track Page View`
   4. Request admin (`overview`, `visitors`, `page-views`)
   5. Endpoint publik `Industries` dan `Feature Pages`.

### Menjalankan dengan Newman (opsional)
Jika memiliki `newman` secara global:

```bash
newman run tests/postman/kelolaaja-landing.postman_collection.json \
  -e tests/postman/kelolaaja-landing.postman_environment.json \
  --env-var adminToken="BearerTokenDiSini"
```

Sesuaikan variabel tambahan (mis. `visitorId`) melalui parameter `--env-var`. README ini hanya menambah dokumentasi; tidak ada dependensi tambahan di proyek.***
