# Payload CMS Setup Guide (MongoDB Atlas)

## Khái niệm cơ bản

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

### 1.2 Tạo Cluster

1. Chọn **M0 FREE** (quan trọng!)
2. Provider: **AWS**
3. Region: **Singapore** (ap-southeast-1)
4. Cluster name: `payload-blog`
5. Click **Create Deployment** → đợi 1-3 phút

### 1.3 Tạo Database User

1. **Username**: `admin`
2. **Password**: Click **Autogenerate Secure Password**
3. **QUAN TRỌNG**: Click **Copy** và lưu password!
4. Click **Create Database User**

### 1.4 Whitelist IP (QUAN TRỌNG cho WSL)

1. Vào **Network Access** (sidebar trái)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (nhập `0.0.0.0/0`)
4. Click **Confirm**
5. **Đợi 1-2 phút** để apply

> **Tại sao cần `0.0.0.0/0`?**
>
> - WSL có IP riêng, khác Windows
> - IP WSL thay đổi mỗi lần restart
> - `0.0.0.0/0` cho phép tất cả IP (chỉ dùng cho dev)

### 1.5 Lấy Connection String

1. Click **Connect** trên cluster
2. Chọn **Drivers**
3. Copy connection string:

```
mongodb+srv://admin:<db_password>@payload-blog.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. **Thay `<db_password>`** bằng password thật

---

## Bước 2: Tạo Payload CMS Project

```bash
cd ~/practices/blog/packages
pnpm create payload-app@latest cms
```

### Trả lời câu hỏi:

| Câu hỏi           | Chọn               |
| ----------------- | ------------------ |
| Template          | **blank**          |
| Database          | **mongodb**        |
| Connection string | **Paste từ Atlas** |
| TypeScript        | **Yes**            |

---

## Bước 3: Cấu hình .env

File `.env` là **hidden file** (bắt đầu bằng `.`).

### Xem file ẩn:

```bash
ls -la packages/cms/
```

### Nội dung `.env`:

```
DATABASE_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/payload-cms
PAYLOAD_SECRET=any-random-string-here
```

> **Lưu ý:** `.env` không commit vào git (đã có trong `.gitignore`)

---

## Bước 4: Tạo Posts Collection

Tạo file `packages/cms/src/collections/Posts.ts`:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
  ],
}
```

---

## Bước 5: Register Collection

Sửa `packages/cms/src/payload.config.ts`:

```typescript
import { Posts } from './collections/Posts'

export default buildConfig({
  collections: [Posts, Users, Media],
  cors: ['http://localhost:5173'],
  // ...
})
```

---

## Bước 6: Chạy Payload CMS

```bash
cd packages/cms
pnpm dev
```

- Admin UI: http://localhost:3000/admin
- API: http://localhost:3000/api/posts

---

## Bước 7: Update Frontend

### main.js

```javascript
// Cũ
import data from '../data.json'

// Mới
const response = await fetch('http://localhost:3000/api/posts')
const { docs } = await response.json()
```

### details.js

```javascript
const slug = new URLSearchParams(window.location.search).get('slug')
const response = await fetch(
  `http://localhost:3000/api/posts?where[slug][equals]=${slug}`
)
const { docs } = await response.json()
const post = docs[0]
```

---

## Cheat Sheet

```bash
# Chạy CMS
cd packages/cms && pnpm dev

# Chạy Frontend
cd packages/frontend && pnpm dev

# Chạy cả 2
pnpm dev:all

# Generate import map (khi gặp lỗi importMap)
cd packages/cms && pnpm payload generate:importmap
```

**URLs:**

- Admin: http://localhost:3000/admin
- API: http://localhost:3000/api/posts
- Frontend: http://localhost:5173

---

## Troubleshooting

### Lỗi "Socket connect timed out" / "ECONNREFUSED"

**Nguyên nhân:** IP chưa được whitelist trong MongoDB Atlas

**Fix:**

1. Vào https://cloud.mongodb.com → **Network Access**
2. Click **Add IP Address**
3. Nhập `0.0.0.0/0` (Allow from Anywhere)
4. **Đợi 1-2 phút**
5. Restart: `pnpm dev`

> **WSL users:** Luôn dùng `0.0.0.0/0` vì IP WSL thay đổi

---

### Lỗi "MongoServerError: bad auth"

**Nguyên nhân:** Password sai trong connection string

**Fix:**

1. Vào Atlas → **Database Access**
2. Edit user → **Change Password**
3. Copy password mới
4. Update file `.env`:

```
DATABASE_URI=mongodb+srv://admin:NEW_PASSWORD@...
```

---

### Lỗi "PayloadComponent not found in importMap"

**Nguyên nhân:** Import map chưa được generate

**Fix:**

```bash
cd packages/cms
pnpm payload generate:importmap
pnpm dev
```

**Khi nào cần chạy lại:**

- Thêm/xóa Payload plugin
- Update Payload version
- Thêm custom admin component

---

### File `.env` không hiện

**Nguyên nhân:** File ẩn (hidden file)

**Fix:**

```bash
# Xem file ẩn trong terminal
ls -la packages/cms/

# Tạo file nếu chưa có
cp packages/cms/.env.example packages/cms/.env
```

---

### Lỗi "CORS error"

**Nguyên nhân:** Chưa config CORS

**Fix:** Thêm vào `payload.config.ts`:

```typescript
cors: ['http://localhost:5173'],
```

---

## Tài liệu

- [Payload Docs](https://payloadcms.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Payload Collections](https://payloadcms.com/docs/configuration/collections)
- [Payload REST API](https://payloadcms.com/docs/rest-api/overview)
