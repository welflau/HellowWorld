import pytest
from pathlib import Path
import re
from datetime import datetime

class TestHelloWorldClock:
    
    def test_index_html_file_exists(self):
        """测试 index.html 文件是否存在"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html 文件不存在"
        assert index_file.is_file(), "index.html 不是一个有效的文件"
    
    def test_html_contains_clock_elements(self):
        """测试 HTML 文件是否包含时钟相关的关键元素"""
        index_file = Path("index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含时钟容器元素
        assert 'clock' in content.lower(), "HTML 中缺少时钟相关元素"
        
        # 检查是否包含 JavaScript 时钟功能
        assert 'setinterval' in content.lower() or 'settimeout' in content.lower(), "缺少定时器功能"
        
        # 检查是否包含获取当前时间的代码
        assert 'date' in content.lower() and 'time' in content.lower(), "缺少日期时间相关代码"
        
        # 检查是否有样式定位到左上角
        position_keywords = ['position', 'top', 'left', 'absolute', 'fixed']
        has_positioning = any(keyword in content.lower() for keyword in position_keywords)
        assert has_positioning, "缺少左上角定位样式"
    
    def test_html_structure_validity(self):
        """测试 HTML 文件结构的基本有效性"""
        index_file = Path("index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查基本 HTML 结构
        assert '<html' in content.lower(), "缺少 HTML 标签"
        assert '<head>' in content.lower(), "缺少 HEAD 标签"
        assert '<body>' in content.lower(), "缺少 BODY 标签"
        assert '</html>' in content.lower(), "缺少 HTML 结束标签"
        
        # 检查是否包含 HelloWorld 相关内容
        hello_keywords = ['hello', 'world', 'helloworld']
        has_hello_content = any(keyword in content.lower() for keyword in hello_keywords)
        assert has_hello_content, "缺少 HelloWorld 相关内容"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        dev_notes_file = Path("docs/469eaa/28ef40/dev-notes.md")
        assert dev_notes_file.exists(), "开发文档文件不存在"
        assert dev_notes_file.is_file(), "开发文档不是一个有效的文件"
    
    def test_dev_notes_contains_project_info(self):
        """测试开发文档是否包含项目相关信息"""
        dev_notes_file = Path("docs/469eaa/28ef40/dev-notes.md")
        content = dev_notes_file.read_text(encoding='utf-8')
        
        # 检查是否包含时钟相关描述
        clock_keywords = ['时钟', 'clock', '实时', 'real-time', '数字']
        has_clock_info = any(keyword in content.lower() for keyword in clock_keywords)
        assert has_clock_info, "开发文档中缺少时钟功能相关描述"
        
        # 检查是否包含位置相关描述
        position_keywords = ['左上角', 'top-left', '位置', 'position']
        has_position_info = any(keyword in content.lower() for keyword in position_keywords)
        assert has_position_info, "开发文档中缺少位置相关描述"