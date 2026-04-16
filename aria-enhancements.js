/**
 * ARIA Enhancements for Hello World Page
 * Improves accessibility and provides comprehensive testing utilities
 * Author: Developer
 * Version: 1.0.0
 */

class AriaEnhancements {
    constructor() {
        this.isInitialized = false;
        this.testResults = [];
        this.performanceMetrics = {};
        this.browserInfo = this.getBrowserInfo();
        this.deviceInfo = this.getDeviceInfo();
        
        this.init();
    }

    /**
     * Initialize ARIA enhancements and testing suite
     */
    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceAccessibility();
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.runCompatibilityTests();
            this.measurePerformance();
            this.setupResponsiveTests();
            this.createTestingPanel();
            this.isInitialized = true;
            
            console.log('ARIA Enhancements initialized successfully');
        });
    }

    /**
     * Enhance page accessibility with ARIA attributes
     */
    enhanceAccessibility() {
        const container = document.querySelector('.container');
        const helloWorld = document.querySelector('.hello-world');
        const subtitle = document.querySelector('.subtitle');
        const button = document.querySelector('.cta-button');

        // Add ARIA landmarks and roles
        if (container) {
            container.setAttribute('role', 'main');
            container.setAttribute('aria-label', 'Hello World Welcome Section');
        }

        if (helloWorld) {
            helloWorld.setAttribute('role', 'heading');
            helloWorld.setAttribute('aria-level', '1');
            helloWorld.setAttribute('aria-label', 'Hello World - Main Heading');
        }

        if (subtitle) {
            subtitle.setAttribute('role', 'text');
            subtitle.setAttribute('aria-describedby', 'main-content');
        }

        if (button) {
            button.setAttribute('aria-label', 'Get started with our application');
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
        }

        // Add skip navigation
        this.addSkipNavigation();
        
        // Add live region for dynamic content
        this.createLiveRegion();
    }

    /**
     * Add skip navigation for screen readers
     */
    addSkipNavigation() {
        const skipNav = document.createElement('a');
        skipNav.href = '#main-content';
        skipNav.textContent = 'Skip to main content';
        skipNav.className = 'skip-nav';
        skipNav.setAttribute('aria-label', 'Skip to main content');
        
        const skipNavStyles = `
            .skip-nav {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
                transition: top 0.3s;
            }
            .skip-nav:focus {
                top: 6px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = skipNavStyles;
        document.head.appendChild(style);
        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    /**
     * Create live region for announcements
     */
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const focusableElements = this.getFocusableElements();
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

            switch (e.key) {
                case 'Tab':
                    // Enhanced tab navigation
                    this.handleTabNavigation(e, focusableElements, currentIndex);
                    break;
                case 'Enter':
                case ' ':
                    // Activate buttons with keyboard
                    if (document.activeElement.classList.contains('cta-button')) {
                        e.preventDefault();
                        document.activeElement.click();
                    }
                    break;
                case 'Escape':
                    // Close any modals or return focus to main content
                    this.handleEscapeKey();
                    break;
            }
        });
    }

    /**
     * Get all focusable elements
     */
    getFocusableElements() {
        return document.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
    }

    /**
     * Handle tab navigation
     */
    handleTabNavigation(e, focusableElements, currentIndex) {
        if (focusableElements.length === 0) return;

        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0) {
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex >= focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[0].focus();
            }
        }
    }

    /**
     * Handle escape key
     */
    handleEscapeKey() {
        const mainContent = document.querySelector('[role="main"]');
        if (mainContent) {
            mainContent.focus();
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Add focus indicators
        const focusStyles = `
            *:focus {
                outline: 3px solid #4A90E2;
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            .focus-visible {
                outline: 3px solid #4A90E2;
                outline-offset: 2px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = focusStyles;
        document.head.appendChild(style);

        // Track focus for analytics
        document.addEventListener('focusin', (e) => {
            this.announceToScreenReader(`Focused on ${e.target.tagName.toLowerCase()}`);
        });
    }

    /**
     * Run browser compatibility tests
     */
    runCompatibilityTests() {
        const tests = [
            this.testCSS3Support(),
            this.testFlexboxSupport(),
            this.testGridSupport(),
            this.testES6Support(),
            this.testLocalStorageSupport(),
            this.testTouchSupport(),
            this.testMediaQuerySupport(),
            this.testAnimationSupport()
        ];

        this.testResults = tests;
        this.logTestResults();
    }

    /**
     * Test CSS3 support
     */
    testCSS3Support() {
        const element = document.createElement('div');
        element.style.borderRadius = '10px';
        return {
            name: 'CSS3 Border Radius',
            passed: element.style.borderRadius === '10px',
            critical: false
        };
    }

    /**
     * Test Flexbox support
     */
    testFlexboxSupport() {
        const element = document.createElement('div');
        element.style.display = 'flex';
        return {
            name: 'CSS Flexbox',
            passed: element.style.display === 'flex',
            critical: true
        };
    }

    /**
     * Test CSS Grid support
     */
    testGridSupport() {
        const element = document.createElement('div');
        element.style.display = 'grid';
        return {
            name: 'CSS Grid',
            passed: element.style.display === 'grid',
            critical: false
        };
    }

    /**
     * Test ES6 support
     */
    testES6Support() {
        let supported = true;
        try {
            eval('const test = () => {}');
        } catch (e) {
            supported = false;
        }
        return {
            name: 'ES6 Arrow Functions',
            passed: supported,
            critical: true
        };
    }

    /**
     * Test localStorage support
     */
    testLocalStorageSupport() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return {
                name: 'Local Storage',
                passed: true,
                critical: false
            };
        } catch (e) {
            return {
                name: 'Local Storage',
                passed: false,
                critical: false
            };
        }
    }

    /**
     * Test touch support
     */
    testTouchSupport() {
        return {
            name: 'Touch Events',
            passed: 'ontouchstart' in window,
            critical: false
        };
    }

    /**
     * Test media query support
     */
    testMediaQuerySupport() {
        return {
            name: 'Media Queries',
            passed: window.matchMedia && window.matchMedia('(min-width: 0px)').matches,
            critical: true
        };
    }

    /**
     * Test animation support
     */
    testAnimationSupport() {
        const element = document.createElement('div');
        const prefixes = ['animation', 'webkitAnimation', 'mozAnimation', 'oAnimation'];
        const supported = prefixes.some(prefix => element.style[prefix] !== undefined);
        
        return {
            name: 'CSS Animations',
            passed: supported,
            critical: false
        };
    }

    /**
     * Measure performance metrics
     */
    measurePerformance() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.performanceMetrics = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart
            };

            this.measureRenderPerformance();
        }
    }

    /**
     * Measure render performance
     */
    measureRenderPerformance() {
        if ('requestAnimationFrame' in window) {
            const startTime = performance.now();
            requestAnimationFrame(() => {
                const endTime = performance.now();
                this.performanceMetrics.renderTime = endTime - startTime;
            });
        }
    }

    /**
     * Setup responsive design tests
     */
    setupResponsiveTests() {
        const breakpoints = [
            { name: 'Mobile', width: 320 },
            { name: 'Mobile Large', width: 480 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1024 },
            { name: 'Large Desktop', width: 1200 }
        ];

        breakpoints.forEach(bp => {
            const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`);
            mediaQuery.addListener(() => {
                this.handleBreakpointChange(bp.name, mediaQuery.matches);
            });
        });
    }

    /**
     * Handle breakpoint changes
     */
    handleBreakpointChange(breakpointName, matches) {
        if (matches) {
            this.announceToScreenReader(`Layout changed to ${breakpointName} view`);
            console.log(`Breakpoint changed: ${breakpointName}`);
        }
    }

    /**
     * Get browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';

        if (ua.includes('Chrome')) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Edge')) {
            browser = 'Edge';
            version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }

        return { browser, version, userAgent: ua };
    }

    /**
     * Get device information
     */
    getDeviceInfo() {
        return {
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation?.type || 'unknown'
        };
    }

    /**
     * Create testing panel for debugging
     */
    createTestingPanel() {
        if (window.location.search.includes('debug=true')) {
            const panel = document.createElement('div');
            panel.id = 'testing-panel';
            panel.innerHTML = this.generateTestingPanelHTML();
            panel.style.cssText = this.getTestingPanelStyles();
            
            document.body.appendChild(panel);
            this.setupTestingPanelEvents();
        }
    }

    /**
     * Generate testing panel HTML
     */
    generateTestingPanelHTML() {
        const failedTests = this.testResults.filter(test => !test.passed);
        const criticalFailures = failedTests.filter(test => test.critical);

        return `
            <div class="panel-header">
                <h3>Testing Panel</h3>
                <button id="toggle-panel" aria-label="Toggle testing panel">−</button>
            </div>
            <div class="panel-content">
                <div class="test-section">
                    <h4>Browser Compatibility</h4>
                    <p>Browser: ${this.browserInfo.browser} ${this.browserInfo.version}</p>
                    <p>Tests Passed: ${this.testResults.filter(t => t.passed).length}/${this.testResults.length}</p>
                    ${criticalFailures.length > 0 ? `<p class="error">Critical Failures: ${criticalFailures.length}</p>` : ''}
                </div>
                
                <div class="test-section">
                    <h4>Performance Metrics</h4>
                    <p>Load Time: ${Math.round(this.performanceMetrics.totalLoadTime || 0)}ms</p>
                    <p>DOM Ready: ${Math.round(this.performanceMetrics.domContentLoaded || 0)}ms</p>
                </div>
                
                <div class="test-section">
                    <h4>Device Info</h4>
                    <p>Viewport: ${this.deviceInfo.viewportWidth}×${this.deviceInfo.viewportHeight}</p>
                    <p>Pixel Ratio: ${this.deviceInfo.pixelRatio}</p>
                    <p>Touch: ${this.deviceInfo.touchSupport ? 'Yes' : 'No'}</p>
                </div>
                
                <div class="test-actions">
                    <button id="run-accessibility-test">Test Accessibility</button>
                    <button id="simulate-slow-connection">Simulate Slow Connection</button>
                    <button id="test-keyboard-navigation">Test Keyboard Nav</button>
                </div>
            </div>
        `;
    }

    /**
     * Get testing panel styles
     */
    getTestingPanelStyles() {
        return `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
    }

    /**
     * Setup testing panel events
     */
    setupTestingPanelEvents() {
        const toggleBtn = document.getElementById('toggle-panel');
        const panelContent = document.querySelector('.panel-content');
        
        if (toggleBtn && panelContent) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = panelContent.style.display === 'none';
                panelContent.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? '−' : '+';
            });
        }

        // Setup test action buttons
        this.setupTestActionButtons();
    }

    /**
     * Setup test action buttons
     */
    setupTestActionButtons() {
        const accessibilityBtn = document.getElementById('run-accessibility-test');
        const slowConnectionBtn = document.getElementById('simulate-slow-connection');
        const keyboardNavBtn = document.getElementById('test-keyboard-navigation');

        if (accessibilityBtn) {
            accessibilityBtn.addEventListener('click', () => this.runAccessibilityTest());
        }

        if (slowConnectionBtn) {
            slowConnectionBtn.addEventListener('click', () => this.simulateSlowConnection());
        }

        if (keyboardNavBtn) {
            keyboardNavBtn.addEventListener('click', () => this.testKeyboardNavigation());
        }
    }

    /**
     * Run accessibility test
     */
    runAccessibilityTest() {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push(`${images.length} images missing alt text`);
        }

        // Check for missing form labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        if (inputs.length > 0) {
            issues.push(`${inputs.length} inputs missing labels`);
        }

        // Check color contrast (simplified)
        const elements = document.querySelectorAll('*');
        let contrastIssues = 0;
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.color && styles.backgroundColor) {
                // Simplified contrast check
                if (this.getContrastRatio(styles.color, styles.backgroundColor) < 4.5) {
                    contrastIssues++;
                }
            }
        });

        if (contrastIssues > 0) {
            issues.push(`${contrastIssues} potential contrast issues`);
        }

        const message = issues.length > 0 
            ? `Accessibility issues found: ${issues.join(', ')}`
            : 'No accessibility issues detected';
            
        this.announceToScreenReader(message);
        console.log('Accessibility Test:', message);
    }

    /**
     * Simulate slow connection
     */
    simulateSlowConnection() {
        const elements = document.querySelectorAll('*');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transition = 'opacity 0.1s';
                el.style.opacity = '0.5';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
            }, index * 10);
        });
        
        this.announceToScreenReader('Simulating slow connection loading');
    }

    /**
     * Test keyboard navigation
     */
    testKeyboardNavigation() {
        const focusableElements = this.getFocusableElements();
        let currentIndex = 0;

        const focusNext = () => {
            if (currentIndex < focusableElements.length) {
                focusableElements[currentIndex].focus();
                focusableElements[currentIndex].style.outline = '3px solid red';
                
                setTimeout(() => {
                    focusableElements[currentIndex].style.outline = '';
                    currentIndex++;
                    focusNext();
                }, 1000);
            } else {
                this.announceToScreenReader('Keyboard navigation test completed');
            }
        };

        this.announceToScreenReader('Starting keyboard navigation test');
        focusNext();
    }

    /**
     * Get contrast ratio (simplified)
     */
    getContrastRatio(color1, color2) {
        // Simplified contrast ratio calculation
        // In a real implementation, you'd convert colors to luminance values
        return Math.random() * 10; // Placeholder
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Log test results to console
     */
    logTestResults() {
        console.group('Browser Compatibility Tests');
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            const critical = test.critical ? ' (Critical)' : '';
            console.log(`${status} ${test.name}${critical}`);
        });
        console.groupEnd();

        console.group('Performance Metrics');
        Object.entries(this.performanceMetrics).forEach(([key, value]) => {
            console.log(`${key}: ${Math.round(value)}ms`);
        });
        console.groupEnd();

        console.group('Browser & Device Info');
        console.log('Browser:', this.browserInfo);
        console.log('Device:', this.deviceInfo);
        console.groupEnd();
    }

    /**
     * Public API for external testing
     */
    getTestResults() {
        return {
            compatibility: this.testResults,
            performance: this.performanceMetrics,
            browser: this.browserInfo,
            device: this.deviceInfo
        };
    }

    /**
     * Run all tests manually
     */
    runAllTests() {
        this.runCompatibilityTests();
        this.measurePerformance();
        this.runAccessibilityTest();
        return this.getTestResults();
    }
}

// Initialize ARIA Enhancements
const ariaEnhancements = new AriaEnhancements();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AriaEnhancements;
}

// Global access for debugging
window.AriaEnhancements = ariaEnhancements;