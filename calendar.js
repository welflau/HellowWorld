// calendar.js - 日期点击交互和页面跳转逻辑

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取日期显示元素
    const dateDisplay = document.querySelector('.date-display');
    
    // 为日期显示区域添加点击事件监听器
    if (dateDisplay) {
        // 添加鼠标悬停效果样式
        dateDisplay.style.cursor = 'pointer';
        dateDisplay.style.transition = 'all 0.3s ease';
        
        // 鼠标悬停效果
        dateDisplay.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-50%) scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(29, 78, 216, 0.3)';
            this.style.background = 'rgba(29, 78, 216, 0.1)';
        });
        
        dateDisplay.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(-50%) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            this.style.background = 'rgba(255, 255, 255, 0.9)';
        });
        
        // 点击事件监听器
        dateDisplay.addEventListener('click', function() {
            // 添加点击动画效果
            this.style.transform = 'translateX(-50%) scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) scale(1)';
                // 跳转到全年日历视图
                navigateToYearCalendar();
            }, 150);
        });
    }
    
    // 为现有的月历添加交互功能
    initializeMonthCalendar();
    
    // 添加键盘快捷键支持
    addKeyboardShortcuts();
});

// 跳转到全年日历视图的函数
function navigateToYearCalendar() {
    // 检查是否已存在全年日历视图
    const existingYearView = document.querySelector('.year-calendar-view');
    
    if (existingYearView) {
        // 如果已存在，滚动到该视图
        existingYearView.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        return;
    }
    
    // 创建全年日历视图
    createYearCalendarView();
}

// 创建全年日历视图
function createYearCalendarView() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // 创建年历容器
    const yearCalendarSection = document.createElement('div');
    yearCalendarSection.className = 'year-calendar-view';
    yearCalendarSection.style.cssText = `
        min-height: 100vh;
        background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
        padding: 80px 20px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    // 创建年历标题
    const yearTitle = document.createElement('h2');
    yearTitle.textContent = `${currentYear} 年历`;
    yearTitle.style.cssText = `
        color: white;
        font-size: 3rem;
        margin-bottom: 40px;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        animation: fadeInDown 0.8s ease-out;
    `;
    
    // 创建返回按钮
    const backButton = document.createElement('button');
    backButton.textContent = '← 返回';
    backButton.className = 'back-button';
    backButton.style.cssText = `
        position: fixed;
        top: 30px;
        left: 30px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: bold;
        color: #1d4ed8;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    `;
    
    backButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 创建月份网格容器
    const monthsGrid = document.createElement('div');
    monthsGrid.className = 'months-grid';
    monthsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
        max-width: 1400px;
        width: 100%;
        animation: fadeInUp 1s ease-out;
    `;
    
    // 生成12个月的日历
    const monthNames = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    
    for (let month = 0; month < 12; month++) {
        const monthCalendar = createMonthCalendar(currentYear, month, monthNames[month]);
        monthsGrid.appendChild(monthCalendar);
    }
    
    // 组装年历视图
    yearCalendarSection.appendChild(backButton);
    yearCalendarSection.appendChild(yearTitle);
    yearCalendarSection.appendChild(monthsGrid);
    
    // 添加到页面
    document.body.appendChild(yearCalendarSection);
    
    // 滚动到年历视图
    setTimeout(() => {
        yearCalendarSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
    
    // 添加动画样式
    addYearCalendarAnimations();
}

// 创建单个月份日历
function createMonthCalendar(year, month, monthName) {
    const monthContainer = document.createElement('div');
    monthContainer.className = 'month-calendar';
    monthContainer.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        transition: transform 0.3s ease;
    `;
    
    // 月份标题
    const monthTitle = document.createElement('h3');
    monthTitle.textContent = monthName;
    monthTitle.style.cssText = `
        color: #1d4ed8;
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 15px;
        font-weight: bold;
    `;
    
    // 星期标题
    const weekHeader = document.createElement('div');
    weekHeader.style.cssText = `
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        margin-bottom: 5px;
    `;
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            background: #1d4ed8;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 0.8rem;
            border-radius: 4px;
        `;
        weekHeader.appendChild(dayHeader);
    });
    
    // 日期网格
    const daysGrid = document.createElement('div');
    daysGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    `;
    
    // 生成日期
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.textContent = currentDate.getDate();
        
        const isCurrentMonthDay = currentDate.getMonth() === month;
        const isToday = isCurrentMonth && currentDate.getDate() === todayDate;
        
        dayElement.style.cssText = `
            padding: 8px;
            text-align: center;
            font-size: 0.9rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            ${isCurrentMonthDay ? 'background: white; color: #374151;' : 'background: #f3f4f6; color: #9ca3af;'}
            ${isToday ? 'background: #1d4ed8 !important; color: white !important; font-weight: bold;' : ''}
        `;
        
        if (isCurrentMonthDay) {
            dayElement.addEventListener('mouseenter', function() {
                if (!isToday) {
                    this.style.background = '#e0e7ff';
                    this.style.color = '#1d4ed8';
                }
            });
            
            dayElement.addEventListener('mouseleave', function() {
                if (!isToday) {
                    this.style.background = 'white';
                    this.style.color = '#374151';
                }
            });
            
            dayElement.addEventListener('click', function() {
                showDateInfo(year, month, currentDate.getDate());
            });
        }
        
        daysGrid.appendChild(dayElement);
    }
    
    // 组装月份日历
    monthContainer.appendChild(monthTitle);
    monthContainer.appendChild(weekHeader);
    monthContainer.appendChild(daysGrid);
    
    // 添加悬停效果
    monthContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    monthContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    return monthContainer;
}

