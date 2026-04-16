import pytest
from pathlib import Path
import re

class TestFrontendStyles:
    
    def test_css_file_exists_and_readable(self):
        """测试CSS样式文件是否存在且可读取"""
        css_file = Path("frontend/styles.css")
        assert css_file.exists(), "CSS文件不存在"
        assert css_file.is_file(), "CSS路径不是文件"
        
        # 测试文件可读取且不为空
        content = css_file.read_text(encoding='utf-8')
        assert len(content.strip()) > 0, "CSS文件内容为空"
    
    def test_html_file_structure_and_elements(self):
        """测试HTML文件结构完整性和关键元素存在"""
        html_file = Path("frontend/index.html")
        assert html_file.exists(), "HTML文件不存在"
        
        content = html_file.read_text(encoding='utf-8')
        
        # 检查基本HTML结构
        assert "<!DOCTYPE html>" in content or "<html" in content, "缺少HTML文档声明"
        assert "<head>" in content, "缺少head标签"
        assert "<body>" in content, "缺少body标签"
        
        # 检查CSS引用
        assert 'styles.css' in content or '.css' in content, "HTML文件未引用CSS样式文件"
        
        # 检查是否包含常见的页面元素
        has_content_elements = any(tag in content.lower() for tag in 
                                 ['<div', '<section', '<main', '<article', '<header'])
        assert has_content_elements, "HTML文件缺少主要内容元素"
    
    def test_css_contains_valid_styles(self):
        """测试CSS文件包含有效的样式规则和属性"""
        css_file = Path("frontend/styles.css")
        content = css_file.read_text(encoding='utf-8')
        
        # 检查是否包含CSS选择器和属性
        css_pattern = r'[.#]?[\w-]+\s*\{[^}]*\}'
        css_rules = re.findall(css_pattern, content, re.MULTILINE | re.DOTALL)
        assert len(css_rules) > 0, "CSS文件不包含有效的样式规则"
        
        # 检查常见CSS属性
        common_properties = ['color', 'background', 'font', 'margin', 'padding', 
                           'width', 'height', 'display', 'position']
        has_properties = any(prop in content.lower() for prop in common_properties)
        assert has_properties, "CSS文件缺少常见的样式属性"
    
    def test_dev_notes_documentation_exists(self):
        """测试开发文档是否存在且包含有用信息"""
        doc_file = Path("docs/f251c7/532be6/dev-notes.md")
        assert doc_file.exists(), "开发文档不存在"
        
        content = doc_file.read_text(encoding='utf-8')
        assert len(content.strip()) > 50, "开发文档内容过少"
        
        # 检查是否包含开发相关的关键词
        dev_keywords = ['样式', 'style', '设计', 'design', '前端', 'frontend', 
                       '页面', 'page', 'css', 'html']
        has_dev_content = any(keyword in content.lower() for keyword in dev_keywords)
        assert has_dev_content, "开发文档缺少相关技术内容"
    
    def test_project_file_structure_integrity(self):
        """测试项目文件结构的完整性"""
        frontend_dir = Path("frontend")
        docs_dir = Path("docs/f251c7/532be6")
        
        assert frontend_dir.exists(), "frontend目录不存在"
        assert docs_dir.exists(), "文档目录不存在"
        
        # 检查所有必需文件都存在
        required_files = [
            Path("frontend/styles.css"),
            Path("frontend/index.html"),
            Path("docs/f251c7/532be6/dev-notes.md")
        ]
        
        for file_path in required_files:
            assert file_path.exists(), f"必需文件 {file_path} 不存在"
            assert file_path.stat().st_size > 0, f"文件 {file_path} 为空"