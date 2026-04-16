import pytest
from pathlib import Path
import re

class TestHelloWorldFrontend:
    
    def test_index_html_file_exists(self):
        """测试 index.html 文件是否存在"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html 文件不存在"
        assert index_file.is_file(), "index.html 不是一个有效的文件"
    
    def test_html_contains_white_background(self):
        """测试 HTML 文件是否包含白色背景设置"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html 文件不存在"
        
        content = index_file.read_text(encoding='utf-8')
        
        # 检查是否包含白色背景的CSS设置
        white_bg_patterns = [
            r'background-color:\s*white',
            r'background-color:\s*#ffffff',
            r'background-color:\s*#fff',
            r'background:\s*white',
            r'background:\s*#ffffff',
            r'background:\s*#fff'
        ]
        
        has_white_background = any(
            re.search(pattern, content, re.IGNORECASE) 
            for pattern in white_bg_patterns
        )
        
        assert has_white_background, "HTML 文件中未找到白色背景设置"
    
    def test_html_contains_helloworld_content(self):
        """测试 HTML 文件是否包含 HelloWorld 相关内容"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html 文件不存在"
        
        content = index_file.read_text(encoding='utf-8')
        content_lower = content.lower()
        
        # 检查是否包含 HelloWorld 相关文本
        hello_world_patterns = ['hello world', 'helloworld', 'hello-world']
        has_hello_world = any(pattern in content_lower for pattern in hello_world_patterns)
        
        assert has_hello_world, "HTML 文件中未找到 HelloWorld 相关内容"
    
    def test_html_basic_structure(self):
        """测试 HTML 文件是否具有基本的 HTML 结构"""
        index_file = Path("index.html")
        assert index_file.exists(), "index.html 文件不存在"
        
        content = index_file.read_text(encoding='utf-8')
        content_lower = content.lower()
        
        # 检查基本的 HTML 标签
        assert '<html' in content_lower, "HTML 文件缺少 <html> 标签"
        assert '<head' in content_lower, "HTML 文件缺少 <head> 标签"
        assert '<body' in content_lower, "HTML 文件缺少 <body> 标签"
        assert '</html>' in content_lower, "HTML 文件缺少 </html> 结束标签"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        dev_notes_file = Path("docs/361781/ca117f/dev-notes.md")
        assert dev_notes_file.exists(), "开发文档文件不存在"
        assert dev_notes_file.is_file(), "开发文档不是一个有效的文件"
        assert dev_notes_file.suffix == '.md', "开发文档不是 Markdown 格式"