// 初始化现有月历的交互功能
function initializeMonthCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        if (day.textContent.trim() && !day.classList.contains('other-month')) {
            day.addEventListener('click', function() {
                // 移除其他日期的选中状态
                calendarDays.forEach(d => d.classList.remove('selected'));
                
                // 添加选中状态
                this.classList.add('selected');
                
                // 显示日期信息
                const dayNumber = parseInt(this.textContent);
                const currentDate = new Date();
                showDateInfo(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
            });
        }
    });
}

// 显示日期信息
function showDateInfo(year, month, day) {
    const date = new Date(year, month, day);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    // 创建或更新日期信息显示
    let dateInfo = document.querySelector('.date-info-popup');
    
    if (!dateInfo) {
        dateInfo = document.createElement('div');
        dateInfo.className = 'date-info-popup';
        dateInfo.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            z-index: 2000;
            text-align: center;
            min-width: 300px;
            animation: popupFadeIn 0.3s ease-out;
        `;
        document.body.appendChild(dateInfo);
    }
    
    dateInfo.innerHTML = `
        <h3 style="color: #1d4ed8; margin-bottom: 15px; font-size: 1.5rem;">
            ${date.toLocaleDateString('zh-CN', options)}
        </h3>
        <p style="color: #64748b; margin-bottom: 20px; font-size: 1.1rem;">
            ${year}年${month + 1}月${day}日
        </p>
        <button onclick="closeDateInfo()" style="
            background: #1d4ed8;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        ">关闭</button>
    `;
    
    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', function closeOnOutside(e) {
            if (!dateInfo.contains(e.target)) {
                closeDateInfo();
                document.removeEventListener('click', closeOnOutside);
            }
        });
    }, 100);
}

// 关闭日期信息弹窗
function closeDateInfo() {
    const dateInfo = document.querySelector('.date-info-popup');
    if (dateInfo) {
        dateInfo.style.animation = 'popupFadeOut 0.3s ease-out';
        setTimeout(() => {
            dateInfo.remove();
        }, 300);
    }
}

// 添加键盘快捷键支持
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC键关闭弹窗
        if (e.key === 'Escape') {
            closeDateInfo();
        }
        
        // Ctrl + Y 快速跳转到年历
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            navigateToYearCalendar();
        }
        
        // Ctrl + H 返回顶部
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// 添加年历动画样式
function addYearCalendarAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes popupFadeIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes popupFadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
        
        .calendar-day.selected {
            background: #1d4ed8 !important;
            color: white !important;
            font-weight: bold;
        }
        
        .back-button:hover {
            background: rgba(255, 255, 255, 1) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
        }
        
        .month-calendar:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
        }
    `;
    
    if (!document.querySelector('#calendar-animations')) {
        style.id = 'calendar-animations';
        document.head.appendChild(style);
    }
}

// 工具函数：获取当前日期信息
function getCurrentDateInfo() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
        day: now.getDay(),
        time: now.toTimeString().split(' ')[0]
    };
}

// 工具函数：格式化日期
function formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

// 导出函数供其他脚本使用
window.CalendarUtils = {
    navigateToYearCalendar,
    getCurrentDateInfo,
    formatDate,
    showDateInfo,
    closeDateInfo
};