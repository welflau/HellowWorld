import pytest
from pathlib import Path
import re
from datetime import datetime

class TestWeekdayDisplayFrontend:
    
    def test_index_html_file_exists(self):
        """测试 index.html 文件是否存在"""
        index_file = Path("frontend/index.html")
        assert index_file.exists(), "index.html 文件不存在"
        assert index_file.is_file(), "index.html 不是一个有效的文件"
    
    def test_index_html_contains_weekday_elements(self):
        """测试 index.html 文件是否包含星期几显示相关的HTML元素"""
        index_file = Path("frontend/index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含星期几相关的元素
        weekday_patterns = [
            r'weekday|星期|周',  # 星期几相关的类名或ID
            r'<.*?id.*?weekday.*?>',  # 包含weekday的id属性
            r'<.*?class.*?weekday.*?>',  # 包含weekday的class属性
        ]
        
        has_weekday_element = any(re.search(pattern, content, re.IGNORECASE) for pattern in weekday_patterns)
        assert has_weekday_element, "HTML文件中未找到星期几显示相关的元素"
    
    def test_index_html_contains_javascript_for_weekday(self):
        """测试 index.html 文件是否包含处理星期几显示的JavaScript代码"""
        index_file = Path("frontend/index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含JavaScript相关代码
        js_patterns = [
            r'<script.*?>.*?</script>',  # script标签
            r'getDay\(\)|Date\(\)',  # JavaScript日期相关方法
            r'星期|周一|周二|周三|周四|周五|周六|周日',  # 中文星期
            r'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday',  # 英文星期
        ]
        
        has_js_code = any(re.search(pattern, content, re.IGNORECASE | re.DOTALL) for pattern in js_patterns)
        assert has_js_code, "HTML文件中未找到处理星期几的JavaScript代码"
    
    def test_dev_notes_file_exists_and_contains_weekday_info(self):
        """测试开发文档是否存在并包含星期几功能的相关说明"""
        dev_notes_file = Path("docs/fd7c0a/051bf1/dev-notes.md")
        assert dev_notes_file.exists(), "开发文档文件不存在"
        
        content = dev_notes_file.read_text(encoding='utf-8')
        
        # 检查文档是否包含星期几功能相关内容
        weekday_doc_patterns = [
            r'星期|weekday|week',
            r'显示|display|show',
            r'顶部|top|header',
        ]
        
        has_weekday_docs = any(re.search(pattern, content, re.IGNORECASE) for pattern in weekday_doc_patterns)
        assert has_weekday_docs, "开发文档中未找到星期几显示功能的相关说明"
    
    def test_html_structure_validity(self):
        """测试HTML文件的基本结构是否有效"""
        index_file = Path("frontend/index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert re.search(r'<!DOCTYPE\s+html>', content, re.IGNORECASE), "缺少DOCTYPE声明"
        assert re.search(r'<html.*?>', content, re.IGNORECASE), "缺少html标签"
        assert re.search(r'<head.*?>.*?</head>', content, re.IGNORECASE | re.DOTALL), "缺少head标签"
        assert re.search(r'<body.*?>.*?</body>', content, re.IGNORECASE | re.DOTALL), "缺少body标签"