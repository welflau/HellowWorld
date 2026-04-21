import pytest
from pathlib import Path
import re

class TestReturnToTopButton:
    
    def test_html_file_exists(self):
        """测试HTML文件是否存在"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), "index.html文件不存在"
        assert html_file.is_file(), "index.html不是一个有效的文件"
    
    def test_html_contains_return_to_top_button(self):
        """测试HTML文件是否包含返回顶部按钮相关元素"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含返回顶部按钮的常见标识
        button_patterns = [
            r'return.*top|top.*button|back.*top',  # 返回顶部相关文本
            r'id=["\'].*top.*["\']',  # id包含top的元素
            r'class=["\'].*top.*["\']',  # class包含top的元素
            r'onclick.*scrollTo|scrollTop',  # 滚动相关的JavaScript
        ]
        
        has_button_element = any(
            re.search(pattern, content, re.IGNORECASE) 
            for pattern in button_patterns
        )
        
        assert has_button_element, "HTML文件中未找到返回顶部按钮相关元素"
    
    def test_html_contains_scroll_functionality(self):
        """测试HTML文件是否包含滚动功能的JavaScript代码"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含滚动相关的JavaScript功能
        scroll_patterns = [
            r'scrollTo\s*\(',  # scrollTo方法调用
            r'scrollTop\s*=',  # scrollTop属性设置
            r'window\.scroll',  # window.scroll相关
            r'document\.documentElement\.scrollTop',  # 文档滚动位置
            r'addEventListener.*scroll',  # 滚动事件监听
        ]
        
        has_scroll_functionality = any(
            re.search(pattern, content, re.IGNORECASE) 
            for pattern in scroll_patterns
        )
        
        assert has_scroll_functionality, "HTML文件中未找到滚动功能相关的JavaScript代码"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        dev_notes_file = Path("docs/85d708/0bd889/dev-notes.md")
        assert dev_notes_file.exists(), "开发文档文件不存在"
        assert dev_notes_file.is_file(), "开发文档不是一个有效的文件"
    
    def test_html_has_valid_structure(self):
        """测试HTML文件是否具有有效的基本结构"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        required_tags = ['<html', '<head', '<body']
        
        for tag in required_tags:
            assert tag.lower() in content.lower(), f"HTML文件缺少必要的{tag}标签"
        
        # 检查文件不为空
        assert len(content.strip()) > 0, "HTML文件内容为空"