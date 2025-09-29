# 创建一个简单的Web服务器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()

Write-Host "服务器启动在 http://localhost:8080/"
Write-Host "按 Ctrl+C 停止服务器"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # 获取请求的文件路径
        $filePath = $request.Url.LocalPath
        
        # 默认请求根目录时返回index.html
        if ($filePath -eq '/' -or $filePath -eq '') {
            $filePath = '/index.html'
        }

        # 构建完整的文件路径
        $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $filePath.Substring(1)

        # 检查文件是否存在
        if (Test-Path -Path $fullPath -PathType Leaf) {
            # 读取文件内容
            $content = Get-Content -Path $fullPath -Raw
            
            # 设置响应内容类型
            $extension = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html' }
                '.css' { $response.ContentType = 'text/css' }
                '.js' { $response.ContentType = 'application/javascript' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.png' { $response.ContentType = 'image/png' }
                '.gif' { $response.ContentType = 'image/gif' }
                '.svg' { $response.ContentType = 'image/svg+xml' }
                default { $response.ContentType = 'application/octet-stream' }
            }

            # 发送响应
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            # 文件不存在，返回404错误
            $response.StatusCode = 404
            $content = '<html><body><h1>404 - 文件未找到</h1></body></html>'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }

        # 关闭响应
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}