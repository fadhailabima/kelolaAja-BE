# Media File Upload - Implementasi Guide

## 📋 Overview

Fitur upload file sudah **fully implemented** dengan kemampuan:
- ✅ Multi-format file upload (images, documents, videos, archives)
- ✅ Automatic file optimization (image compression & resize)
- ✅ Secure file validation
- ✅ File serving & download
- ✅ Storage management
- ✅ File statistics

---

## 🚀 Endpoints yang Tersedia

### 1. **Upload File**
**POST** `/api/v1/media-files/admin/upload`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required) - File to upload
- `altText` (optional) - Alt text for SEO
- `isPublic` (optional) - true/false (default: true)

**Example using Postman:**
1. Select `POST` method
2. URL: `http://localhost:8080/api/v1/media-files/admin/upload`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body: Select `form-data`
5. Add key `file` with type `File`, select your file
6. (Optional) Add key `altText` with type `Text`
7. (Optional) Add key `isPublic` with value `true` or `false`

**Example using cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/media-files/admin/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/image.jpg" \
  -F "altText=Company Logo" \
  -F "isPublic=true"
```

**Response:**
```json
{
  "success": true,
  "message": "Media file uploaded successfully",
  "data": {
    "fileId": 1,
    "fileName": "company-logo.jpg",
    "filePath": "/2025/11/1732368000000-123456789-company-logo.jpg",
    "fileType": "image",
    "mimeType": "image/jpeg",
    "fileSize": "245678",
    "width": 1920,
    "height": 1080,
    "altText": "Company Logo",
    "storageType": "local",
    "isPublic": true,
    "uploadedBy": 1,
    "uploader": {
      "userId": 1,
      "username": "admin",
      "email": "admin@kelolaaja.com"
    },
    "createdAt": "2025-11-23T10:00:00.000Z",
    "updatedAt": "2025-11-23T10:00:00.000Z",
    "deletedAt": null
  }
}
```

---

### 2. **List All Files**
**GET** `/api/v1/media-files/admin?page=1&limit=20`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `fileType` - Filter by type (image/video/document/audio/other)
- `mimeType` - Filter by MIME type
- `isPublic` - Filter by visibility (true/false)
- `uploadedBy` - Filter by user ID

---

### 3. **Get File Details**
**GET** `/api/v1/media-files/admin/:id`

---

### 4. **Update File Metadata**
**PUT** `/api/v1/media-files/admin/:id`

**Body:**
```json
{
  "fileName": "updated-name.jpg",
  "altText": "Updated alt text",
  "isPublic": false
}
```

---

### 5. **Delete File**
**DELETE** `/api/v1/media-files/admin/:id`

Note: This is a soft delete (file still exists but marked as deleted)

---

### 6. **Serve File (View)**
**GET** `/api/v1/media-files/serve/:id`

Public endpoint - displays file in browser (for images, PDFs, etc.)

Example: `http://localhost:8080/api/v1/media-files/serve/1`

---

### 7. **Download File**
**GET** `/api/v1/media-files/download/:id`

Public endpoint - force download file

Example: `http://localhost:8080/api/v1/media-files/download/1`

---

### 8. **Get Statistics**
**GET** `/api/v1/media-files/admin/stats`

**Response:**
```json
{
  "success": true,
  "message": "File statistics retrieved successfully",
  "data": {
    "totalFiles": 150,
    "totalSize": "52428800",
    "totalSizeFormatted": "50.00 MB",
    "filesByType": [
      {
        "fileType": "image",
        "count": 120
      },
      {
        "fileType": "document",
        "count": 25
      },
      {
        "fileType": "video",
        "count": 5
      }
    ]
  }
}
```

---

## 📁 File Storage Structure

Files are stored in:
```
/uploads/
  └── 2025/
      └── 11/
          ├── 1732368000000-123456789-file1.jpg
          ├── 1732368000001-987654321-file2.pdf
          └── ...
```

Format: `{timestamp}-{random}-{sanitized-filename}.{ext}`

---

## 🔒 Security Features

