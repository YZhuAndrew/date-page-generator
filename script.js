// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const pageList = document.getElementById('page-list');
    const messageDiv = document.getElementById('message');
    
    // 页面加载时显示已生成的页面列表
    loadPageList();
    
    // 生成新页面按钮点击事件
    generateBtn.addEventListener('click', function() {
        generateNewPage();
    });
    
    // 加载已生成的页面列表
    function loadPageList() {
        // 从 localStorage 获取页面列表
        const pages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
        
        // 清空现有列表
        pageList.innerHTML = '';
        
        // 添加页面到列表
        pages.forEach(page => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = page.filename;
            a.textContent = page.date;
            a.target = '_blank';
            li.appendChild(a);
            pageList.appendChild(li);
        });
    }
    
    // 生成新页面
    function generateNewPage() {
        // 获取当前日期
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const dateStr = `${year}-${month}-${day}`;
        const timeStr = `${hours}:${minutes}:${seconds}`;
        const filename = `${dateStr}_${hours}-${minutes}-${seconds}.html`;
        
        // 创建新页面内容
        const pageContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>日期页面 - ${dateStr}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="page">
        <h1>你好，测试成功啦！</h1>
        <p>当前日期: ${dateStr}</p>
        <p>生成时间: ${timeStr}</p>
        <a href="index.html" class="back-link">返回主页</a>
    </div>
    
    <script>
        // 添加一些动态效果
        document.addEventListener('DOMContentLoaded', function() {
            const elements = document.querySelectorAll('.page > *');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200 * index);
            });
        });
    <\/script>
</body>
</html>`;
        
        // 创建 Blob 对象并生成 URL
        const blob = new Blob([pageContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // 创建临时下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        // 保存页面信息到 localStorage
        const pages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
        pages.unshift({
            date: `${dateStr} ${timeStr}`,
            filename: filename
        });
        localStorage.setItem('generatedPages', JSON.stringify(pages));
        
        // 更新页面列表
        loadPageList();
        
        // 显示成功消息
        showMessage(`页面 "${filename}" 已生成并下载！`, 'success');
    }
    
    // 显示消息
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        
        // 3秒后自动隐藏消息
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }
});