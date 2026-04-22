// calendar.js - 日期点击交互和页面跳转逻辑

class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.setupDateClickHandlers();
        this.createCalendarModal();
        this.setupKeyboardShortcuts();
    }

    // 为顶部日期显示区域添加点击事件监听器
    setupDateClickHandlers() {
        const dateDisplay = document.getElementById('dateDisplay');
        const weekdayDisplay = document.getElementById('weekdayDisplay');
        
        if (dateDisplay) {
            dateDisplay.style.cursor = 'pointer';
            dateDisplay.style.transition = 'all 0.3s ease';
            
            // 添加悬停效果
            dateDisplay.addEventListener('mouseenter', () => {
                dateDisplay.style.transform = 'translateX(-50%) scale(1.05)';
                dateDisplay.style.boxShadow = '0 6px 20px rgba(29, 78, 216, 0.3)';
            });
            
            dateDisplay.addEventListener('mouseleave', () => {
                dateDisplay.style.transform = 'translateX(-50%) scale(1)';
                dateDisplay.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            });
            
            // 点击事件 - 跳转到全年日历视图
            dateDisplay.addEventListener('click', (e) => {
                e.preventDefault();
                this.showYearCalendar();
            });
        }

        if (weekdayDisplay) {
            weekdayDisplay.style.cursor = 'pointer';
            weekdayDisplay.style.transition = 'all 0.3s ease';
            
            // 添加悬停效果
            weekdayDisplay.addEventListener('mouseenter', () => {
                weekdayDisplay.style.transform = 'scale(1.05)';
                weekdayDisplay.style.boxShadow = '0 6px 20px rgba(29, 78, 216, 0.3)';
            });
            
            weekdayDisplay.addEventListener('mouseleave', () => {
                weekdayDisplay.style.transform = 'scale(1)';
                weekdayDisplay.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            });
            
            // 点击事件 - 跳转到月历视图
            weekdayDisplay.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMonthCalendar();
            });
        }
    }

    // 创建日历模态框
    createCalendarModal() {
        const modalHTML = `
            <div id="calendarModal" class="calendar-modal" style="display: none;">
                <div class="calendar-overlay"></div>
                <div class="calendar-content">
                    <div class="calendar-header">
                        <button class="calendar-nav-btn" id="prevYear">‹‹</button>
                        <button class="calendar-nav-btn" id="prevMonth">‹</button>
                        <h2 class="calendar-title" id="calendarTitle"></h2>
                        <button class="calendar-nav-btn" id="nextMonth">›</button>
                        <button class="calendar-nav-btn" id="nextYear">››</button>
                        <button class="calendar-close-btn" id="closeCalendar">×</button>
                    </div>
                    <div class="calendar-view-toggle">
                        <button class="view-toggle-btn active" id="monthView">月视图</button>
                        <button class="view-toggle-btn" id="yearView">年视图</button>
                    </div>
                    <div class="calendar-body" id="calendarBody"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addCalendarStyles();
        this.setupModalEventListeners();
    }

    // 添加日历样式
    addCalendarStyles() {
        const styles = `
            <style>
                .calendar-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .calendar-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                
                .calendar-content {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: hidden;
                    animation: modalFadeIn 0.3s ease-out;
                }
                
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .calendar-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 30px;
                    background: linear-gradient(45deg, #1d4ed8, #3730a3);
                    color: white;
                    position: relative;
                }
                
                .calendar-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0;
                    flex: 1;
                    text-align: center;
                }
                
                .calendar-nav-btn, .calendar-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .calendar-nav-btn:hover, .calendar-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .calendar-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 1.5rem;
                }
                
                .calendar-view-toggle {
                    display: flex;
                    padding: 15px 30px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .view-toggle-btn {
                    background: transparent;
                    border: 2px solid #e2e8f0;
                    padding: 8px 16px;
                    margin-right: 10px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                    color: #64748b;
                    transition: all 0.3s ease;
                }
                
                .view-toggle-btn.active {
                    background: #1d4ed8;
                    border-color: #1d4ed8;
                    color: white;
                }
                
                .view-toggle-btn:hover:not(.active) {
                    border-color: #1d4ed8;
                    color: #1d4ed8;
                }
                
                .calendar-body {
                    padding: 30px;
                    min-height: 400px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .month-calendar {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .calendar-day-header {
                    text-align: center;
                    font-weight: bold;
                    color: #1d4ed8;
                    padding: 10px;
                    font-size: 0.9rem;
                }
                
                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    position: relative;
                }
                
                .calendar-day:hover {
                    background: #e0e7ff;
                    transform: scale(1.1);
                }
                
                .calendar-day.today {
                    background: #1d4ed8;
                    color: white;
                }
                
                .calendar-day.other-month {
                    color: #cbd5e1;
                }
                
                .year-calendar {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .year-month {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 15px;
                    background: #fafafa;
                }
                
                .year-month-title {
                    text-align: center;
                    font-weight: bold;
                    color: #1d4ed8;
                    margin-bottom: 10px;
                    font-size: 1.1rem;
                }
                
                .year-month-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 3px;
                }
                
                .year-day-header {
                    text-align: center;
                    font-size: 0.7rem;
                    font-weight: bold;
                    color: #64748b;
                    padding: 3px;
                }
                
                .year-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .year-day:hover {
                    background: #e0e7ff;
                }
                
                .year-day.today {
                    background: #1d4ed8;
                    color: white;
                    font-weight: bold;
                }
                
                .year-day.other-month {
                    color: #cbd5e1;
                }
                
                @media (max-width: 768px) {
                    .calendar-content {
                        max-width: 95vw;
                        max-height: 95vh;
                    }
                    
                    .calendar-header {
                        padding: 15px 20px;
                    }
                    
                    .calendar-title {
                        font-size: 1.2rem;
                    }
                    
                    .calendar-body {
                        padding: 20px;
                    }
                    
                    .year-calendar {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // 设置模态框事件监听器
    setupModalEventListeners() {
        const modal = document.getElementById('calendarModal');
        const overlay = modal.querySelector('.calendar-overlay');
        const closeBtn = document.getElementById('closeCalendar');
        const prevYear = document.getElementById('prevYear');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const nextYear = document.getElementById('nextYear');
        const monthViewBtn = document.getElementById('monthView');
        const yearViewBtn = document.getElementById('yearView');

        // 关闭模态框
        overlay.addEventListener('click', () => this.hideCalendar());
        closeBtn.addEventListener('click', () => this.hideCalendar());

        // 导航按钮
        prevYear.addEventListener('click', () => this.navigateYear(-1));
        prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        nextMonth.addEventListener('click', () => this.navigateMonth(1));
        nextYear.addEventListener('click', () => this.navigateYear(1));

        // 视图切换
        monthViewBtn.addEventListener('click', () => this.switchView('month'));
        yearViewBtn.addEventListener('click', () => this.switchView('year'));
    }

    // 设置键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('calendarModal');
            if (modal.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        this.hideCalendar();
                        break;
                    case 'ArrowLeft':
                        if (e.ctrlKey) this.navigateYear(-1);
                        else this.navigateMonth(-1);
                        break;
                    case 'ArrowRight':
                        if (e.ctrlKey) this.navigateYear(1);
                        else this.navigateMonth(1);
                        break;
                    case 'ArrowUp':
                        this.switchView('year');
                        break;
                    case 'ArrowDown':
                        this.switchView('month');
                        break;
                }
            } else {
                // 全局快捷键
                if (e.ctrlKey && e.key === 'k') {
                    e.preventDefault();
                    this.showYearCalendar();
                }
            }
        });
    }

    // 显示年历视图
    showYearCalendar() {
        const modal = document.getElementById('calendarModal');
        modal.style.display = 'flex';
        this.currentView = 'year';
        this.updateCalendarDisplay();
        
        // 添加显示动画
        requestAnimationFrame(() => {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            modal.animate([
                { opacity: '0', transform: 'scale(0.9)' },
                { opacity: '1', transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            });
        });
    }

    // 显示月历视图
    showMonthCalendar() {
        const modal = document.getElementById('calendarModal');
        modal.style.display = 'flex';
        this.currentView = 'month';
        this.updateCalendarDisplay();
    }

    // 隐藏日历
    hideCalendar() {
        const modal = document.getElementById('calendarModal');
        modal.animate([
            { opacity: '1', transform: 'scale(1)' },
            { opacity: '0', transform: 'scale(0.9)' }
        ], {
            duration: 200,
            easing: 'ease-in'
        }).addEventListener('finish', () => {
            modal.style.display = 'none';
        });
    }

    // 切换视图
    switchView(view) {
        this.currentView = view;
        const monthBtn = document.getElementById('monthView');
        const yearBtn = document.getElementById('yearView');
        
        if (view === 'month') {
            monthBtn.classList.add('active');
            yearBtn.classList.remove('active');
        } else {
            yearBtn.classList.add('active');
            monthBtn.classList.remove('active');
        }
        
        this.updateCalendarDisplay();
    }

    // 导航月份
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendarDisplay();
    }

    // 导航年份
    navigateYear(direction) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + direction);
        this.updateCalendarDisplay();
    }

    // 更新日历显示
    updateCalendarDisplay() {
        const title = document.getElementById('calendarTitle');
        const body = document.getElementById('calendarBody');
        
        if (this.currentView === 'year') {
            title.textContent = `${this.currentDate.getFullYear()}年`;
            body.innerHTML = this.generateYearView();
        } else {
            title.textContent = `${this.currentDate.getFullYear()}年 ${this.currentDate.getMonth() + 1}月`;
            body.innerHTML = this.generateMonthView();
        }
    }

    // 生成月视图
    generateMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = '<div class="month-calendar">';
        
        // 星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // 日期
        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = currentDate.getMonth() === month;
            const isToday = currentDate.toDateString() === today.toDateString();
            const dayClass = `calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
            
            html += `<div class="${dayClass}" data-date="${currentDate.toISOString()}">${currentDate.getDate()}</div>`;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        html += '</div>';
        return html;
    }

    // 生成年视图
    generateYearView() {
        const year = this.currentDate.getFullYear();
        const today = new Date();
        let html = '<div class="year-calendar">';

        for (let month = 0; month < 12; month++) {
            const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                              '七月', '八月', '九月', '十月', '十一月', '十二月'];
            
            html += `<div class="year-month">`;
            html += `<div class="year-month-title">${monthNames[month]}</div>`;
            html += `<div class="year-month-grid">`;
            
            // 星期标题
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            weekdays.forEach(day => {
                html += `<div class="year-day-header">${day}</div>`;
            });

            // 月份日期
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());

            const currentDate = new Date(startDate);
            for (let i = 0; i < 42; i++) {
                const isCurrentMonth = currentDate.getMonth() === month;
                const isToday = currentDate.toDateString() === today.toDateString();
                const dayClass = `year-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
                
                html += `<div class="${dayClass}" data-date="${currentDate.toISOString()}">${currentDate.getDate()}</div>`;
                currentDate.setDate(currentDate.getDate() + 1);
                
                if (i === 34 && currentDate.getMonth() !== month) break; // 优化显示
            }

            html += `</div></div>`;
        }

        html += '</div>';
        return html;
    }
}

// 页面加载完成后初始化日历管理器
document.addEventListener('DOMContentLoaded', () => {
    window.calendarManager = new CalendarManager();
    
    // 添加一些额外的交互提示
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        dateDisplay.title = '点击查看全年日历 (Ctrl+K)';
    }
    
    const weekdayDisplay = document.getElementById('weekdayDisplay');
    if (weekdayDisplay) {
        weekdayDisplay.title = '点击查看月历';
    }
});

// 导出日历管理器类，供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalendarManager;
}