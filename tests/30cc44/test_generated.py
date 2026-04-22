import pytest
from pathlib import Path
from bs4 import BeautifulSoup
import re

class TestCalendarFrontend:
    
    def test_calendar_html_file_exists(self):
        """测试日历HTML文件是否存在"""
        calendar_file = Path("frontend/calendar.html")
        assert calendar_file.exists(), "calendar.html文件不存在"
        assert calendar_file.is_file(), "calendar.html不是一个有效的文件"
    
    def test_calendar_html_contains_essential_elements(self):
        """测试日历HTML文件包含必要的页面元素"""
        calendar_file = Path("frontend/calendar.html")
        
        with open(calendar_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查基本HTML结构
        assert soup.find('html'), "缺少html标签"
        assert soup.find('head'), "缺少head标签"
        assert soup.find('body'), "缺少body标签"
        
        # 检查日历相关元素
        title = soup.find('title')
        assert title and '日历' in title.get_text(), "页面标题应包含'日历'"
        
        # 检查是否包含日历容器或表格
        calendar_container = soup.find(['div', 'table'], class_=re.compile(r'calendar|日历', re.I))
        calendar_by_id = soup.find(['div', 'table'], id=re.compile(r'calendar|日历', re.I))
        
        assert calendar_container or calendar_by_id, "页面应包含日历容器元素"
    
    def test_calendar_html_has_proper_styling_structure(self):
        """测试日历HTML文件具有合适的样式结构"""
        calendar_file = Path("frontend/calendar.html")
        
        with open(calendar_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查CSS样式引用或内联样式
        has_external_css = soup.find('link', rel='stylesheet')
        has_internal_css = soup.find('style')
        has_inline_styles = bool(soup.find_all(attrs={'style': True}))
        
        assert has_external_css or has_internal_css or has_inline_styles, \
            "日历页面应包含CSS样式定义"
        
        # 检查响应式设计相关的meta标签
        viewport_meta = soup.find('meta', attrs={'name': 'viewport'})
        assert viewport_meta, "应包含viewport meta标签以支持响应式设计"
    
    def test_dev_notes_file_exists_and_contains_calendar_info(self):
        """测试开发文档文件存在并包含日历相关信息"""
        dev_notes_file = Path("docs/30cc44/3e29b7/dev-notes.md")
        
        assert dev_notes_file.exists(), "开发文档文件不存在"
        assert dev_notes_file.is_file(), "dev-notes.md不是一个有效的文件"
        
        with open(dev_notes_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查文档是否包含日历相关内容
        calendar_keywords = ['日历', 'calendar', '布局', 'layout', '样式', 'style']
        has_calendar_content = any(keyword in content.lower() for keyword in calendar_keywords)
        
        assert has_calendar_content, "开发文档应包含日历相关的内容描述"
    
    def test_calendar_html_contains_month_and_date_structure(self):
        """测试日历HTML包含月份和日期的基本结构"""
        calendar_file = Path("frontend/calendar.html")
        
        with open(calendar_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
        
        # 检查是否包含月份相关元素
        month_elements = soup.find_all(text=re.compile(r'[1-9]|10|11|12|一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'))
        
        # 检查是否包含日期网格结构（表格或网格布局）
        date_grid = soup.find('table') or soup.find('div', class_=re.compile(r'grid|日期|date', re.I))
        
        assert month_elements or date_grid, "日历应包含月份或日期显示结构"