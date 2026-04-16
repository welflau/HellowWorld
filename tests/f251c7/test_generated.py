import pytest
from pathlib import Path
import re

class TestFrontendFiles:
    """前端页面功能测试和优化模块测试类"""
    
    @pytest.fixture
    def frontend_dir(self):
        """获取前端模块目录路径"""
        return Path(__file__).parent / "frontend"
    
    def test_required_files_exist(self, frontend_dir):
        """测试所有必需的前端文件是否存在"""
        required_files = [
            "test-checklist.md",
            "browser-compatibility.html", 
            "performance-test.js",
            "styles.min.css",
            "performance-monitor.js"
        ]
        
        for filename in required_files:
            file_path = frontend_dir / filename
            assert file_path.exists(), f"必需文件 {filename} 不存在"
            assert file_path.is_file(), f"{filename} 不是有效文件"
    
    def test_browser_compatibility_html_content(self, frontend_dir):
        """测试浏览器兼容性HTML文件包含关键元素和内容"""
        html_file = frontend_dir / "browser-compatibility.html"
        assert html_file.exists(), "browser-compatibility.html 文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查HTML基本结构
        assert "<html" in content, "HTML文件缺少html标签"
        assert "<head>" in content, "HTML文件缺少head标签"
        assert "<body>" in content, "HTML文件缺少body标签"
        
        # 检查浏览器兼容性相关内容
        compatibility_keywords = ["browser", "compatibility", "chrome", "firefox", "safari", "edge"]
        found_keywords = [keyword for keyword in compatibility_keywords if keyword.lower() in content.lower()]
        assert len(found_keywords) >= 2, f"HTML文件应包含更多浏览器兼容性相关关键词，当前找到: {found_keywords}"
        
        # 检查是否包含CSS或JS引用
        has_css_or_js = "<link" in content or "<script" in content or "<style" in content
        assert has_css_or_js, "HTML文件应包含CSS或JavaScript引用"
    
    def test_performance_scripts_validity(self, frontend_dir):
        """测试性能相关JavaScript文件的有效性和关键功能"""
        js_files = ["performance-test.js", "performance-monitor.js"]
        
        for js_filename in js_files:
            js_file = frontend_dir / js_filename
            assert js_file.exists(), f"JavaScript文件 {js_filename} 不存在"
            
            content = js_file.read_text(encoding='utf-8')
            assert len(content.strip()) > 0, f"{js_filename} 文件不能为空"
            
            # 检查性能监控相关关键词
            performance_keywords = ["performance", "timing", "measure", "mark", "monitor", "load", "speed"]
            found_keywords = [keyword for keyword in performance_keywords if keyword.lower() in content.lower()]
            assert len(found_keywords) >= 2, f"{js_filename} 应包含性能监控相关代码，找到关键词: {found_keywords}"
            
            # 检查JavaScript基本语法元素
            js_elements = ["function", "var", "let", "const", "=", "{", "}"]
            found_elements = [element for element in js_elements if element in content]
            assert len(found_elements) >= 3, f"{js_filename} 应包含有效的JavaScript代码结构"
    
    def test_css_and_checklist_files_content(self, frontend_dir):
        """测试CSS样式文件和测试清单文件的内容完整性"""
        # 测试CSS文件
        css_file = frontend_dir / "styles.min.css"
        assert css_file.exists(), "styles.min.css 文件不存在"
        
        css_content = css_file.read_text(encoding='utf-8')
        assert len(css_content.strip()) > 0, "CSS文件不能为空"
        
        # 检查CSS基本语法
        css_indicators = ["{", "}", ":", ";"]
        found_css_syntax = [indicator for indicator in css_indicators if indicator in css_content]
        assert len(found_css_syntax) >= 3, "CSS文件应包含有效的CSS语法结构"
        
        # 测试测试清单文件
        checklist_file = frontend_dir / "test-checklist.md"
        assert checklist_file.exists(), "test-checklist.md 文件不存在"
        
        checklist_content = checklist_file.read_text(encoding='utf-8')
        assert len(checklist_content.strip()) > 0, "测试清单文件不能为空"
        
        # 检查Markdown格式和测试相关内容
        test_keywords = ["test", "测试", "check", "验证", "功能", "performance", "browser"]
        found_test_keywords = [keyword for keyword in test_keywords if keyword.lower() in checklist_content.lower()]
        assert len(found_test_keywords) >= 3, f"测试清单应包含更多测试相关内容，找到关键词: {found_test_keywords}"
    
    def test_file_sizes_reasonable(self, frontend_dir):
        """测试文件大小是否在合理范围内"""
        file_size_limits = {
            "test-checklist.md": (100, 50000),  # 100B - 50KB
            "browser-compatibility.html": (200, 100000),  # 200B - 100KB  
            "performance-test.js": (100, 200000),  # 100B - 200KB
            "styles.min.css": (50, 500000),  # 50B - 500KB
            "performance-monitor.js": (100, 200000)  # 100B - 200KB
        }
        
        for filename, (min_size, max_size) in file_size_limits.items():
            file_path = frontend_dir / filename
            assert file_path.exists(), f"文件 {filename} 不存在"
            
            file_size = file_path.stat().st_size
            assert min_size <= file_size <= max_size, f"文件 {filename} 大小 {file_size}B 不在合理范围 {min_size}-{max_size}B 内"