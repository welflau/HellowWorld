import pytest
from pathlib import Path
import re
from datetime import datetime

class TestHelloWorldClock:
    
    def test_index_html_file_exists(self):
        """测试index.html文件是否存在"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html文件不存在"
        assert index_file.is_file(), "index.html不是一个有效的文件"
    
    def test_html_contains_clock_elements(self):
        """测试HTML文件是否包含时钟相关的关键元素"""
        index_file = Path("index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含时钟容器元素
        assert re.search(r'<.*?id=["\'].*?clock.*?["\'].*?>', content, re.IGNORECASE), \
            "HTML中未找到时钟相关的元素ID"
        
        # 检查是否包含JavaScript时钟更新逻辑
        assert 'setInterval' in content or 'setTimeout' in content, \
            "HTML中未找到定时器相关的JavaScript代码"
        
        # 检查是否包含时间格式化相关代码
        time_related_keywords = ['Date', 'getHours', 'getMinutes', 'getSeconds', 'toLocaleTimeString']
        has_time_code = any(keyword in content for keyword in time_related_keywords)
        assert has_time_code, "HTML中未找到时间处理相关的JavaScript代码"
    
    def test_html_structure_and_positioning(self):
        """测试HTML结构是否正确设置了左上角定位的时钟"""
        index_file = Path("index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含HelloWorld相关内容
        hello_keywords = ['hello', 'world', 'Hello', 'World']
        has_hello_content = any(keyword in content for keyword in hello_keywords)
        assert has_hello_content, "HTML中未找到HelloWorld相关内容"
        
        # 检查CSS定位样式（左上角定位）
        positioning_patterns = [
            r'position\s*:\s*fixed',
            r'position\s*:\s*absolute',
            r'top\s*:\s*\d+',
            r'left\s*:\s*\d+'
        ]
        
        has_positioning = any(re.search(pattern, content, re.IGNORECASE) 
                            for pattern in positioning_patterns)
        assert has_positioning, "HTML中未找到时钟左上角定位的CSS样式"
    
    def test_dev_notes_documentation_exists(self):
        """测试开发文档是否存在并包含相关说明"""
        dev_notes_file = Path("docs/469eaa/28ef40/dev-notes.md")
        
        if dev_notes_file.exists():
            content = dev_notes_file.read_text(encoding='utf-8')
            
            # 检查文档是否包含时钟相关的说明
            clock_keywords = ['时钟', 'clock', '实时', 'real-time', '左上角']
            has_clock_docs = any(keyword in content.lower() for keyword in clock_keywords)
            assert has_clock_docs, "开发文档中未找到时钟功能相关说明"
        else:
            # 如果文档不存在，记录警告但不失败测试
            pytest.skip("开发文档文件不存在，跳过文档测试")
    
    def test_html_basic_structure(self):
        """测试HTML文件的基本结构是否完整"""
        index_file = Path("index.html")
        content = index_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert '<html' in content.lower(), "HTML文件缺少html标签"
        assert '<head' in content.lower(), "HTML文件缺少head标签"
        assert '<body' in content.lower(), "HTML文件缺少body标签"
        
        # 检查是否有标题
        assert '<title' in content.lower() or '<h1' in content.lower() or '<h2' in content.lower(), \
            "HTML文件缺少标题元素"