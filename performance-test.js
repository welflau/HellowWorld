/**
 * Performance Test Suite for Hello World Page
 * Tests page functionality, performance, and cross-browser compatibility
 */

class PerformanceTest {
    constructor() {
        this.results = {
            performance: {},
            functionality: {},
            compatibility: {},
            accessibility: {}
        };
        this.startTime = performance.now();
    }

    // Initialize all tests
    async runAllTests() {
        console.log('🚀 Starting Performance Test Suite...');
        
        try {
            await this.testPageLoad();
            await this.testResponsiveness();
            await this.testAnimations();
            await this.testAccessibility();
            await this.testBrowserCompatibility();
            await this.testPerformanceMetrics();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    // Test page load performance
    async testPageLoad() {
        console.log('📊 Testing page load performance...');
        
        const loadStart = performance.timing.navigationStart;
        const loadComplete = performance.timing.loadEventEnd;
        const loadTime = loadComplete - loadStart;
        
        this.results.performance.loadTime = loadTime;
        this.results.performance.domContentLoaded = performance.timing.domContentLoadedEventEnd - loadStart;
        
        // Test critical elements
        const container = document.querySelector('.container');
        const helloWorld = document.querySelector('.hello-world');
        
        this.results.functionality.containerExists = !!container;
        this.results.functionality.mainTextExists = !!helloWorld;
        
        console.log(`✅ Page load time: ${loadTime}ms`);
    }

    // Test responsive design
    async testResponsiveness() {
        console.log('📱 Testing responsive design...');
        
        const viewports = [
            { width: 320, height: 568, name: 'Mobile Portrait' },
            { width: 768, height: 1024, name: 'Tablet' },
            { width: 1024, height: 768, name: 'Desktop Small' },
            { width: 1920, height: 1080, name: 'Desktop Large' }
        ];

        const container = document.querySelector('.container');
        const originalWidth = window.innerWidth;
        
        for (const viewport of viewports) {
            // Simulate viewport change
            document.documentElement.style.width = viewport.width + 'px';
            
            const containerRect = container.getBoundingClientRect();
            const isResponsive = containerRect.width <= viewport.width - 40; // 20px margin each side
            
            this.results.functionality[`responsive_${viewport.name.replace(' ', '_')}`] = isResponsive;
            console.log(`${isResponsive ? '✅' : '❌'} ${viewport.name}: ${isResponsive ? 'Responsive' : 'Not Responsive'}`);
        }
        
        // Reset viewport
        document.documentElement.style.width = '';
    }

    // Test animations and interactions
    async testAnimations() {
        console.log('🎭 Testing animations...');
        
        const container = document.querySelector('.container');
        const computedStyle = window.getComputedStyle(container);
        
        // Check if animation is applied
        const hasAnimation = computedStyle.animationName !== 'none';
        this.results.functionality.fadeInAnimation = hasAnimation;
        
        // Test hover effects if any
        const buttons = document.querySelectorAll('button, .btn');
        this.results.functionality.interactiveElements = buttons.length;
        
        console.log(`✅ Animation test completed. Has animations: ${hasAnimation}`);
    }

    // Test accessibility features
    async testAccessibility() {
        console.log('♿ Testing accessibility...');
        
        const checks = {
            hasTitle: !!document.title,
            hasLang: !!document.documentElement.lang,
            hasMetaDescription: !!document.querySelector('meta[name="description"]'),
            hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
            hasSemanticHTML: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
            hasAltTexts: Array.from(document.querySelectorAll('img')).every(img => img.alt !== undefined)
        };
        
        this.results.accessibility = checks;
        
        Object.entries(checks).forEach(([key, value]) => {
            console.log(`${value ? '✅' : '❌'} ${key}: ${value}`);
        });
    }

    // Test browser compatibility
    async testBrowserCompatibility() {
        console.log('🌐 Testing browser compatibility...');
        
        const features = {
            flexbox: CSS.supports('display', 'flex'),
            gridLayout: CSS.supports('display', 'grid'),
            customProperties: CSS.supports('color', 'var(--test)'),
            backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
            gradients: CSS.supports('background', 'linear-gradient(45deg, red, blue)'),
            borderRadius: CSS.supports('border-radius', '10px'),
            boxShadow: CSS.supports('box-shadow', '0 0 10px rgba(0,0,0,0.5)'),
            transforms: CSS.supports('transform', 'translateY(10px)'),
            animations: CSS.supports('animation', 'test 1s ease')
        };
        
        this.results.compatibility = features;
        
        Object.entries(features).forEach(([feature, supported]) => {
            console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported ? 'Supported' : 'Not Supported'}`);
        });
    }

    // Test performance metrics
    async testPerformanceMetrics() {
        console.log('⚡ Testing performance metrics...');
        
        // Memory usage
        if (performance.memory) {
            this.results.performance.memoryUsed = performance.memory.usedJSHeapSize;
            this.results.performance.memoryTotal = performance.memory.totalJSHeapSize;
        }
        
        // Paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            this.results.performance[entry.name.replace('-', '_')] = entry.startTime;
        });
        
        // Resource loading
        const resourceEntries = performance.getEntriesByType('resource');
        this.results.performance.resourceCount = resourceEntries.length;
        this.results.performance.totalResourceSize = resourceEntries.reduce((total, entry) => {
            return total + (entry.transferSize || 0);
        }, 0);
        
        // FPS test (simple)
        let frameCount = 0;
        const fpsStart = performance.now();
        
        const countFrames = () => {
            frameCount++;
            if (performance.now() - fpsStart < 1000) {
                requestAnimationFrame(countFrames);
            } else {
                this.results.performance.fps = frameCount;
                console.log(`✅ Estimated FPS: ${frameCount}`);
            }
        };
        
        requestAnimationFrame(countFrames);
    }

    // Generate comprehensive test report
    generateReport() {
        const endTime = performance.now();
        const totalTestTime = endTime - this.startTime;
        
        console.log('\n📋 PERFORMANCE TEST REPORT');
        console.log('=' .repeat(50));
        
        // Performance Summary
        console.log('\n🚀 PERFORMANCE METRICS:');
        Object.entries(this.results.performance).forEach(([key, value]) => {
            if (typeof value === 'number') {
                const unit = key.includes('Time') || key.includes('paint') ? 'ms' : 
                           key.includes('Size') || key.includes('memory') ? 'bytes' : '';
                console.log(`  ${key}: ${Math.round(value)}${unit}`);
            }
        });
        
        // Functionality Summary
        console.log('\n⚙️ FUNCTIONALITY TESTS:');
        Object.entries(this.results.functionality).forEach(([key, value]) => {
            console.log(`  ${value ? '✅' : '❌'} ${key}: ${value}`);
        });
        
        // Accessibility Summary
        console.log('\n♿ ACCESSIBILITY TESTS:');
        const accessibilityScore = Object.values(this.results.accessibility).filter(Boolean).length;
        const totalAccessibilityTests = Object.keys(this.results.accessibility).length;
        console.log(`  Score: ${accessibilityScore}/${totalAccessibilityTests}`);
        
        // Compatibility Summary
        console.log('\n🌐 BROWSER COMPATIBILITY:');
        const compatibilityScore = Object.values(this.results.compatibility).filter(Boolean).length;
        const totalCompatibilityTests = Object.keys(this.results.compatibility).length;
        console.log(`  Score: ${compatibilityScore}/${totalCompatibilityTests}`);
        
        // Overall Score
        const overallScore = this.calculateOverallScore();
        console.log(`\n🏆 OVERALL SCORE: ${overallScore}/100`);
        console.log(`⏱️ Total test time: ${Math.round(totalTestTime)}ms`);
        
        // Recommendations
        this.generateRecommendations();
    }

    // Calculate overall performance score
    calculateOverallScore() {
        let score = 0;
        
        // Performance score (30 points)
        const loadTime = this.results.performance.loadTime;
        if (loadTime < 1000) score += 30;
        else if (loadTime < 2000) score += 20;
        else if (loadTime < 3000) score += 10;
        
        // Functionality score (25 points)
        const functionalityPassed = Object.values(this.results.functionality).filter(v => v === true).length;
        const totalFunctionality = Object.keys(this.results.functionality).length;
        score += Math.round((functionalityPassed / totalFunctionality) * 25);
        
        // Accessibility score (25 points)
        const accessibilityPassed = Object.values(this.results.accessibility).filter(Boolean).length;
        const totalAccessibility = Object.keys(this.results.accessibility).length;
        score += Math.round((accessibilityPassed / totalAccessibility) * 25);
        
        // Compatibility score (20 points)
        const compatibilityPassed = Object.values(this.results.compatibility).filter(Boolean).length;
        const totalCompatibility = Object.keys(this.results.compatibility).length;
        score += Math.round((compatibilityPassed / totalCompatibility) * 20);
        
        return Math.min(score, 100);
    }

    // Generate optimization recommendations
    generateRecommendations() {
        console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
        
        const recommendations = [];
        
        if (this.results.performance.loadTime > 2000) {
            recommendations.push('Consider optimizing images and reducing file sizes');
        }
        
        if (!this.results.accessibility.hasSemanticHTML) {
            recommendations.push('Add semantic HTML elements (h1, h2, etc.)');
        }
        
        if (!this.results.compatibility.backdropFilter) {
            recommendations.push('Provide fallback for backdrop-filter property');
        }
        
        if (this.results.performance.resourceCount > 10) {
            recommendations.push('Consider bundling resources to reduce HTTP requests');
        }
        
        if (recommendations.length === 0) {
            console.log('  🎉 Great job! No major optimizations needed.');
        } else {
            recommendations.forEach((rec, index) => {
                console.log(`  ${index + 1}. ${rec}`);
            });
        }
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all resources to load
    setTimeout(() => {
        const testSuite = new PerformanceTest();
        testSuite.runAllTests();
    }, 1000);
});

// Export for manual testing
window.PerformanceTest = PerformanceTest;

// Additional utility functions for manual testing
window.testUtils = {
    // Test specific viewport
    testViewport: (width, height) => {
        window.resizeTo(width, height);
        console.log(`Viewport changed to ${width}x${height}`);
    },
    
    // Measure specific element performance
    measureElement: (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            console.log('Element metrics:', {
                selector,
                dimensions: `${rect.width}x${rect.height}`,
                position: `${rect.left}, ${rect.top}`,
                visibility: styles.visibility,
                display: styles.display
            });
        }
    },
    
    // Test color contrast
    testContrast: (element1, element2) => {
        const style1 = window.getComputedStyle(element1);
        const style2 = window.getComputedStyle(element2);
        console.log('Color contrast test:', {
            element1: style1.color,
            element2: style2.backgroundColor
        });
    }
};