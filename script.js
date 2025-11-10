// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const pageList = document.getElementById('page-list');
    const messageDiv = document.getElementById('message');
    const container = document.querySelector('.container');
    const pageContainer = document.getElementById('page-container');
    
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
            a.href = `#${page.id}`;
            a.textContent = page.date + ' ' + page.time;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                showGeneratedPage(page);
            });
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
        const id = `${dateStr}_${hours}-${minutes}-${seconds}`;
        
        const pageData = {
            id: id,
            date: dateStr,
            time: timeStr,
            content: "你好，测试成功啦"
        };
        
        // 保存页面信息到 localStorage
        const pages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
        pages.unshift(pageData);
        localStorage.setItem('generatedPages', JSON.stringify(pages));
        
        // 更新页面列表
        loadPageList();
        
        // 显示新生成的页面
        showGeneratedPage(pageData);
        
        // 显示成功消息
        showMessage(`页面已生成！`, 'success');
    }
    
    // 显示生成的页面
    function showGeneratedPage(pageData) {
        // 隐藏主容器
        container.style.display = 'none';
        
        // 构建页面内容
        pageContainer.innerHTML = `
            <div class="page-content">
                <h1>${pageData.content}</h1>
                <p>当前日期: ${pageData.date}</p>
                <p>生成时间: ${pageData.time}</p>
                <button class="back-button" id="back-button">返回主页</button>
            </div>
        `;
        
        // 显示页面容器
        pageContainer.style.display = 'block';
        
        // 添加返回主页的功能
        document.getElementById('back-button').addEventListener('click', function() {
            pageContainer.style.display = 'none';
            container.style.display = 'flex';
            // 清除URL中的hash
            history.pushState('', document.title, window.location.pathname);
        });
        
        // 更新URL hash
        window.location.hash = pageData.id;
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
    
    // 处理页面 hash 变化
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substr(1);
        if (hash) {
            const pages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
            const page = pages.find(p => p.id === hash);
            if (page) {
                showGeneratedPage(page);
            }
        } else {
            // 如果hash为空，显示主页
            pageContainer.style.display = 'none';
            container.style.display = 'flex';
        }
    });
    
    // 页面加载时检查URL hash
    const initialHash = window.location.hash.substr(1);
    if (initialHash) {
        const pages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
        const page = pages.find(p => p.id === initialHash);
        if (page) {
            showGeneratedPage(page);
        }
    }
});