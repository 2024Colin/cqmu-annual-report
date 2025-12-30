// 全局变量
let currentPage = 0;
const totalPages = 11; // 封面页 + 11个内容页 + 尾页
let isAnimating = false;
let musicPlaying = true;

// DOM元素
const pages = [
    'loading', 'cover', 'page1', 'page2', 'page3', 'page4', 'page5', 
    'page6', 'page7', 'page8', 'page9', 'page10', 'page11', 'ending'
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 模拟加载
    simulateLoading();
    
    // 初始化事件监听
    initEventListeners();
    
    // 初始化图表
    initCharts();
    
    // 初始化数据
    initData();
});

// 模拟加载过程
function simulateLoading() {
    const progress = document.querySelector('.progress');
    const percent = document.querySelector('.loading-percent');
    let width = 0;
    
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                showPage('cover');
            }, 500);
        }
        progress.style.width = width + '%';
        percent.textContent = Math.floor(width) + '%';
    }, 100);
}

// 显示指定页面
function showPage(pageId) {
    if (isAnimating) return;
    isAnimating = true;
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    targetPage.classList.remove('hidden');
    
    // 更新当前页面索引
    currentPage = pages.indexOf(pageId);
    
    // 更新导航
    updateNavigation();
    
    // 如果是封面页，开始音乐
    if (pageId === 'cover' && musicPlaying) {
        const bgm = document.getElementById('bgm');
        bgm.play().catch(e => console.log('自动播放被阻止:', e));
    }
    
    // 重置动画状态
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// 更新导航
function updateNavigation() {
    // 更新进度条
    const progress = document.getElementById('nav-progress');
    const progressPercent = (currentPage / (pages.length - 1)) * 100;
    progress.style.width = progressPercent + '%';
    
    // 更新导航点
    const navDots = document.querySelector('.nav-dots');
    navDots.innerHTML = '';
    
    for (let i = 1; i < pages.length - 1; i++) { // 跳过加载和尾页
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === currentPage) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            showPage(pages[i]);
        });
        navDots.appendChild(dot);
    }
    
    // 显示/隐藏导航
    const globalNav = document.querySelector('.global-nav');
    if (currentPage === 0 || currentPage === 1 || currentPage === pages.length - 1) {
        globalNav.style.display = 'none';
    } else {
        globalNav.style.display = 'flex';
    }
    
    // 更新页面导航
    document.querySelectorAll('.page-nav .current').forEach(el => {
        el.textContent = Math.max(0, currentPage - 1);
    });
}

