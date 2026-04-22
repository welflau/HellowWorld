<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Full Year Calendar - 12 Month View">
    <meta name="author" content="Developer">
    <title>Calendar - Full Year View</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: #2563eb;
            min-height: 100vh;
            color: #333;
            position: relative;
            padding: 20px;
        }

        .digital-clock {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: #1d4ed8;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            z-index: 1000;
        }

        .date-display {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: #1d4ed8;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            z-index: 1000;
        }

        .weekday-display {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: #1d4ed8;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            z-index: 1000;
        }

        .calendar-container {
            max-width: 1400px;
            margin: 80px auto 20px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .year-title {
            text-align: center;
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(45deg, #1d4ed8, #3730a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 40px;
            animation: pulse 2s ease-in-out infinite alternate;
        }

        @keyframes pulse {
            from {
                transform: scale(1);
            }
            to {
                transform: scale(1.05);
            }
        }

        .months-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 20px;
        }

        .month-container {
            background: #f8fafc;
            border-radius: 15px;
            padding: 20px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .month-container:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-color: #1d4ed8;
        }

        .month-header {
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            color: #1d4ed8;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }

        .weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            margin-bottom: 5px;
        }

        .weekday {
            text-align: center;
            font-weight: bold;
            color: #64748b;
            padding: 8px 4px;
            font-size: 0.9rem;
        }

        .days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
        }

        .day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            border-radius: 6px;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .day:hover {
            background: #e2e8f0;
            transform: scale(1.1);
        }

        .day.other-month {
            color: #cbd5e1;
        }

        .day.today {
            background: #1d4ed8;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(29, 78, 216, 0.3);
        }

        .day.weekend {
            color: #dc2626;
        }

        .navigation {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
        }

        .nav-button {
            background: linear-gradient(45deg, #1d4ed8, #3730a3);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(29, 78, 216, 0.3);
        }

        .nav-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(29, 78, 216, 0.4);
        }

        .back-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(45deg, #1d4ed8, #3730a3);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(29, 78, 216, 0.3);
            z-index: 1000;
        }

        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(29, 78, 216, 0.4);
        }

        @media (max-width: 768px) {
            .calendar-container {
                margin: 80px 10px 20px;
                padding: 20px;
            }
            
            .year-title {
                font-size: 2rem;
            }
            
            .months-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .month-container {
                padding: 15px;
            }
            
            .month-header {
                font-size: 1.3rem;
            }
            
            .day {
                font-size: 0.8rem;
            }
            
            .weekday {
                font-size: 0.8rem;
                padding: 6px 2px;
            }
            
            .digital-clock, .date-display, .weekday-display {
                font-size: 1rem;
                padding: 8px 12px;
            }
            
            .digital-clock {
                top: 10px;
                left: 10px;
            }
            
            .date-display {
                top: 10px;
            }
            
            .weekday-display {
                top: 10px;
                right: 10px;
            }
        }

        @media (max-width: 480px) {
            .months-grid {
                grid-template-columns: 1fr;
            }
            
            .month-container {
                padding: 10px;
            }
            
            .day {
                font-size: 0.7rem;
            }
            
            .weekday {
                font-size: 0.7rem;
            }
        }
    </style>
</head>
<body>
    <div class="digital-clock" id="digitalClock"></div>
    <div class="date-display" id="dateDisplay"></div>
    <div class="weekday-display" id="weekdayDisplay"></div>
    
    <div class="calendar-container">
        <div class="navigation">
            <button class="nav-button" onclick="changeYear(-1)">← Previous Year</button>
            <button class="nav-button" onclick="changeYear(1)">Next Year →</button>
        </div>
        
        <h1 class="year-title" id="yearTitle">2024</h1>
        
        <div class="months-grid" id="monthsGrid">
            <!-- 月份日历将通过JavaScript生成 -->
        </div>
    </div>
    
    <a href="index.html" class="back-button">← Back to Home</a>

    <script>
        let currentYear = new Date().getFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekdayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        function updateDateTime() {
            const now = new Date();
            
            // 更新时钟
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('digitalClock').textContent = timeString;
            
            // 更新日期
            const dateString = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            document.getElementById('dateDisplay').textContent = dateString;
            
            // 更新星期
            const weekdayString = weekdayNamesFull[now.getDay()];
            document.getElementById('weekdayDisplay').textContent = weekdayString;
        }

        function getDaysInMonth(year, month) {
            return new Date(year, month + 1, 0).getDate();
        }

        function getFirstDayOfMonth(year, month) {
            return new Date(year, month, 1).getDay();
        }

        function isToday(year, month, day) {
            const today = new Date();
            return year === today.getFullYear() && 
                   month === today.getMonth() && 
                   day === today.getDate();
        }

        function isWeekend(dayOfWeek) {
            return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        }

        function generateMonthCalendar(year, month) {
            const monthContainer = document.createElement('div');
            monthContainer.className = 'month-container';
            
            // 月份标题
            const monthHeader = document.createElement('div');
            monthHeader.className = 'month-header';
            monthHeader.textContent = monthNames[month];
            monthContainer.appendChild(monthHeader);
            
            // 星期标题
            const weekdaysContainer = document.createElement('div');
            weekdaysContainer.className = 'weekdays';
            weekdayNames.forEach(day => {
                const weekdayElement = document.createElement('div');
                weekdayElement.className = 'weekday';
                weekdayElement.textContent = day;
                weekdaysContainer.appendChild(weekdayElement);
            });
            monthContainer.appendChild(weekdaysContainer);
            
            // 日期网格
            const daysGrid = document.createElement('div');
            daysGrid.className = 'days-grid';
            
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfMonth(year, month);
            const daysInPrevMonth = getDaysInMonth(year, month - 1);
            
            // 添加上个月的日期（灰色显示）
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day other-month';
                dayElement.textContent = daysInPrevMonth - i;
                daysGrid.appendChild(dayElement);
            }
            
            // 添加当前月的日期
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.textContent = day;
                
                const dayOfWeek = (firstDay + day - 1) % 7;
                
                if (isWeekend(dayOfWeek)) {
                    dayElement.classList.add('weekend');
                }
                
                if (isToday(year, month, day)) {
                    dayElement.classList.add('today');
                }
                
                daysGrid.appendChild(dayElement);
            }
            
            // 添加下个月的日期（灰色显示）
            const totalCells = daysGrid.children.length;
            const remainingCells = 42 - totalCells; // 6行 × 7列 = 42个单元格
            for (let day = 1; day <= remainingCells; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day other-month';
                dayElement.textContent = day;
                daysGrid.appendChild(dayElement);
            }
            
            monthContainer.appendChild(daysGrid);
            return monthContainer;
        }

        function generateYearCalendar(year) {
            const monthsGrid = document.getElementById('monthsGrid');
            monthsGrid.innerHTML = '';
            
            for (let month = 0; month < 12; month++) {
                const monthCalendar = generateMonthCalendar(year, month);
                monthsGrid.appendChild(monthCalendar);
            }
            
            document.getElementById('yearTitle').textContent = year;
        }

        function changeYear(delta) {
            currentYear += delta;
            generateYearCalendar(currentYear);
        }

        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            updateDateTime();
            setInterval(updateDateTime, 1000);
            generateYearCalendar(currentYear);
        });

        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                changeYear(-1);
            } else if (e.key === 'ArrowRight') {
                changeYear(1);
            }
        });
    </script>
</body>
</html>