import pytest
from pathlib import Path
from datetime import datetime, date
import re

class TestCalendarFrontend:
    
    def test_index_html_file_exists(self):
        """测试 index.html 文件是否存在"""
        frontend_dir = Path("frontend")
        index_file = frontend_dir / "index.html"
        assert index_file.exists(), f"index.html 文件不存在于 {frontend_dir} 目录中"
        assert index_file.is_file(), "index.html 应该是一个文件而不是目录"
    
    def test_index_html_contains_calendar_elements(self):
        """测试 index.html 文件包含日历相关的关键元素"""
        frontend_dir = Path("frontend")
        index_file = frontend_dir / "index.html"
        
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否包含日历相关的HTML元素
        assert '<html' in content.lower(), "HTML文件应包含html标签"
        assert '<head' in content.lower(), "HTML文件应包含head标签"
        assert '<body' in content.lower(), "HTML文件应包含body标签"
        
        # 检查是否包含日历相关的关键词或元素
        calendar_keywords = ['calendar', 'date', 'day', 'month', 'year', '日历', '日期']
        has_calendar_keyword = any(keyword in content.lower() for keyword in calendar_keywords)
        assert has_calendar_keyword, "HTML文件应包含日历相关的关键词"
    
    def test_index_html_has_current_date_highlight_functionality(self):
        """测试 index.html 文件包含当前日期高亮功能相关代码"""
        frontend_dir = Path("frontend")
        index_file = frontend_dir / "index.html"
        
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否包含JavaScript代码或CSS样式用于高亮
        has_script = '<script' in content.lower()
        has_style = '<style' in content.lower() or 'class=' in content.lower()
        
        assert has_script or has_style, "HTML文件应包含JavaScript或CSS代码用于实现高亮功能"
        
        # 检查是否包含高亮相关的关键词
        highlight_keywords = ['highlight', 'current', 'today', 'active', 'selected', '高亮', '当前', '今天']
        has_highlight_keyword = any(keyword in content.lower() for keyword in highlight_keywords)
        assert has_highlight_keyword, "HTML文件应包含高亮功能相关的关键词"
    
    def test_dev_notes_file_exists_and_contains_calendar_info(self):
        """测试开发文档文件存在并包含日历相关信息"""
        docs_file = Path("docs/a8246c/222f6d/dev-notes.md")
        
        assert docs_file.exists(), f"开发文档文件不存在: {docs_file}"
        assert docs_file.is_file(), "dev-notes.md 应该是一个文件"
        
        with open(docs_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查文档是否包含日历项目相关信息
        project_keywords = ['calendar', 'date', 'highlight', '日历', '日期', '高亮', 'algorithm', '算法']
        has_project_keyword = any(keyword in content.lower() for keyword in project_keywords)
        assert has_project_keyword, "开发文档应包含日历项目相关的关键词"
        
        # 检查文档长度，确保不是空文件
        assert len(content.strip()) > 0, "开发文档不应为空"
    
    def test_frontend_directory_structure(self):
        """测试前端目录结构是否合理"""
        frontend_dir = Path("frontend")
        
        assert frontend_dir.exists(), "frontend 目录应该存在"
        assert frontend_dir.is_dir(), "frontend 应该是一个目录"
        
        # 检查前端目录中是否有必要的文件
        files_in_frontend = list(frontend_dir.iterdir())
        assert len(files_in_frontend) > 0, "frontend 目录不应为空"
        
        # 检查是否有HTML文件
        html_files = [f for f in files_in_frontend if f.suffix.lower() == '.html']
        assert len(html_files) > 0, "frontend 目录应包含至少一个HTML文件"