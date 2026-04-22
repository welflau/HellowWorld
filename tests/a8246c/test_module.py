import pytest
from pathlib import Path
import re

class TestCalendarProject:
    """测试日期点击交互和页面跳转逻辑项目"""
    
    @pytest.fixture
    def project_root(self):
        """获取项目根目录"""
        return Path(__file__).parent
    
    def test_html_files_exist_and_structure(self, project_root):
        """测试HTML文件存在性和基本结构完整性"""
        # 检查关键HTML文件存在
        calendar_html = project_root / "calendar.html"
        index_html = project_root / "index.html"
        
        assert calendar_html.exists(), "calendar.html文件不存在"
        assert index_html.exists(), "index.html文件不存在"
        
        # 检查calendar.html包含日历相关元素
        calendar_content = calendar_html.read_text(encoding='utf-8')
        assert '<html' in calendar_content, "calendar.html缺少html标签"
        assert 'calendar' in calendar_content.lower(), "calendar.html缺少日历相关内容"
        
        # 检查是否包含JavaScript引用
        assert 'calendar.js' in calendar_content or '<script' in calendar_content, "calendar.html缺少JavaScript引用"
        
        # 检查是否包含CSS引用
        assert 'calendar.css' in calendar_content or '<style' in calendar_content, "calendar.html缺少样式引用"
    
    def test_calendar_interactive_elements(self, project_root):
        """测试日历交互元素和点击事件相关代码"""
        calendar_js = project_root / "calendar.js"
        calendar_html = project_root / "calendar.html"
        
        assert calendar_js.exists(), "calendar.js文件不存在"
        
        # 检查JavaScript文件包含点击事件处理
        js_content = calendar_js.read_text(encoding='utf-8')
        click_patterns = [
            r'addEventListener.*click',
            r'onclick',
            r'\.click\(',
            r'function.*click'
        ]
        
        has_click_handler = any(re.search(pattern, js_content, re.IGNORECASE) for pattern in click_patterns)
        assert has_click_handler, "calendar.js缺少点击事件处理代码"
        
        # 检查HTML中是否有可点击的日期元素
        html_content = calendar_html.read_text(encoding='utf-8')
        clickable_patterns = [
            r'class.*day',
            r'class.*date',
            r'onclick',
            r'data-date',
            r'<td',
            r'<button'
        ]
        
        has_clickable_elements = any(re.search(pattern, html_content, re.IGNORECASE) for pattern in clickable_patterns)
        assert has_clickable_elements, "calendar.html缺少可点击的日期元素"
    
    def test_page_navigation_and_styling(self, project_root):
        """测试页面跳转逻辑和样式文件完整性"""
        calendar_css = project_root / "calendar.css"
        calendar_js = project_root / "calendar.js"
        dev_notes = project_root / "docs" / "a8246c" / "adf8dc" / "dev-notes.md"
        
        # 检查CSS文件存在和内容
        assert calendar_css.exists(), "calendar.css文件不存在"
        css_content = calendar_css.read_text(encoding='utf-8')
        
        # 检查CSS包含日历相关样式
        css_patterns = [
            r'\.calendar',
            r'\.day',
            r'\.date',
            r'hover',
            r'cursor.*pointer'
        ]
        
        has_calendar_styles = any(re.search(pattern, css_content, re.IGNORECASE) for pattern in css_patterns)
        assert has_calendar_styles, "calendar.css缺少日历相关样式定义"
        
        # 检查JavaScript中的页面跳转逻辑
        js_content = calendar_js.read_text(encoding='utf-8')
        navigation_patterns = [
            r'window\.location',
            r'location\.href',
            r'history\.push',
            r'navigate',
            r'redirect'
        ]
        
        has_navigation = any(re.search(pattern, js_content, re.IGNORECASE) for pattern in navigation_patterns)
        assert has_navigation, "calendar.js缺少页面跳转逻辑"
        
        # 检查开发文档存在
        assert dev_notes.exists(), "开发文档dev-notes.md不存在"
        
        # 验证文档包含项目相关信息
        doc_content = dev_notes.read_text(encoding='utf-8')
        doc_keywords = ['日期', '点击', '交互', '跳转', 'calendar', 'click', 'navigation']
        has_relevant_content = any(keyword in doc_content.lower() for keyword in doc_keywords)
        assert has_relevant_content, "开发文档缺少项目相关描述"