// 初始化事件监听
function initEventListeners() {
    // 封面页点击事件
    document.getElementById('cover').addEventListener('click', function(e) {
        if (e.target.closest('.music-control')) return;
        showPage('page1');
    });
    
    // 音乐切换
    document.getElementById('music-toggle').addEventListener('click', function() {
        const bgm = document.getElementById('bgm');
        const icon = this.querySelector('i');
        
        if (musicPlaying) {
            bgm.pause();
            icon.className = 'fas fa-volume-mute';
            musicPlaying = false;
        } else {
            bgm.play();
            icon.className = 'fas fa-volume-up';
            musicPlaying = true;
        }
    });
    
    // 首页按钮
    document.getElementById('go-home').addEventListener('click', () => {
        showPage('cover');
    });
    
    // 滑动翻页
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', function(e) {
        if (isAnimating) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;
        
        // 垂直滑动优先
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
            if (diffY > 0) {
                // 向上滑动 - 下一页
                if (currentPage < pages.length - 1) {
                    showPage(pages[currentPage + 1]);
                }
            } else {
                // 向下滑动 - 上一页
                if (currentPage > 1) {
                    showPage(pages[currentPage - 1]);
                }
            }
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentPage < pages.length - 1) {
                showPage(pages[currentPage + 1]);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(pages[currentPage - 1]);
            }
        }
    });
    
    // 查看原文按钮
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            alert(`将跳转到推文ID: ${postId}\n实际开发中这里会跳转到对应推文`);
        });
    });
    
    // 查看系列按钮
    document.querySelector('.series-btn').addEventListener('click', function() {
        alert('将显示"重医新青年"系列所有推文\n实际开发中这里会显示系列列表');
    });
    
    // 季节卡片点击
    document.querySelectorAll('.season-card').forEach(card => {
        card.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            showSeasonDetail(season);
        });
    });
    
    // 返回按钮
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.page-content');
            parent.querySelector('.season-detail, .department-detail, .photo-gallery').classList.add('hidden');
            parent.querySelector('.season-grid, .department-icons, .training-cards').classList.remove('hidden');
        });
    });
    
    // 身份标签动画
    setTimeout(() => {
        const identityAnimation = document.querySelector('.identity-animation');
        const identityResult = document.querySelector('.identity-result');
        
        if (identityAnimation) {
            setTimeout(() => {
                identityAnimation.classList.add('hidden');
                identityResult.classList.remove('hidden');
            }, 3000);
        }
    }, 1000);
    
    // 生成海报
    document.getElementById('generate-poster').addEventListener('click', function() {
        showPosterModal();
    });
    
    // 数字计数器
    initCounters();
    
    // 部门图标点击
    document.querySelectorAll('.dept-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const dept = this.getAttribute('data-dept');
            showDepartmentDetail(dept);
        });
    });
    
    // 查看培训照片
    document.querySelectorAll('.view-photos').forEach(btn => {
        btn.addEventListener('click', function() {
            const trainingId = this.getAttribute('data-training');
            showPhotoGallery(trainingId);
        });
    });
    
    // 查看更多叮咛
    document.getElementById('more-messages').addEventListener('click', function() {
        showRandomQuote();
    });
    
    // 关闭语录
    document.querySelector('.close-quote')?.addEventListener('click', function() {
        document.querySelector('.quote-display').classList.add('hidden');
    });
    
    // 部门轮播
    initDeptSlider();
    
    // 加入团队按钮
    document.getElementById('join-team').addEventListener('click', function() {
        alert('将跳转到招新推文\n实际开发中这里会跳转到对应链接');
    });
    
    // 留言按钮
    document.getElementById('message-team').addEventListener('click', function() {
        document.querySelector('.message-modal').classList.remove('hidden');
    });
    
    // 关闭留言模态框
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.querySelector('.message-modal').classList.add('hidden');
    });
    
    // 提交留言
    document.querySelector('.submit-btn').addEventListener('click', function() {
        const message = document.getElementById('message-input').value;
        if (message.trim()) {
            alert('留言提交成功！感谢你的鼓励和建议！');
            document.querySelector('.message-modal').classList.add('hidden');
            document.getElementById('message-input').value = '';
        } else {
            alert('请输入留言内容');
        }
    });
    
    // 尾页按钮
    document.getElementById('create-poster').addEventListener('click', function() {
        showPosterModal();
    });
    
    document.getElementById('share-report').addEventListener('click', function() {
        shareReport();
    });
    
    document.getElementById('review-posts').addEventListener('click', function() {
        alert('将显示2025年所有推文列表\n实际开发中这里会跳转到推文合集');
    });
    
    // 海报模态框
    document.getElementById('close-poster').addEventListener('click', function() {
        document.querySelector('.poster-modal').classList.add('hidden');
    });
    
    document.getElementById('download-poster').addEventListener('click', function() {
        downloadPoster();
    });
    
    // 订阅按钮
    document.getElementById('subscribe-btn').addEventListener('click', function() {
        const email = document.getElementById('email-input').value;
        if (validateEmail(email)) {
            alert(`订阅成功！我们将通过邮箱 ${email} 通知你最新内容`);
            document.getElementById('email-input').value = '';
        } else {
            alert('请输入有效的邮箱地址');
        }
    });
}

// 初始化图表
function initCharts() {
    // 月度发布数量图表
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '发布数量',
                data: [6, 7, 4, 6, 4, 4, 4, 4, 8, 3, 7, 8],
                backgroundColor: '#1E4FA1',
                borderRadius: 5,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // 热力图
    const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
    new Chart(heatmapCtx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: '互动热度',
                data: [
                    {x: 1, y: 5, r: 15}, // 1月
                    {x: 2, y: 6, r: 20}, // 2月
                    {x: 3, y: 7, r: 25}, // 3月
                    {x: 4, y: 9, r: 35}, // 4月 - 高峰
                    {x: 5, y: 6, r: 20}, // 5月
                    {x: 6, y: 8, r: 30}, // 6月 - 高峰
                    {x: 7, y: 5, r: 15}, // 7月
                    {x: 8, y: 4, r: 10}, // 8月
                    {x: 9, y: 8, r: 30}, // 9月 - 高峰
                    {x: 10, y: 5, r: 15}, // 10月
                    {x: 11, y: 6, r: 20}, // 11月
                    {x: 12, y: 7, r: 25}, // 12月
                ],
                backgroundColor: '#FF6B6B',
                borderColor: '#FF5252',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 13,
                    ticks: {
                        callback: function(value) {
                            const months = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                            return months[value];
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 0,
                    max: 10,
                    ticks: {
                        callback: function(value) {
                            return value + '级';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][context.raw.x - 1];
                            return `${month}: 互动热度 ${context.raw.r}`;
                        }
                    }
                }
            }
        }
    });
}

