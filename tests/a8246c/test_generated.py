import pytest
from pathlib import Path
import re

class TestCalendarProject:
    """全年日历页面和布局测试类"""
    
    @pytest.fixture
    def project_root(self):
        """获取项目根目录路径"""
        return Path(__file__).parent
    
    def test_html_files_exist(self, project_root):
        """测试HTML文件是否存在"""
        calendar_html = project_root / "calendar.html"
        index_html = project_root / "index.html"
        
        assert calendar_html.exists(), "calendar.html文件不存在"
        assert index_html.exists(), "index.html文件不存在"
        assert calendar_html.is_file(), "calendar.html不是有效文件"
        assert index_html.is_file(), "index.html不是有效文件"
    
    def test_css_js_files_exist(self, project_root):
        """测试CSS和JavaScript文件是否存在"""
        calendar_css = project_root / "calendar.css"
        calendar_js = project_root / "calendar.js"
        
        assert calendar_css.exists(), "calendar.css文件不存在"
        assert calendar_js.exists(), "calendar.js文件不存在"
        assert calendar_css.suffix == ".css", "CSS文件扩展名不正确"
        assert calendar_js.suffix == ".js", "JavaScript文件扩展名不正确"
    
    def test_calendar_html_content(self, project_root):
        """测试calendar.html文件包含日历相关的关键元素"""
        calendar_html = project_root / "calendar.html"
        
        if calendar_html.exists():
            content = calendar_html.read_text(encoding='utf-8')
            
            # 检查基本HTML结构
            assert "<html" in content.lower(), "缺少HTML标签"
            assert "<head>" in content.lower(), "缺少head标签"
            assert "<body>" in content.lower(), "缺少body标签"
            
            # 检查日历相关元素
            calendar_keywords = ["calendar", "month", "year", "日历", "月份", "年份"]
            has_calendar_content = any(keyword in content.lower() for keyword in calendar_keywords)
            assert has_calendar_content, "HTML内容中缺少日历相关关键词"
            
            # 检查是否引用了CSS和JS文件
            assert "calendar.css" in content or ".css" in content, "未引用CSS样式文件"
            assert "calendar.js" in content or ".js" in content, "未引用JavaScript文件"
    
    def test_index_html_structure(self, project_root):
        """测试index.html文件的基本结构和内容"""
        index_html = project_root / "index.html"
        
        if index_html.exists():
            content = index_html.read_text(encoding='utf-8')
            
            # 检查HTML5文档类型
            assert "<!doctype html>" in content.lower() or "<!DOCTYPE html>" in content, "缺少HTML5文档类型声明"
            
            # 检查基本结构
            assert "<title>" in content.lower(), "缺少页面标题"
            assert "<meta" in content.lower(), "缺少meta标签"
            
            # 检查是否有到日历页面的链接或引用
            has_calendar_reference = ("calendar.html" in content.lower() or 
                                    "calendar" in content.lower())
            assert has_calendar_reference, "首页未包含日历相关内容或链接"
    
    def test_css_file_content(self, project_root):
        """测试CSS文件包含样式定义"""
        calendar_css = project_root / "calendar.css"
        
        if calendar_css.exists():
            content = calendar_css.read_text(encoding='utf-8')
            
            # 检查是否包含CSS选择器和样式规则
            has_css_rules = "{" in content and "}" in content
            assert has_css_rules, "CSS文件缺少样式规则"
            
            # 检查日历相关的样式类或ID
            calendar_selectors = ["calendar", "month", "day", "year", "grid", "table"]
            has_calendar_styles = any(selector in content.lower() for selector in calendar_selectors)
            assert has_calendar_styles, "CSS文件缺少日历相关样式定义"
    
    def test_javascript_file_content(self, project_root):
        """测试JavaScript文件包含基本的脚本内容"""
        calendar_js = project_root / "calendar.js"
        
        if calendar_js.exists():
            content = calendar_js.read_text(encoding='utf-8')
            
            # 检查是否包含JavaScript代码特征
            js_features = ["function", "var", "let", "const", "document", "="]
            has_js_code = any(feature in content for feature in js_features)
            assert has_js_code, "JavaScript文件缺少有效的脚本代码"
            
            # 检查日历相关的JavaScript功能
            calendar_functions = ["calendar", "date", "month", "year", "day"]
            has_calendar_logic = any(func in content.lower() for func in calendar_functions)
            assert has_calendar_logic, "JavaScript文件缺少日历相关功能代码"
    
    def test_documentation_exists(self, project_root):
        """测试项目文档是否存在"""
        docs_path = project_root / "docs" / "a8246c" / "ea41b6" / "dev-notes.md"
        
        assert docs_path.exists(), "开发文档不存在"
        assert docs_path.suffix == ".md", "文档不是Markdown格式"
        
        if docs_path.exists():
            content = docs_path.read_text(encoding='utf-8')
            assert len(content.strip()) > 0, "文档内容为空"
            
            # 检查是否包含项目相关信息
            project_keywords = ["calendar", "日历", "frontend", "前端", "layout", "布局"]
            has_project_info = any(keyword in content.lower() for keyword in project_keywords)
            assert has_project_info, "文档缺少项目相关描述信息"