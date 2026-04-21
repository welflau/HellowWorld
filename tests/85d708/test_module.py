import pytest
from pathlib import Path
import re

class TestReturnToTopButton:
    
    def test_html_file_exists(self):
        """测试HTML文件是否存在"""
        html_file = Path("index.html")
        assert html_file.exists(), "index.html文件不存在"
        assert html_file.is_file(), "index.html不是一个有效的文件"
    
    def test_html_contains_return_to_top_button(self):
        """测试HTML文件是否包含返回顶部按钮相关元素"""
        html_file = Path("index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含返回顶部按钮的常见标识
        button_patterns = [
            r'id=["\'].*top.*["\']',  # id包含top的元素
            r'class=["\'].*top.*["\']',  # class包含top的元素
            r'返回顶部',  # 中文文本
            r'back.*top',  # back to top相关文本
            r'scroll.*top',  # scroll to top相关文本
        ]
        
        found_button = False
        for pattern in button_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                found_button = True
                break
        
        assert found_button, "HTML文件中未找到返回顶部按钮相关元素"
    
    def test_html_contains_javascript_functionality(self):
        """测试HTML文件是否包含JavaScript滚动功能"""
        html_file = Path("index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查是否包含JavaScript滚动相关代码
        js_patterns = [
            r'scrollTo',  # scrollTo方法
            r'scrollTop',  # scrollTop属性
            r'window\.scroll',  # window.scroll方法
            r'document\.documentElement\.scrollTop',  # 获取滚动位置
            r'addEventListener.*scroll',  # 滚动事件监听
        ]
        
        found_js = False
        for pattern in js_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                found_js = True
                break
        
        assert found_js, "HTML文件中未找到JavaScript滚动功能代码"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        docs_file = Path("docs/85d708/0bd889/dev-notes.md")
        assert docs_file.exists(), "开发文档文件不存在"
        assert docs_file.is_file(), "开发文档不是一个有效的文件"
    
    def test_dev_notes_contains_relevant_content(self):
        """测试开发文档是否包含返回顶部功能相关内容"""
        docs_file = Path("docs/85d708/0bd889/dev-notes.md")
        assert docs_file.exists(), "开发文档文件不存在"
        
        content = docs_file.read_text(encoding='utf-8')
        
        # 检查文档是否包含相关关键词
        keywords = [
            '返回顶部',
            'top',
            '按钮',
            'button',
            '滚动',
            'scroll',
            '功能',
            'feature'
        ]
        
        found_keywords = []
        for keyword in keywords:
            if keyword.lower() in content.lower():
                found_keywords.append(keyword)
        
        assert len(found_keywords) >= 2, f"开发文档中相关关键词不足，仅找到: {found_keywords}"
    
    def test_html_structure_validity(self):
        """测试HTML文件基本结构的有效性"""
        html_file = Path("index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert '<html' in content.lower(), "HTML文件缺少html标签"
        assert '<head' in content.lower(), "HTML文件缺少head标签"
        assert '<body' in content.lower(), "HTML文件缺少body标签"
        
        # 检查标签配对
        html_open = content.lower().count('<html')
        html_close = content.lower().count('</html>')
        assert html_open == html_close, "HTML标签未正确闭合"