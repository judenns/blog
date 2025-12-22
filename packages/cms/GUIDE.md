# Payload CMS Setup Guide (MongoDB Atlas)

## Giải thích khái niệm

### CMS là gì?
**CMS (Content Management System)** = hệ thống quản lý nội dung.
- Thay vì edit file `data.json` bằng tay, bạn có giao diện đẹp để thêm/sửa/xóa bài viết

### MongoDB Atlas là gì?
- MongoDB chạy trên cloud (không cần cài trên máy)
- Free tier 512MB - đủ cho practice
- Data persist qua các session

---

## Bước 1: Tạo MongoDB Atlas Account (~5 phút)

### 1.1 Đăng ký
1. Vào https://www.mongodb.com/cloud/atlas/register
2. Đăng ký bằng **Google** hoặc email
3. Khi hỏi mục đích → chọn **Learning MongoDB**

### 1.2 Tạo Cluster (Database Server)

Sau khi đăng ký, Atlas sẽ hỏi bạn tạo cluster:

1. **Deploy your cluster**:
   - Chọn **M0 FREE** (quan trọng!)
   - Provider: **AWS**
   - Region: **Singapore** (ap-southeast-1) hoặc gần bạn
   - Cluster name: `payload-blog`

2. Click **Create Deployment**
3. Đợi 1-3 phút để cluster khởi tạo

### 1.3 Tạo Database User

Atlas sẽ tự hiện popup "Connect to Cluster":

1. **Username**: `admin` (hoặc tên bạn muốn)
2. **Password**: Click **Autogenerate Secure Password**
3. **QUAN TRỌNG**: Click **Copy** và lưu password vào đâu đó!
4. Click **Create Database User**

### 1.4 Cho phép kết nối

Tiếp tục trong popup:

1. Chọn **My Local Environment**
2. Click **Add My Current IP Address**
3. Hoặc chọn **Allow Access from Anywhere** (dễ hơn cho dev)
4. Click **Finish and Close**

### 1.5 Lấy Connection String

1. Trong Dashboard, click **Connect** trên cluster
2. Chọn **Drivers**
3. Copy connection string (dạng):
```
mongodb+srv://admin:<db_password>@payload-blog.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=payload-blog
```
4. **Thay `<db_password>`** bằng password đã copy ở bước 1.3

**Ví dụ sau khi thay:**
```
mongodb+srv://admin:MyP@ssw0rd123@payload-blog.abc123.mongodb.net/?retryWrites=true&w=majority&appName=payload-blog
```

---

## Bước 2: Tạo Payload CMS Project

### 2.1 Chạy lệnh tạo project

```bash
cd ~/practices/blog/packages

pnpm create payload-app@latest cms
```

### 2.2 Trả lời câu hỏi CLI

| Câu hỏi | Chọn/Nhập |
|---------|-----------|
| Select a project template | **blank** |
| Select a database | **mongodb** |
| Enter MongoDB connection string | **Paste connection string từ Atlas** |
| Would you like to use TypeScript? | **Yes** |

### 2.3 Đợi cài đặt

- Tải dependencies (~2-3 phút)
- Tạo cấu trúc project

**Kết quả:** Folder mới `packages/cms/`

---

## Bước 3: Tạo Posts Collection

### 3.1 Tạo file collection

Tạo file: `packages/cms/src/collections/Posts.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,  // Cho phép ai cũng đọc được
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
```

---

## Bước 4: Register Collection

Mở file: `packages/cms/src/payload.config.ts`

### 4.1 Thêm import

Thêm ở đầu file:
```typescript
import { Posts } from './collections/Posts'
```

### 4.2 Thêm vào collections array

Tìm `collections: [...]` và thêm Posts:
```typescript
collections: [
  Posts,
  // ... các collection khác (Users, Media, etc.)
],
```

### 4.3 Thêm CORS config

Thêm dòng này trong `buildConfig`:
```typescript
cors: ['http://localhost:5173'],
```

---

## Bước 5: Chạy Payload CMS

```bash
cd ~/practices/blog/packages/cms
pnpm dev
```

### Lần đầu chạy:
- Payload kết nối đến MongoDB Atlas
- Tạo collections trong database
- Hỏi tạo admin user

### Tạo admin account:
```
Enter your email: your@email.com
Enter your password: ********
```

### Mở Admin UI:
- Vào browser: **http://localhost:3000/admin**
- Login với email/password vừa tạo
- Click **Posts** → **Create New** để tạo bài viết

---

## Bước 6: Test API

Mở tab mới: **http://localhost:3000/api/posts**

Response sẽ như:
```json
{
  "docs": [...],
  "totalDocs": 0,
  "limit": 10,
  "page": 1
}
```

---

## Bước 7: Update Frontend (sau khi có data)

### 7.1 Sửa main.js

File: `packages/frontend/src/main.js`

```javascript
// Cũ
const response = await fetch('/data.json')
const blogs = await response.json()

// Mới
const response = await fetch('http://localhost:3000/api/posts')
const result = await response.json()
const blogs = result.docs
```

### 7.2 Sửa details.js

File: `packages/frontend/src/details.js`

```javascript
// Lấy bài viết theo slug
const slug = new URLSearchParams(window.location.search).get('slug')
const response = await fetch(`http://localhost:3000/api/posts?where[slug][equals]=${slug}`)
const result = await response.json()
const post = result.docs[0]
```

---

## Cheat Sheet

```bash
# Chạy Payload CMS
cd ~/practices/blog/packages/cms && pnpm dev

# Chạy Frontend
cd ~/practices/blog/packages/frontend && pnpm dev

# Chạy cả 2 (từ root, nếu có script)
cd ~/practices/blog && pnpm dev:all
```

**URLs:**
- Admin UI: http://localhost:3000/admin
- API: http://localhost:3000/api/posts
- Frontend: http://localhost:5173

---

## Troubleshooting

### Lỗi "MongoServerError: bad auth"
**Nguyên nhân:** Password sai trong connection string

**Fix:**
1. Vào MongoDB Atlas → Database Access
2. Edit user → Change Password
3. Copy password mới
4. Update trong `.env` file

### Lỗi "CORS error"
**Nguyên nhân:** Chưa config CORS

**Fix:** Thêm vào `payload.config.ts`:
```typescript
cors: ['http://localhost:5173'],
```

### Lỗi "IP not whitelisted"
**Nguyên nhân:** IP của bạn thay đổi

**Fix:**
1. Vào MongoDB Atlas → Network Access
2. Click **Add IP Address**
3. Add current IP hoặc **Allow Access from Anywhere**

---

## Tài liệu

- Payload Docs: https://payloadcms.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
