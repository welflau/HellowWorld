import pytest
from pathlib import Path
from bs4 import BeautifulSoup

class TestCalendarFrontend:
    
    def test_calendar_html_file_exists(self):
        """测试日历页面HTML文件是否存在"""
        calendar_file = Path("frontend/calendar.html")
        assert calendar_file.exists(), "calendar.html文件不存在"
        assert calendar_file.is_file(), "calendar.html不是一个有效的文件"
    
    def test_index_html_file_exists(self):
        """测试首页HTML文件是否存在"""
        index_file = Path("frontend/index.html")
        assert index_file.exists(), "index.html文件不存在"
        assert index_file.is_file(), "index.html不是一个有效的文件"
    
    def test_dev_notes_file_exists(self):
        """测试开发文档文件是否存在"""
        dev_notes_file = Path("docs/30cc44/524964/dev-notes.md")
        assert dev_notes_file.exists(), "dev-notes.md文件不存在"
        assert dev_notes_file.is_file(), "dev-notes.md不是一个有效的文件"
    
    def test_calendar_html_contains_essential_elements(self):
        """测试日历页面包含必要的HTML元素和导航功能"""
        calendar_file = Path("frontend/calendar.html")
        if not calendar_file.exists():
            pytest.skip("calendar.html文件不存在，跳过内容测试")
        
        with open(calendar_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查基本HTML结构
        assert soup.find('html'), "缺少html标签"
        assert soup.find('head'), "缺少head标签"
        assert soup.find('body'), "缺少body标签"
        
        # 检查日历相关元素
        calendar_keywords = ['calendar', 'month', 'year', 'date', '日历', '月份', '年份']
        content_lower = content.lower()
        has_calendar_content = any(keyword in content_lower for keyword in calendar_keywords)
        assert has_calendar_content, "页面内容中缺少日历相关关键词"
    
    def test_index_html_contains_navigation_elements(self):
        """测试首页包含导航元素和页面交互功能"""
        index_file = Path("frontend/index.html")
        if not index_file.exists():
            pytest.skip("index.html文件不存在，跳过内容测试")
        
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查导航相关元素
        navigation_elements = soup.find_all(['nav', 'a', 'button'])
        assert len(navigation_elements) > 0, "页面中缺少导航元素（nav、a或button标签）"
        
        # 检查是否包含交互相关的脚本或元素
        interactive_elements = soup.find_all(['script', 'button', 'input', 'select'])
        interactive_keywords = ['onclick', 'onchange', 'javascript', 'function']
        has_interactive_content = (
            len(interactive_elements) > 0 or 
            any(keyword in content.lower() for keyword in interactive_keywords)
        )
        assert has_interactive_content, "页面缺少交互功能相关元素或脚本"
    
    def test_calendar_page_navigation_links(self):
        """测试日历页面的导航链接功能"""
        calendar_file = Path("frontend/calendar.html")
        if not calendar_file.exists():
            pytest.skip("calendar.html文件不存在，跳过导航测试")
        
        with open(calendar_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查链接元素
        links = soup.find_all('a')
        buttons = soup.find_all('button')
        
        # 至少应该有一些可点击的导航元素
        clickable_elements = len(links) + len(buttons)
        assert clickable_elements > 0, "日历页面缺少可点击的导航元素"
        
        # 检查是否有返回首页或其他页面的链接
        navigation_keywords = ['index', 'home', 'back', '首页', '返回', '主页']
        has_navigation_links = False
        
        for link in links:
            href = link.get('href', '').lower()
            text = link.get_text().lower()
            if any(keyword in href or keyword in text for keyword in navigation_keywords):
                has_navigation_links = True
                break
        
        # 如果没有明显的导航链接，至少应该有按钮用于页面交互
        if not has_navigation_links:
            assert len(buttons) > 0, "页面既没有导航链接也没有交互按钮"