// 初始化数据
function initData() {
    // 初始化日历月份
    const calendarMonths = document.querySelector('.calendar-months');
    const monthData = [
        {name: '1月', count: 6},
        {name: '2月', count: 7},
        {name: '3月', count: 4},
        {name: '4月', count: 6},
        {name: '5月', count: 4},
        {name: '6月', count: 4},
        {name: '7月', count: 4},
        {name: '8月', count: 4},
        {name: '9月', count: 8},
        {name: '10月', count: 3},
        {name: '11月', count: 7},
        {name: '12月', count: 8}
    ];
    
    monthData.forEach((month, index) => {
        const monthItem = document.createElement('div');
        monthItem.className = 'month-item';
        if (index === 3) monthItem.classList.add('active'); // 4月为示例活跃月
        
        monthItem.innerHTML = `
            <div class="month-name">${month.name}</div>
            <div class="month-count">${month.count}</div>
        `;
        
        calendarMonths.appendChild(monthItem);
    });
    
    // 初始化头像网格
    const avatarGrid = document.querySelector('.avatar-grid');
    for (let i = 0; i < 8; i++) {
        const avatarCell = document.createElement('div');
        avatarCell.className = 'avatar-cell';
        avatarCell.textContent = `新${i + 1}`;
        avatarGrid.appendChild(avatarCell);
    }
    
    // 初始化计数器
    initCounters();
}

// 初始化数字计数器
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // 使用Intersection Observer触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// 显示季节详情
function showSeasonDetail(season) {
    const pageContent = document.querySelector('#page4 .page-content');
    const seasonGrid = pageContent.querySelector('.season-grid');
    const seasonDetail = pageContent.querySelector('.season-detail');
    
    // 更新标题
    const seasonTitles = {
        spring: '🌸 春季记忆',
        summer: '🎓 夏季记忆',
        autumn: '🍂 秋季记忆',
        winter: '❄️ 冬季记忆'
    };
    
    document.getElementById('season-title').textContent = seasonTitles[season] || '季节记忆';
    

}

// 全局变量，用于缓存团队数据
let teamDataCache = null;
let isLoadingData = false;

// 预加载团队数据
async function loadTeamData() {
    if (teamDataCache) {
        return teamDataCache;
    }
    
    if (isLoadingData) {
        // 如果已经在加载，等待加载完成
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (teamDataCache) {
                    clearInterval(checkInterval);
                    resolve(teamDataCache);
                }
            }, 100);
        });
    }
    
    isLoadingData = true;
    try {
        const response = await fetch('team.json');
        teamDataCache = await response.json();
        isLoadingData = false;
        return teamDataCache;
    } catch (error) {
        console.error('加载团队数据失败:', error);
        isLoadingData = false;
        throw error;
    }
}

// 页面加载时预加载数据
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里预加载数据，但不要阻塞页面渲染
    loadTeamData().catch(err => {
        console.warn('预加载团队数据失败，将在使用时重新尝试');
    });
    
    // 绑定部门图标点击事件
    const deptIcons = document.querySelectorAll('.dept-icon');
    deptIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const dept = this.getAttribute('data-dept');
            showDepartmentDetail(dept);
        });
    });
    
    // 绑定返回按钮事件
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const pageContent = document.querySelector('#page8 .page-content');
            const departmentIcons = pageContent.querySelector('.department-icons');
            const departmentDetail = pageContent.querySelector('.department-detail');
            
            departmentIcons.classList.remove('hidden');
            departmentDetail.classList.add('hidden');
        });
    }
});

