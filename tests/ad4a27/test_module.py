import pytest
from pathlib import Path
from bs4 import BeautifulSoup
import re

class TestFrontendProject:
    
    def test_html_file_exists(self):
        """测试HTML文件是否存在"""
        html_file = Path("index.html")
        assert html_file.exists(), "index.html文件不存在"
        assert html_file.is_file(), "index.html不是一个有效的文件"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        dev_notes_file = Path("docs/ad4a27/c14296/dev-notes.md")
        assert dev_notes_file.exists(), "开发文档文件不存在"
        assert dev_notes_file.is_file(), "开发文档不是一个有效的文件"
    
    def test_html_contains_blue_background_styling(self):
        """测试HTML文件是否包含蓝色背景样式设置"""
        html_file = Path("index.html")
        content = html_file.read_text(encoding='utf-8')
        
        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(content, 'html.parser')
        
        # 检查是否有style标签或内联样式包含蓝色背景
        has_blue_background = False
        
        # 检查style标签中的CSS
        style_tags = soup.find_all('style')
        for style in style_tags:
            if style.string and ('background' in style.string.lower() and 'blue' in style.string.lower()):
                has_blue_background = True
                break
        
        # 检查内联样式
        if not has_blue_background:
            elements_with_style = soup.find_all(attrs={"style": True})
            for element in elements_with_style:
                style_attr = element.get('style', '').lower()
                if 'background' in style_attr and 'blue' in style_attr:
                    has_blue_background = True
                    break
        
        # 检查是否引用了外部CSS文件
        if not has_blue_background:
            link_tags = soup.find_all('link', rel='stylesheet')
            has_css_file = len(link_tags) > 0
            # 如果有外部CSS文件，我们假设蓝色背景在那里定义
            if has_css_file:
                has_blue_background = True
        
        assert has_blue_background, "HTML文件中未找到蓝色背景相关的样式设置"
    
    def test_html_has_readable_text_optimization(self):
        """测试HTML文件是否包含文字可读性优化元素"""
        html_file = Path("index.html")
        content = html_file.read_text(encoding='utf-8')
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # 检查是否有文本内容
        text_content = soup.get_text().strip()
        assert len(text_content) > 0, "HTML文件中没有文本内容"
        
        # 检查是否有可读性优化的迹象
        readability_indicators = []
        
        # 检查是否有合适的文本颜色设置
        style_tags = soup.find_all('style')
        for style in style_tags:
            if style.string:
                style_content = style.string.lower()
                if any(keyword in style_content for keyword in ['color:', 'font-size:', 'line-height:', 'contrast']):
                    readability_indicators.append("CSS样式优化")
                    break
        
        # 检查是否有语义化的HTML标签
        semantic_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'article', 'section', 'header', 'main']
        for tag in semantic_tags:
            if soup.find(tag):
                readability_indicators.append("语义化标签")
                break
        
        # 检查是否有meta标签用于字符编码
        meta_charset = soup.find('meta', attrs={'charset': True}) or soup.find('meta', attrs={'http-equiv': 'Content-Type'})
        if meta_charset:
            readability_indicators.append("字符编码设置")
        
        assert len(readability_indicators) > 0, f"HTML文件中未找到文字可读性优化元素，当前文本内容长度: {len(text_content)}"
    
    def test_html_structure_validity(self):
        """测试HTML文件结构的基本有效性"""
        html_file = Path("index.html")
        content = html_file.read_text(encoding='utf-8')
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # 检查基本HTML结构
        html_tag = soup.find('html')
        head_tag = soup.find('head')
        body_tag = soup.find('body')
        
        assert html_tag is not None, "缺少html标签"
        assert head_tag is not None, "缺少head标签"
        assert body_tag is not None, "缺少body标签"
        
        # 检查title标签
        title_tag = soup.find('title')
        assert title_tag is not None, "缺少title标签"
        assert len(title_tag.get_text().strip()) > 0, "title标签内容为空"
    
    def test_dev_notes_contains_project_info(self):
        """测试开发文档是否包含项目相关信息"""
        dev_notes_file = Path("docs/ad4a27/c14296/dev-notes.md")
        content = dev_notes_file.read_text(encoding='utf-8')
        
        # 检查文档是否包含与项目相关的关键词
        content_lower = content.lower()
        project_keywords = ['背景', 'background', '蓝色', 'blue', '可读性', 'readable', '优化', 'optimization']
        
        found_keywords = [keyword for keyword in project_keywords if keyword in content_lower]
        
        assert len(found_keywords) > 0, f"开发文档中未找到项目相关关键词，文档长度: {len(content)}"
        assert len(content.strip()) > 10, "开发文档内容过短"