# 生图相册同步

Firefly 原有相册从 `public/gallery/` 读取。「生图」读取独立的 Vercel Blob 相册清单。网站构建时设置 `PUBLIC_IMMICH_GALLERY_MANIFEST_URL` 才会出现这个相册入口，后续每轮同步只更新 Blob。

## 本机配置

在仓库根目录创建 UTF-8 `.env.immich-gallery`，文件已被 Git 忽略。填写「生图」的相册 ID、Immich 只读 API Key 和独立公开 Blob store 的写入令牌。Immich Key 需要 `album.read`、`asset.read` 和 `asset.view` 权限。

```dotenv
IMMICH_URL=http://127.0.0.1:2283
IMMICH_ALBUM_ID=填入生图相册的UUID
IMMICH_API_KEY=填入Immich只读APIKey
BLOB_READ_WRITE_TOKEN=填入公开Blob存储的写入令牌
```

先从本机 PowerShell 运行只读检查。确认照片数后运行首次同步，并将返回的 `manifestUrl` 用作 Vercel 的 `PUBLIC_IMMICH_GALLERY_MANIFEST_URL`。网站只需配置公开 URL。

```powershell
pwsh -NoProfile -File 'scripts/immich-gallery-task.ps1' -DryRun
pwsh -NoProfile -File 'scripts/immich-gallery-task.ps1'
```

首次同步完成后可注册 Windows 任务。任务在当前 Windows 用户登录且电脑可用时每小时执行。Docker Desktop 和 Immich 需要运行。最近一次定时执行的日志写在 `.env.immich-gallery.log`。

```powershell
pwsh -NoProfile -File 'scripts/immich-gallery-task.ps1' -Register
Start-ScheduledTask -TaskName 'Firefly-Immich-Shengtu'
Get-ScheduledTaskInfo -TaskName 'Firefly-Immich-Shengtu'
Stop-ScheduledTask -TaskName 'Firefly-Immich-Shengtu'
Disable-ScheduledTask -TaskName 'Firefly-Immich-Shengtu'
```

脚本只同步照片的 WebP 缩略图和预览图，并移除图片元数据。整轮完成后才发布清单。上传或读取失败时，网站继续使用上一版。移出相册的照片会在下一次成功同步后从页面下架，已公开的旧 Blob 文件仍可通过其 URL 访问。
