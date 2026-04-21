import pytest
from pathlib import Path
from datetime import datetime
import re

class TestFrontendDateDisplay:
    
    def test_html_file_exists(self):
        """测试 HTML 文件是否存在"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), f"HTML 文件不存在: {html_file}"
        assert html_file.is_file(), f"路径不是文件: {html_file}"
    
    def test_html_contains_date_display_elements(self):
        """测试 HTML 文件是否包含日期显示相关的关键元素"""
        html_file = Path("frontend/index.html")
        
        if not html_file.exists():
            pytest.skip(f"HTML 文件不存在: {html_file}")
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含日期相关的元素
        date_patterns = [
            r'<.*?id=["\'].*?date.*?["\'].*?>',  # 包含date的id属性
            r'<.*?class=["\'].*?date.*?["\'].*?>',  # 包含date的class属性
            r'<.*?id=["\'].*?time.*?["\'].*?>',  # 包含time的id属性
            r'<.*?class=["\'].*?time.*?["\'].*?>',  # 包含time的class属性
            r'\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?',  # 日期格式
        ]
        
        has_date_element = any(re.search(pattern, content, re.IGNORECASE) for pattern in date_patterns)
        assert has_date_element, "HTML 文件中未找到日期显示相关元素"
    
    def test_html_has_proper_structure_for_top_center_display(self):
        """测试 HTML 文件是否具有在顶部中央显示日期的合适结构"""
        html_file = Path("frontend/index.html")
        
        if not html_file.exists():
            pytest.skip(f"HTML 文件不存在: {html_file}")
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert '<html' in content.lower(), "HTML 文件缺少 html 标签"
        assert '<head>' in content.lower() or '<head ' in content.lower(), "HTML 文件缺少 head 标签"
        assert '<body>' in content.lower() or '<body ' in content.lower(), "HTML 文件缺少 body 标签"
        
        # 检查是否有可能用于顶部中央布局的元素
        layout_patterns = [
            r'<header.*?>',
            r'<div.*?class=["\'].*?(header|top|center).*?["\'].*?>',
            r'<div.*?id=["\'].*?(header|top|center).*?["\'].*?>',
            r'text-align:\s*center',
            r'position:\s*(fixed|absolute)',
            r'top:\s*\d+',
        ]
        
        has_layout_structure = any(re.search(pattern, content, re.IGNORECASE) for pattern in layout_patterns)
        assert has_layout_structure, "HTML 文件中未找到适合顶部中央布局的结构元素"
    
    def test_dev_notes_file_exists_and_contains_project_info(self):
        """测试开发文档是否存在并包含项目相关信息"""
        dev_notes_file = Path("docs/01f0c2/e6f71a/dev-notes.md")
        
        assert dev_notes_file.exists(), f"开发文档文件不存在: {dev_notes_file}"
        assert dev_notes_file.is_file(), f"路径不是文件: {dev_notes_file}"
        
        content = dev_notes_file.read_text(encoding='utf-8')
        
        # 检查是否包含项目相关关键词
        project_keywords = ['日期', '年月日', '显示', '顶部', '中央', 'date', 'frontend']
        has_project_info = any(keyword in content for keyword in project_keywords)
        assert has_project_info, "开发文档中未找到项目相关信息"
    
    def test_html_javascript_date_functionality(self):
        """测试 HTML 文件是否包含处理日期显示的 JavaScript 代码"""
        html_file = Path("frontend/index.html")
        
        if not html_file.exists():
            pytest.skip(f"HTML 文件不存在: {html_file}")
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查JavaScript相关的日期处理代码
        js_patterns = [
            r'<script.*?>.*?</script>',
            r'new\s+Date\s*\(',
            r'getFullYear\s*\(',
            r'getMonth\s*\(',
            r'getDate\s*\(',
            r'toLocaleDateString\s*\(',
            r'innerHTML.*?=.*?date',
            r'textContent.*?=.*?date',
        ]
        
        has_js_date_code = any(re.search(pattern, content, re.IGNORECASE | re.DOTALL) for pattern in js_patterns)
        
        # 如果没有找到JavaScript代码，检查是否有外部JS文件引用
        if not has_js_date_code:
            external_js_pattern = r'<script.*?src=["\'].*?\.js["\'].*?>'
            has_external_js = re.search(external_js_pattern, content, re.IGNORECASE)
            
            if has_external_js:
                pytest.skip("检测到外部JavaScript文件，无法验证日期功能代码")
            else:
                pytest.fail("HTML 文件中未找到日期显示相关的 JavaScript 代码")