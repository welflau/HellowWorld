import pytest
from pathlib import Path
import json
import re

class TestBrowserCompatibility:
    """浏览器兼容性测试类"""
    
    @pytest.fixture
    def test_dir(self):
        """获取测试目录路径"""
        return Path(__file__).parent / "test"
    
    def test_browser_compatibility_html_exists_and_valid(self, test_dir):
        """测试浏览器兼容性HTML文件是否存在且包含必要的背景色测试元素"""
        html_file = test_dir / "browser-compatibility.html"
        
        # 检查文件是否存在
        assert html_file.exists(), "browser-compatibility.html 文件不存在"
        
        # 读取HTML内容
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含背景色相关的关键元素
        assert "background-color" in content.lower() or "background" in content.lower(), "HTML文件缺少背景色相关样式"
        assert "<div" in content.lower() or "<body" in content.lower(), "HTML文件缺少容器元素"
        assert "<!doctype html>" in content.lower() or "<html" in content.lower(), "HTML文件格式不正确"
        
        # 检查是否包含测试相关的类名或ID
        has_test_elements = any(keyword in content.lower() for keyword in [
            'test', 'compatibility', 'background', 'color'
        ])
        assert has_test_elements, "HTML文件缺少测试相关的元素标识"
    
    def test_compatibility_report_js_functionality(self, test_dir):
        """测试兼容性报告JS文件是否存在且包含必要的测试功能代码"""
        js_file = test_dir / "compatibility-report.js"
        
        # 检查文件是否存在
        assert js_file.exists(), "compatibility-report.js 文件不存在"
        
        # 读取JS内容
        content = js_file.read_text(encoding='utf-8')
        
        # 检查是否包含浏览器检测相关代码
        browser_detection_keywords = [
            'navigator', 'useragent', 'browser', 'chrome', 'firefox', 'safari', 'edge'
        ]
        has_browser_detection = any(keyword in content.lower() for keyword in browser_detection_keywords)
        assert has_browser_detection, "JS文件缺少浏览器检测功能"
        
        # 检查是否包含背景色测试相关代码
        background_test_keywords = [
            'background', 'color', 'style', 'getcomputedstyle', 'backgroundcolor'
        ]
        has_background_test = any(keyword in content.lower() for keyword in background_test_keywords)
        assert has_background_test, "JS文件缺少背景色测试功能"
        
        # 检查是否包含函数定义
        assert 'function' in content or '=>' in content or 'const' in content, "JS文件缺少函数定义"
    
    def test_visual_test_html_structure(self, test_dir):
        """测试视觉测试HTML文件是否存在且包含正确的测试结构"""
        visual_test_file = test_dir / "visual-test.html"
        
        # 检查文件是否存在
        assert visual_test_file.exists(), "visual-test.html 文件不存在"
        
        # 读取HTML内容
        content = visual_test_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert "<html" in content.lower(), "缺少HTML标签"
        assert "<head" in content.lower(), "缺少HEAD标签"
        assert "<body" in content.lower(), "缺少BODY标签"
        
        # 检查是否包含视觉测试相关元素
        visual_keywords = ['visual', 'test', 'color', 'background', 'display']
        has_visual_elements = any(keyword in content.lower() for keyword in visual_keywords)
        assert has_visual_elements, "HTML文件缺少视觉测试相关元素"
        
        # 检查是否包含样式定义（内联或外部）
        has_styles = any(style_indicator in content.lower() for style_indicator in [
            '<style', 'style=', '.css', 'background-color', 'background:'
        ])
        assert has_styles, "HTML文件缺少样式定义"
    
    def test_test_results_markdown_format(self, test_dir):
        """测试结果报告Markdown文件是否存在且格式正确"""
        md_file = test_dir / "test-results.md"
        
        # 检查文件是否存在
        assert md_file.exists(), "test-results.md 文件不存在"
        
        # 读取Markdown内容
        content = md_file.read_text(encoding='utf-8')
        
        # 检查是否包含Markdown格式元素
        markdown_elements = ['#', '##', '###', '*', '-', '|', '```']
        has_markdown_format = any(element in content for element in markdown_elements)
        assert has_markdown_format, "文件不包含有效的Markdown格式"
        
        # 检查是否包含测试结果相关内容
        result_keywords = ['test', 'result', 'browser', 'compatibility', 'background', 'color']
        has_test_content = any(keyword in content.lower() for keyword in result_keywords)
        assert has_test_content, "Markdown文件缺少测试结果相关内容"
    
    def test_screenshots_directory_structure(self, test_dir):
        """测试截图目录是否存在且结构正确"""
        screenshots_dir = test_dir / "screenshots"
        gitkeep_file = screenshots_dir / ".gitkeep"
        
        # 检查截图目录是否存在
        assert screenshots_dir.exists(), "screenshots 目录不存在"
        assert screenshots_dir.is_dir(), "screenshots 不是一个目录"
        
        # 检查.gitkeep文件是否存在
        assert gitkeep_file.exists(), ".gitkeep 文件不存在"
        
        # 检查目录权限（确保可以写入截图文件）
        assert screenshots_dir.stat().st_mode & 0o200, "screenshots 目录没有写入权限"
    
    def test_project_file_structure_completeness(self, test_dir):
        """测试项目文件结构的完整性"""
        required_files = [
            "browser-compatibility.html",
            "compatibility-report.js", 
            "test-results.md",
            "visual-test.html",
            "screenshots/.gitkeep"
        ]
        
        missing_files = []
        for file_path in required_files:
            full_path = test_dir / file_path
            if not full_path.exists():
                missing_files.append(file_path)
        
        assert not missing_files, f"缺少必要文件: {', '.join(missing_files)}"
        
        # 检查文件大小（确保不是空文件，除了.gitkeep）
        for file_path in required_files:
            if file_path.endswith('.gitkeep'):
                continue
            full_