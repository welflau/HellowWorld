/**
 * Browser Compatibility Test Report for White Background
 * Tests white background display effects across mainstream browsers
 */

class CompatibilityTester {
    constructor() {
        this.testResults = {};
        this.browserInfo = this.getBrowserInfo();
        this.testElements = [];
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        const browser = {
            name: 'Unknown',
            version: 'Unknown',
            engine: 'Unknown'
        };

        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser.name = 'Chrome';
            browser.version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Blink';
        } else if (ua.includes('Firefox')) {
            browser.name = 'Firefox';
            browser.version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Gecko';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser.name = 'Safari';
            browser.version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'WebKit';
        } else if (ua.includes('Edg')) {
            browser.name = 'Edge';
            browser.version = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
            browser.engine = 'Blink';
        }

        return browser;
    }

    createTestElement(testName, styles) {
        const element = document.createElement('div');
        element.className = `test-element test-${testName}`;
        element.innerHTML = `<span>Test: ${testName}</span>`;
        
        Object.assign(element.style, {
            width: '200px',
            height: '100px',
            margin: '10px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '100px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            ...styles
        });

        this.testElements.push({ name: testName, element });
        return element;
    }

    testWhiteBackgrounds() {
        const tests = [
            {
                name: 'solid-white',
                styles: { background: '#ffffff', color: '#333' }
            },
            {
                name: 'white-with-opacity',
                styles: { background: 'rgba(255, 255, 255, 0.9)', color: '#333' }
            },
            {
                name: 'white-gradient',
                styles: { 
                    background: 'linear-gradient(45deg, #ffffff 0%, #f8f8f8 100%)',
                    color: '#333'
                }
            },
            {
                name: 'white-with-shadow',
                styles: { 
                    background: '#ffffff',
                    color: '#333',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }
            },
            {
                name: 'white-with-backdrop-filter',
                styles: { 
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#333',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }
            }
        ];

        tests.forEach(test => {
            this.createTestElement(test.name, test.styles);
        });
    }

    analyzeColorSupport() {
        const testDiv = document.createElement('div');
        document.body.appendChild(testDiv);

        const colorTests = {
            'hex-white': '#ffffff',
            'rgb-white': 'rgb(255, 255, 255)',
            'rgba-white': 'rgba(255, 255, 255, 0.9)',
            'hsl-white': 'hsl(0, 0%, 100%)',
            'hsla-white': 'hsla(0, 0%, 100%, 0.9)',
            'named-white': 'white'
        };

        const results = {};
        
        Object.entries(colorTests).forEach(([name, color]) => {
            testDiv.style.background = color;
            const computedStyle = window.getComputedStyle(testDiv);
            const actualColor = computedStyle.backgroundColor;
            
            results[name] = {
                input: color,
                computed: actualColor,
                supported: actualColor !== 'rgba(0, 0, 0, 0)' && actualColor !== 'transparent'
            };
        });

        document.body.removeChild(testDiv);
        return results;
    }

    testCSSFeatures() {
        const features = {
            'backdrop-filter': CSS.supports('backdrop-filter', 'blur(10px)'),
            'box-shadow': CSS.supports('box-shadow', '0 0 10px rgba(0,0,0,0.1)'),
            'border-radius': CSS.supports('border-radius', '15px'),
            'linear-gradient': CSS.supports('background', 'linear-gradient(45deg, white, gray)'),
            'rgba-colors': CSS.supports('background-color', 'rgba(255,255,255,0.9)'),
            'flexbox': CSS.supports('display', 'flex'),
            'grid': CSS.supports('display', 'grid'),
            'transform': CSS.supports('transform', 'scale(1.1)'),
            'transition': CSS.supports('transition', 'all 0.3s ease')
        };

        return features;
    }

    runCompatibilityTests() {
        console.log('🧪 Starting Browser Compatibility Tests...');
        
        // Test white background variations
        this.testWhiteBackgrounds();
        
        // Analyze color format support
        const colorSupport = this.analyzeColorSupport();
        
        // Test CSS feature support
        const featureSupport = this.testCSSFeatures();
        
        // Compile results
        this.testResults = {
            browser: this.browserInfo,
            timestamp: new Date().toISOString(),
            colorSupport,
            featureSupport,
            testElements: this.testElements.length
        };

        return this.testResults;
    }

    generateReport() {
        const results = this.runCompatibilityTests();
        
        const report = {
            summary: {
                browser: `${results.browser.name} ${results.browser.version}`,
                engine: results.browser.engine,
                timestamp: results.timestamp,
                overallCompatibility: this.calculateCompatibilityScore(results)
            },
            colorFormatSupport: results.colorSupport,
            cssFeatureSupport: results.featureSupport,
            recommendations: this.generateRecommendations(results),
            issues: this.identifyIssues(results)
        };

        return report;
    }

    calculateCompatibilityScore(results) {
        const colorTests = Object.values(results.colorSupport);
        const featureTests = Object.values(results.featureSupport);
        
        const colorScore = colorTests.filter(test => test.supported).length / colorTests.length;
        const featureScore = featureTests.filter(supported => supported).length / featureTests.length;
        
        const overallScore = (colorScore + featureScore) / 2;
        
        if (overallScore >= 0.9) return 'Excellent';
        if (overallScore >= 0.7) return 'Good';
        if (overallScore >= 0.5) return 'Fair';
        return 'Poor';
    }

    generateRecommendations(results) {
        const recommendations = [];
        
        if (!results.featureSupport['backdrop-filter']) {
            recommendations.push('Use fallback for backdrop-filter (not supported)');
        }
        
        if (!results.colorSupport['rgba-white'].supported) {
            recommendations.push('Use solid colors instead of RGBA');
        }
        
        if (!results.featureSupport['flexbox']) {
            recommendations.push('Provide fallback layout for flexbox');
        }
        
        if (results.browser.name === 'Safari' && parseInt(results.browser.version) < 14) {
            recommendations.push('Consider vendor prefixes for older Safari');
        }
        
        return recommendations;
    }

    identifyIssues(results) {
        const issues = [];
        
        Object.entries(results.colorSupport).forEach(([format, test]) => {
            if (!test.supported) {
                issues.push(`Color format not supported: ${format}`);
            }
        });
        
        Object.entries(results.featureSupport).forEach(([feature, supported]) => {
            if (!supported) {
                issues.push(`CSS feature not supported: ${feature}`);
            }
        });
        
        return issues;
    }

    displayReport() {
        const report = this.generateReport();
        
        console.log('📊 Browser Compatibility Report');
        console.log('================================');
        console.log(`Browser: ${report.summary.browser}`);
        console.log(`Engine: ${report.summary.engine}`);
        console.log(`Compatibility: ${report.summary.overallCompatibility}`);
        console.log(`Timestamp: ${report.summary.timestamp}`);
        console.log('');
        
        console.log('🎨 Color Format Support:');
        Object.entries(report.colorFormatSupport).forEach(([format, test]) => {
            console.log(`  ${format}: ${test.supported ? '✅' : '❌'} (${test.computed})`);
        });
        console.log('');
        
        console.log('🔧 CSS Feature Support:');
        Object.entries(report.cssFeatureSupport).forEach(([feature, supported]) => {
            console.log(`  ${feature}: ${supported ? '✅' : '❌'}`);
        });
        console.log('');
        
        if (report.recommendations.length > 0) {
            console.log('💡 Recommendations:');
            report.recommendations.forEach(rec => console.log(`  • ${rec}`));
            console.log('');
        }
        
        if (report.issues.length > 0) {
            console.log('⚠️ Issues Found:');
            report.issues.forEach(issue => console.log(`  • ${issue}`));
        }
        
        return report;
    }

    createVisualTestPage() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        `;
        
        const title = document.createElement('h1');
        title.textContent = 'White Background Compatibility Test';
        title.style.cssText = `
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        `;
        
        const info = document.createElement('div');
        info.innerHTML = `
            <p><strong>Browser:</strong> ${this.browserInfo.name} ${this.browserInfo.version}</p>
            <p><strong>Engine:</strong> ${this.browserInfo.engine}</p>
            <p><strong>Test Date:</strong> ${new Date().toLocaleDateString()}</p>
        `;
        info.style.cssText = `
            background: rgba(255,255,255,0.9);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        `;
        
        const testContainer = document.createElement('div');
        testContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        `;
        
        container.appendChild(title);
        container.appendChild(info);
        container.appendChild(testContainer);
        
        this.testElements.forEach(test => {
            testContainer.appendChild(test.element);
        });
        
        return container;
    }
}

// Initialize and run tests when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new CompatibilityTester();
        const report = tester.displayReport();
        
        // Add visual test elements to page if in browser environment
        if (document.body) {
            const visualTest = tester.createVisualTestPage();
            document.body.appendChild(visualTest);
        }
        
        // Make report available globally
        window.compatibilityReport = report;
        window.compatibilityTester = tester;
    });
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompatibilityTester;
}