### File Type Validation
Allowed file types:
- **Images:** jpeg, jpg, png, gif, webp, svg
- **Documents:** pdf, doc, docx, xls, xlsx, ppt, pptx
- **Archives:** zip, rar
- **Videos:** mp4, mpeg, quicktime, avi, webm

### File Size Limit
- Maximum: **10 MB per file**
- Configurable in `/src/middlewares/upload.middleware.ts`

### Access Control
- Upload requires authentication
- Public files can be accessed by anyone
- Private files require authentication

---

## 🎨 Image Optimization

Automatic optimization for uploaded images:
- **Max dimensions:** 2000x2000 pixels
- **Quality:** 85%
- **Format preservation:** JPEG, PNG, WebP
- **Auto resize:** If larger than max dimensions

Configure in controller or create custom optimization profiles.

---

## 💻 Frontend Integration Example

### Using JavaScript Fetch API

```javascript
async function uploadFile(file, altText = '', isPublic = true) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('altText', altText);
  formData.append('isPublic', isPublic.toString());

  const response = await fetch('http://localhost:8080/api/v1/media-files/admin/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  return await response.json();
}

// Usage
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const result = await uploadFile(file, 'Product Image', true);
console.log(result);
```

### Using React

```jsx
import React, { useState } from 'react';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', 'My Image');
    formData.append('isPublic', 'true');

    try {
      const response = await fetch('http://localhost:8080/api/v1/media-files/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
```

---

## 🛠️ Configuration

### Change Max File Size

Edit `/src/middlewares/upload.middleware.ts`:
```typescript
limits: {
  fileSize: 20 * 1024 * 1024, // 20MB instead of 10MB
}
```

### Add More Allowed File Types

Edit `/src/middlewares/upload.middleware.ts`:
```typescript
const allowedMimes = [
  // Add your mime types
  'application/json',
  'text/plain',
  // etc...
];
```

### Change Image Optimization Settings

Edit `/src/controllers/media-file.controller.ts` in `upload` method:
```typescript
await FileUtil.optimizeImage(uploadedFile.path, {
  maxWidth: 3000,    // Change max width
  maxHeight: 3000,   // Change max height
  quality: 90,       // Change quality (1-100)
});
```

---

## 🧪 Testing

### Test Upload via Postman

1. Import Postman collection: `KelolaAja-API.postman_collection.json`
2. Login to get access token
3. Go to "Media Files" → "Upload File"
4. Select file and send request

### Direct URL Access

After upload, files can be accessed at:
- **Static URL:** `http://localhost:8080/uploads/2025/11/filename.jpg`
- **Via API:** `http://localhost:8080/api/v1/media-files/serve/1`

---

## ⚠️ Important Notes

1. **Folder Permissions:** Ensure `uploads/` folder has write permissions
2. **Production:** Consider using cloud storage (S3, Cloudinary) for production
3. **Backup:** Uploaded files are not in git (see `.gitignore`)
4. **Security:** Always validate files server-side, never trust client input
5. **Cleanup:** Soft-deleted files remain on disk (implement cleanup job if needed)

---

## 📦 Dependencies Installed

- `multer` - File upload handling
- `sharp` - Image processing and optimization
- `@types/multer` - TypeScript types for multer
- `@types/sharp` - TypeScript types for sharp

---

## 🎯 Next Steps (Optional Enhancements)

1. **Cloud Storage Integration** (AWS S3, Google Cloud Storage, Cloudinary)
2. **Bulk Upload** support
3. **Image thumbnails** generation
4. **Video thumbnails** extraction
5. **File compression** for documents
6. **Virus scanning** integration
7. **Upload progress** tracking
8. **Drag & drop** upload UI
9. **Chunked upload** for large files
10. **CDN integration**

---

## 🆘 Troubleshooting

### Error: "File too large"
- Check file size limit in middleware
- Increase limit if needed

### Error: "File type not allowed"
- Check allowed MIME types in middleware
- Add your file type if missing

### Error: "ENOENT: no such file or directory"
- Ensure uploads folder exists
- Check file path configuration

### Files not accessible
- Check static file middleware in app.ts
- Verify file permissions

---

**Status:** ✅ **FULLY IMPLEMENTED & READY TO USE**

Fitur upload file sudah lengkap dan siap digunakan untuk development maupun production!