// 显示部门详情
async function showDepartmentDetail(dept) {
    const pageContent = document.querySelector('#page8 .page-content');
    const departmentIcons = pageContent.querySelector('.department-icons');
    const departmentDetail = pageContent.querySelector('.department-detail');
    
    // 部门信息
    const deptInfo = {
        editorial: {name: '文编部', count: '...', color: '#667eea'},
        design: {name: '美编部', count: '...', color: '#764ba2'},
        photo: {name: '摄影部', count: '...', color: '#4ECDC4'},
        tech: {name: '运维部', count: '...', color: '#FF6B6B'},
        leadership: {name: '副主编团队', count: '...', color: '#FFD700'}
    };
    
    const info = deptInfo[dept] || {name: '未知部门', count: '0人', color: '#666'};
    
    document.getElementById('dept-name').textContent = info.name;
    document.getElementById('dept-count').textContent = info.count;
    
    // 生成成员列表
    const memberGrid = document.getElementById('member-grid');
    memberGrid.innerHTML = '<div class="loading">正在加载成员数据...</div>';
    
    try {
        // 从缓存或网络加载团队数据
        const teamData = await loadTeamData();
        
        // 获取当前部门的成员数据
        const members = teamData[dept] || [];
        
        // 更新部门人数
        document.getElementById('dept-count').textContent = members.length + '人';
        
        // 清空加载提示
        memberGrid.innerHTML = '';
        
        // 如果没有成员数据
        if (members.length === 0) {
            memberGrid.innerHTML = '<div class="empty">暂无成员数据</div>';
        } else {
            // 使用真实数据生成成员卡片
            members.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-card';
                
                // 获取名字首字母用于头像
                const firstChar = member.name ? member.name.charAt(0) : '?';
                
                // 从专业中提取主要专业名称（去除年级信息）
                const majorParts = member.major ? member.major.split('级') : ['', '未知专业'];
                const majorName = majorParts.length > 1 ? majorParts[1] : (member.major || '未知专业');
                
                memberCard.innerHTML = `
                    <div class="member-avatar" style="background: ${info.color}">
                        ${firstChar}
                    </div>
                    <div class="member-name">${member.name || '未知姓名'}</div>
                    <div class="member-major">${majorName}</div>
                    <div class="member-role">${member.role || '成员'}</div>
                `;
                memberGrid.appendChild(memberCard);
            });
        }
        
    } catch (error) {
        console.error('加载团队数据失败:', error);
        memberGrid.innerHTML = '<div class="error">数据加载失败，请稍后重试</div>';
    }
    
    // 切换显示
    departmentIcons.classList.add('hidden');
    departmentDetail.classList.remove('hidden');
}

// 显示照片画廊
function showPhotoGallery(trainingId) {
    const pageContent = document.querySelector('#page9 .page-content');
    const trainingCards = pageContent.querySelector('.training-cards');
    const photoGallery = pageContent.querySelector('.photo-gallery');
    
    // 更新标题
    const galleryTitle = document.getElementById('gallery-title');
    if (trainingId === '1') {
        galleryTitle.textContent = '学生骨干网络思政培训照片';
    } else {
        galleryTitle.textContent = '政务新闻摄影培训作品';
    }
    
    // 生成照片网格
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    for (let i = 1; i <= 6; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="assets/images/gallery${i}.jpg" alt="培训照片 ${i}">
        `;
        galleryGrid.appendChild(galleryItem);
    }
    
    // 切换显示
    trainingCards.classList.add('hidden');
    photoGallery.classList.remove('hidden');
}

// 显示随机语录
function showRandomQuote() {
    const quotes = [
        "人类的进步（内卷）真是就这么发生中。",
        "我希望你们都对世界有一种好奇。",
        "人类的社会性是从这些领域习得的。",
        "去找一些好奇的真的需要去问、去了解 去谈论和得到领导或者专家或者学长学姐指导的事情 而非关起门自己一个人就能做的事情。",
        "可以想象你们用这种作品去PK其他人的时候有多么具有杀伤力)",
        "一起吃瓜一下，不要让我落后于时代。",
        "最近的学术深瓜🍉，距离被删不远了，看得懂的可吃",
        "有人吗，深夜八卦一下",
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('random-quote').textContent = randomQuote;
    document.querySelector('.quote-display').classList.remove('hidden');
}

// 初始化部门轮播
function initDeptSlider() {
    const slider = document.querySelector('.dept-slider');
    const slides = document.querySelectorAll('.dept-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    
    // 更新轮播
    function updateSlider() {
        slider.scrollTo({
            left: currentSlide * slider.offsetWidth,
            behavior: 'smooth'
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 上一张
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });
    
    // 下一张
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });
    
    // 点导航
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // 自动轮播
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 5000);
}

// 显示海报模态框
function showPosterModal() {
    // 更新海报数据
    document.getElementById('poster-identity').textContent = '校园生活记录家';
    document.getElementById('poster-views').textContent = '3,456';
    document.getElementById('poster-likes').textContent = '189';
    document.getElementById('poster-shares').textContent = '87';
    document.getElementById('poster-date').textContent = new Date().toLocaleDateString('zh-CN');
    
    // 显示模态框
    document.querySelector('.poster-modal').classList.remove('hidden');
}

// 下载海报
function downloadPoster() {
    const posterCanvas = document.getElementById('poster-canvas');
    
    html2canvas(posterCanvas).then(canvas => {
        const link = document.createElement('a');
        link.download = '重医年度报告海报.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// 分享报告
function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: '我的2025重医年度报告',
            text: '来看看我在2025年与重医官微的互动记录！',
            url: window.location.href,
        })
        .then(() => console.log('分享成功'))
        .catch(error => console.log('分享失败:', error));
    } else {
        // 备用分享方式
        alert('分享功能在移动端浏览器中可用，请使用分享按钮或复制链接分享给好友！\n\n' + window.location.href);
    }
}

// 邮箱验证
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

