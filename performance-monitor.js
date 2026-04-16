/**
 * Performance Monitor - 页面性能监控和优化工具
 * 用于监控 HelloWorld 网页的性能指标，确保在不同浏览器和设备上的最佳表现
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.isSupported = this.checkSupport();
        this.init();
    }

    // 检查浏览器支持情况
    checkSupport() {
        return {
            performanceAPI: 'performance' in window,
            observer: 'PerformanceObserver' in window,
            navigation: 'navigation' in performance,
            memory: 'memory' in performance,
            connection: 'connection' in navigator
        };
    }

    // 初始化性能监控
    init() {
        if (!this.isSupported.performanceAPI) {
            console.warn('Performance API not supported');
            return;
        }

        this.startMonitoring();
        this.setupEventListeners();
        
        // 页面加载完成后收集初始指标
        if (document.readyState === 'complete') {
            this.collectInitialMetrics();
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.collectInitialMetrics(), 100);
            });
        }
    }

    // 开始监控
    startMonitoring() {
        // 监控导航时间
        this.observeNavigation();
        
        // 监控资源加载
        this.observeResources();
        
        // 监控长任务
        this.observeLongTasks();
        
        // 监控布局偏移
        this.observeLayoutShift();
        
        // 监控最大内容绘制
        this.observeLCP();
        
        // 监控首次输入延迟
        this.observeFID();
    }

    // 监控导航性能
    observeNavigation() {
        if (!this.isSupported.observer) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.metrics.navigation = {
                            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                            loadComplete: entry.loadEventEnd - entry.loadEventStart,
                            domInteractive: entry.domInteractive - entry.fetchStart,
                            firstPaint: this.getFirstPaint(),
                            firstContentfulPaint: this.getFirstContentfulPaint()
                        };
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('Navigation timing not supported:', e);
        }
    }

    // 监控资源加载
    observeResources() {
        if (!this.isSupported.observer) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                this.metrics.resources = entries.map(entry => ({
                    name: entry.name,
                    type: entry.initiatorType,
                    size: entry.transferSize || 0,
                    duration: entry.duration,
                    startTime: entry.startTime
                }));
            });
            
            observer.observe({ entryTypes: ['resource'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('Resource timing not supported:', e);
        }
    }

    // 监控长任务
    observeLongTasks() {
        if (!this.isSupported.observer) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (!this.metrics.longTasks) this.metrics.longTasks = [];
                
                entries.forEach(entry => {
                    this.metrics.longTasks.push({
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('Long task monitoring not supported:', e);
        }
    }

    // 监控累积布局偏移 (CLS)
    observeLayoutShift() {
        if (!this.isSupported.observer) return;

        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('Layout shift monitoring not supported:', e);
        }
    }

    // 监控最大内容绘制 (LCP)
    observeLCP() {
        if (!this.isSupported.observer) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('LCP monitoring not supported:', e);
        }
    }

    // 监控首次输入延迟 (FID)
    observeFID() {
        if (!this.isSupported.observer) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        } catch (e) {
            console.warn('FID monitoring not supported:', e);
        }
    }

    // 获取首次绘制时间
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
        return fpEntry ? fpEntry.startTime : null;
    }

    // 获取首次内容绘制时间
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcpEntry ? fcpEntry.startTime : null;
    }

    // 收集初始性能指标
    collectInitialMetrics() {
        // 收集内存使用情况
        if (this.isSupported.memory) {
            this.metrics.memory = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }

        // 收集网络连接信息
        if (this.isSupported.connection) {
            this.metrics.connection = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }

        // 收集设备信息
        this.metrics.device = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio || 1
        };

        // 计算性能评分
        this.calculatePerformanceScore();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监控页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.metrics.visibilityChanges = this.metrics.visibilityChanges || [];
            this.metrics.visibilityChanges.push({
                timestamp: performance.now(),
                hidden: document.hidden
            });
        });

        // 监控错误
        window.addEventListener('error', (event) => {
            this.metrics.errors = this.metrics.errors || [];
            this.metrics.errors.push({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: performance.now()
            });
        });

        // 监控未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.unhandledRejections = this.metrics.unhandledRejections || [];
            this.metrics.unhandledRejections.push({
                reason: event.reason,
                timestamp: performance.now()
            });
        });
    }

    // 计算性能评分
    calculatePerformanceScore() {
        let score = 100;
        const weights = {
            fcp: 0.15,
            lcp: 0.25,
            fid: 0.25,
            cls: 0.15,
            loadTime: 0.20
        };

        // FCP评分 (首次内容绘制)
        const fcp = this.metrics.navigation?.firstContentfulPaint || 0;
        if (fcp > 3000) score -= weights.fcp * 40;
        else if (fcp > 1800) score -= weights.fcp * 20;

        // LCP评分 (最大内容绘制)
        const lcp = this.metrics.lcp || 0;
        if (lcp > 4000) score -= weights.lcp * 40;
        else if (lcp > 2500) score -= weights.lcp * 20;

        // FID评分 (首次输入延迟)
        const fid = this.metrics.fid || 0;
        if (fid > 300) score -= weights.fid * 40;
        else if (fid > 100) score -= weights.fid * 20;

        // CLS评分 (累积布局偏移)
        const cls = this.metrics.cls || 0;
        if (cls > 0.25) score -= weights.cls * 40;
        else if (cls > 0.1) score -= weights.cls * 20;

        // 加载时间评分
        const loadTime = this.metrics.navigation?.loadComplete || 0;
        if (loadTime > 3000) score -= weights.loadTime * 40;
        else if (loadTime > 1500) score -= weights.loadTime * 20;

        this.metrics.performanceScore = Math.max(0, Math.round(score));
    }

    // 获取性能报告
    getPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metrics: this.metrics,
            recommendations: this.getRecommendations(),
            browserSupport: this.isSupported
        };
    }

    // 获取优化建议
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.navigation?.firstContentfulPaint > 1800) {
            recommendations.push('优化首次内容绘制时间：考虑减少关键资源大小或使用资源预加载');
        }
        
        if (this.metrics.lcp > 2500) {
            recommendations.push('优化最大内容绘制：优化图片大小和格式，使用CDN加速');
        }
        
        if (this.metrics.fid > 100) {
            recommendations.push('减少首次输入延迟：优化JavaScript执行，避免长任务阻塞主线程');
        }
        
        if (this.metrics.cls > 0.1) {
            recommendations.push('减少累积布局偏移：为图片和广告设置尺寸属性，避免动态内容插入');
        }
        
        if (this.metrics.longTasks?.length > 0) {
            recommendations.push('优化长任务：将大型JavaScript任务分解为较小的块');
        }
        
        if (this.metrics.resources?.some(r => r.size > 1000000)) {
            recommendations.push('优化资源大小：压缩大型资源文件，启用gzip压缩');
        }

        return recommendations;
    }

    // 生成性能报告HTML
    generateReportHTML() {
        const report = this.getPerformanceReport();
        
        return `
        <div class="performance-report" style="
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">
                性能监控报告
            </h2>
            
            <div class="score-section" style="text-align: center; margin-bottom: 30px;">
                <div style="
                    display: inline-block;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: ${this.getScoreColor(report.metrics.performanceScore)};
                    color: white;
                    line-height: 120px;
                    font-size: 24px;
                    font-weight: bold;
                ">
                    ${report.metrics.performanceScore || 'N/A'}
                </div>
                <p style="margin-top: 10px; color: #666;">性能评分</p>
            </div>
            
            <div class="metrics-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            ">
                ${this.generateMetricCards(report.metrics)}
            </div>
            
            <div class="recommendations" style="margin-bottom: 20px;">
                <h3 style="color: #333; margin-bottom: 15px;">优化建议</h3>
                <ul style="color: #666; line-height: 1.6;">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="device-info" style="font-size: 12px; color: #999;">
                <p>设备信息: ${report.metrics.device?.userAgent || 'Unknown'}</p>
                <p>生成时间: ${report.timestamp}</p>
            </div>
        </div>
        `;
    }

    // 生成指标卡片
    generateMetricCards(metrics) {
        const cards = [];
        
        if (metrics.navigation?.firstContentfulPaint) {
            cards.push(this.createMetricCard('FCP', `${Math.round(metrics.navigation.firstContentfulPaint)}ms`, 'success'));
        }
        
        if (metrics.lcp) {
            cards.push(this.createMetricCard('LCP', `${Math.round(metrics.lcp)}ms`, 'info'));
        }
        
        if (metrics.fid) {
            cards.push(this.createMetricCard('FID', `${Math.round(metrics.fid)}ms`, 'warning'));
        }
        
        if (metrics.cls) {
            cards.push(this.createMetricCard('CLS', metrics.cls.toFixed(3), 'error'));
        }
        
        return cards.join('');
    }

    // 创建指标卡片
    createMetricCard(title, value, type) {
        const colors = {
            success: '#4CAF50',
            info: '#2196F3',
            warning: '#FF9800',
            error: '#F44336'
        };
        
        return `
        <div style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 20px; font-weight: bold; color: #333;">${value}</div>
        </div>
        `;
    }

    // 获取评分颜色
    getScoreColor(score) {
        if (score >= 90) return 'linear-gradient(135deg, #4CAF50, #45a049)';
        if (score >= 70) return 'linear-gradient(135deg, #FF9800, #f57c00)';
        return 'linear-gradient(135deg, #F44336, #d32f2f)';
    }

    // 显示性能报告
    showReport() {
        const reportHTML = this.generateReportHTML();
        const reportWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>性能监控报告</title>
                <meta charset="UTF-8">
            </head>
            <body>
                ${reportHTML}
            </body>
            </html>
        `);
        reportWindow.document.close();
    }

    // 导出性能数据
    exportData(format = 'json') {
        const report = this.getPerformanceReport();
        
        if (format === 'json') {
            const dataStr = JSON.stringify(report, null, 2);
            this.downloadFile(dataStr, 'performance-report.json', 'application/json');
        } else if (format === 'csv') {
            const csvData = this.convertToCSV(report);
            this.downloadFile(csvData, 'performance-report.csv', 'text/csv');
        }
    }

    // 转换为CSV格式
    convertToCSV(report) {
        const rows = [
            ['Metric', 'Value', 'Unit'],
            ['Performance Score', report.metrics.performanceScore || 'N/A', 'score'],
            ['First Contentful Paint', report.metrics.navigation?.firstContentfulPaint || 'N/A', 'ms'],
            ['Largest Contentful Paint', report.metrics.lcp || 'N/A', 'ms'],
            ['First Input Delay', report.metrics.fid || 'N/A', 'ms'],
            ['Cumulative Layout Shift', report.metrics.cls || 'N/A', 'score'],
            ['Load Complete', report.metrics.navigation?.loadComplete || 'N/A', 'ms']
        ];
        
        return rows.map(row => row.join(',')).join('\n');
    }

    // 下载文件
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 清理监控器
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
        this.metrics = {};
    }
}

// 自动初始化性能监控
const performanceMonitor = new PerformanceMonitor();

// 添加全局方法
window.showPerformanceReport = () => performanceMonitor.showReport();
window.exportPerformanceData = (format) => performanceMonitor.exportData(format);
window.getPerformanceMetrics = () => performanceMonitor.getPerformanceReport();

// 在控制台显示快速访问提示
console.log('%c🚀 Performance Monitor Loaded', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
console.log('%c📊 Use showPerformanceReport() to view detailed report', 'color: #2196F3; font-size: 12px;');
console.log('%c💾 Use exportPerformanceData("json") or exportPerformanceData("csv") to export data', 'color: #FF9800; font-size: 12px;');
console.log('%c📈 Use getPerformanceMetrics() to get raw metrics data', 'color: #9C27B0; font-size: 12px;');

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    performanceMonitor.destroy();
});