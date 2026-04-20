// clock.js - 数字时钟组件
// 用途：在HelloWorld页面左上角显示实时数字时钟

class DigitalClock {
    constructor() {
        this.clockElement = null;
        this.intervalId = null;
        this.init();
    }

    // 初始化时钟
    init() {
        this.createClockElement();
        this.startClock();
    }

    // 创建时钟DOM元素
    createClockElement() {
        // 检查是否已存在时钟元素
        if (document.querySelector('.digital-clock')) {
            return;
        }

        this.clockElement = document.createElement('div');
        this.clockElement.className = 'digital-clock';
        this.clockElement.setAttribute('aria-label', '当前时间');
        
        // 插入到body的开头
        document.body.insertBefore(this.clockElement, document.body.firstChild);
    }

    // 格式化时间为HH:MM:SS格式
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // 更新时钟显示
    updateClock() {
        if (this.clockElement) {
            const now = new Date();
            const timeString = this.formatTime(now);
            this.clockElement.textContent = timeString;
        }
    }

    // 启动时钟
    startClock() {
        // 立即显示当前时间
        this.updateClock();
        
        // 每秒更新一次
        this.intervalId = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    // 停止时钟
    stopClock() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // 销毁时钟
    destroy() {
        this.stopClock();
        if (this.clockElement && this.clockElement.parentNode) {
            this.clockElement.parentNode.removeChild(this.clockElement);
        }
        this.clockElement = null;
    }
}

// 页面加载完成后自动启动时钟
document.addEventListener('DOMContentLoaded', function() {
    // 创建全局时钟实例
    window.digitalClock = new DigitalClock();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', function() {
    if (window.digitalClock) {
        window.digitalClock.destroy();
    }
});

// 页面可见性变化时的处理（优化性能）
document.addEventListener('visibilitychange', function() {
    if (window.digitalClock) {
        if (document.hidden) {
            // 页面隐藏时停止时钟更新
            window.digitalClock.stopClock();
        } else {
            // 页面显示时重新启动时钟
            window.digitalClock.startClock();
        }
    }
});

// 导出类以便其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DigitalClock;
}