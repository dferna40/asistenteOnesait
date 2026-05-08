$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $projectRoot 'public'
$buildDir = Join-Path $projectRoot 'build-assets'

New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
New-Item -ItemType Directory -Force -Path $buildDir | Out-Null

$pngPath = Join-Path $publicDir 'app-icon.png'
$icoPath = Join-Path $buildDir 'icon.ico'

$size = 256
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

function New-RoundedRectanglePath {
  param(
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2

  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

$hexagonPoints = [System.Drawing.PointF[]]@(
  (New-Object System.Drawing.PointF 128, 18),
  (New-Object System.Drawing.PointF 208, 64),
  (New-Object System.Drawing.PointF 208, 190),
  (New-Object System.Drawing.PointF 128, 238),
  (New-Object System.Drawing.PointF 48, 190),
  (New-Object System.Drawing.PointF 48, 64)
)

$iconBackgroundPath = New-RoundedRectanglePath -Rect ([System.Drawing.RectangleF]::new(12, 12, 232, 232)) -Radius 52
$hexagonPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$hexagonPath.AddPolygon($hexagonPoints)

$backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point 16, 16),
  (New-Object System.Drawing.Point 236, 236),
  [System.Drawing.Color]::FromArgb(255, 14, 116, 144),
  [System.Drawing.Color]::FromArgb(255, 15, 23, 42)
)
$backgroundBlend = New-Object System.Drawing.Drawing2D.ColorBlend
$backgroundBlend.Colors = @(
  [System.Drawing.Color]::FromArgb(255, 8, 20, 44),
  [System.Drawing.Color]::FromArgb(255, 14, 165, 233),
  [System.Drawing.Color]::FromArgb(255, 13, 148, 136)
)
$backgroundBlend.Positions = @(0.0, 0.48, 1.0)
$backgroundBrush.InterpolationColors = $backgroundBlend

$hexagonBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point 60, 36),
  (New-Object System.Drawing.Point 200, 220),
  [System.Drawing.Color]::FromArgb(255, 56, 189, 248),
  [System.Drawing.Color]::FromArgb(255, 15, 118, 110)
)
$hexagonBlend = New-Object System.Drawing.Drawing2D.ColorBlend
$hexagonBlend.Colors = @(
  [System.Drawing.Color]::FromArgb(255, 56, 189, 248),
  [System.Drawing.Color]::FromArgb(255, 6, 182, 212),
  [System.Drawing.Color]::FromArgb(255, 13, 148, 136)
)
$hexagonBlend.Positions = @(0.0, 0.54, 1.0)
$hexagonBrush.InterpolationColors = $hexagonBlend

$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 8, 15, 30))
$highlightPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(185, 255, 255, 255), 3)
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(75, 255, 255, 255), 2)
$gridPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$fontFamily = New-Object System.Drawing.FontFamily 'Segoe UI'
$letterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$letterFont = New-Object System.Drawing.Font($fontFamily, 82, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center

$graphics.FillPath($backgroundBrush, $iconBackgroundPath)
$graphics.FillEllipse($shadowBrush, 42, 34, 170, 170)
$graphics.FillPath($hexagonBrush, $hexagonPath)
$graphics.DrawPath($highlightPen, $hexagonPath)
$graphics.DrawLine($gridPen, 128, 18, 128, 238)
$graphics.DrawLine($gridPen, 48, 64, 128, 112)
$graphics.DrawLine($gridPen, 128, 112, 208, 64)
$graphics.DrawLine($gridPen, 48, 190, 128, 144)
$graphics.DrawLine($gridPen, 128, 144, 208, 190)

$graphics.DrawString('P', $letterFont, $letterBrush, ([System.Drawing.RectangleF]::new(64, 72, 128, 120)), $format)

$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$stream = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($stream)

$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]1)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]32)
$writer.Write([UInt32]$pngBytes.Length)
$writer.Write([UInt32]22)
$writer.Write($pngBytes)
$writer.Flush()
$writer.Close()
$stream.Close()

$format.Dispose()
$letterFont.Dispose()
$letterBrush.Dispose()
$fontFamily.Dispose()
$gridPen.Dispose()
$highlightPen.Dispose()
$shadowBrush.Dispose()
$hexagonBrush.Dispose()
$backgroundBrush.Dispose()
$hexagonPath.Dispose()
$iconBackgroundPath.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
