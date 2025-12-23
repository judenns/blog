# Hướng dẫn Deploy

## Yêu cầu

- Tài khoản Vercel
- MongoDB Atlas database
- Vercel CLI: `npm i -g vercel`

## 1. Setup MongoDB Atlas

1. Tạo cluster tại mongodb.com
2. Tạo database user (Database Access)
3. Whitelist IP `0.0.0.0/0` (Network Access)
4. Lấy connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

## 2. Deploy CMS (Payload)

```bash
cd packages/cms
vercel login
vercel
```

Khi được hỏi:
- Link to existing project? **N**
- Project name? `blog-cms`

### Thêm env vars:

```bash
vercel env add DATABASE_URL
# Value: mongodb+srv://user:password@cluster.mongodb.net/dbname
# Environments: Production, Preview
# Sensitive: Yes

vercel env add PAYLOAD_SECRET
# Value: chuoi-random-bat-ky
# Environments: Production, Preview
# Sensitive: Yes

vercel env add FRONTEND_URL
# Value: https://your-frontend.vercel.app (thêm sau khi deploy frontend)
# Environments: Production, Preview
# Sensitive: No
```

### Deploy production:

```bash
vercel --prod
```

## 3. Deploy Frontend (Vite)

```bash
cd packages/frontend
vercel
```

Khi được hỏi:
- Link to existing project? **N**
- Project name? `blog-frontend`

### Thêm env var:

```bash
vercel env add VITE_API_URL
# Value: https://your-cms.vercel.app (KHÔNG có / cuối!)
# Environments: Production, Preview
# Sensitive: No
```

### Deploy production:

```bash
vercel --prod
```

## 4. Kết nối CMS & Frontend

Sau khi deploy cả 2:

1. Thêm `FRONTEND_URL` cho CMS (nếu chưa):
```bash
cd packages/cms
vercel env add FRONTEND_URL
# Value: https://your-frontend.vercel.app
vercel --prod
```

2. Kiểm tra `VITE_API_URL` trong frontend trỏ đúng CMS URL

## Lệnh hữu ích

```bash
vercel ls              # Xem danh sách deployments
vercel env ls          # Xem env vars
vercel logs <url>      # Xem logs
vercel --prod          # Deploy production
vercel env rm <name>   # Xóa env var
```

## Xử lý lỗi

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` env var trong CMS
- Redeploy CMS sau khi thêm env var

### Double slash trong URL (`//api/posts`)
- `VITE_API_URL` có dấu `/` cuối - xóa đi
- Đúng: `https://cms.vercel.app`
- Sai: `https://cms.vercel.app/`

### 404 ở các trang (blog-detail, about, etc.)
- Kiểm tra `vite.config.js` có `rollupOptions.input` với tất cả HTML files
- Redeploy frontend

### Lỗi kết nối MongoDB
- Kiểm tra `DATABASE_URL` bắt đầu bằng `mongodb+srv://`
- Kiểm tra password đúng
- Whitelist IP trong Atlas Network Access

### Quên mật khẩu Payload admin
1. Vào MongoDB Atlas > Browse Collections
2. Tìm database > collection `users`
3. Xóa document user
4. Vào `/admin` > tạo account mới
