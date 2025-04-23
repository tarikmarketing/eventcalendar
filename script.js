let events = {};
let currentDate = new Date();
let currentDisplayMonth = new Date();

const EVENT_DATA_URL = 'https://cdn.jsdelivr.net/gh/tarikmarketing/eventcalendar/eventdata.json';

async function fetchEvents() {
    try {
        const response = await fetch('EVENT_DATA_URL');
        events = await response.json();
        showCalendarView();
    } catch (error) {
        console.error('Events yüklenirken hata:', error);
    }
}

function updateCalendar() {
    const dateStr = currentDate.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateStr;

    const formattedDate = formatDate(currentDate);
    const dailyEvents = events[formattedDate] || [];
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = dailyEvents.map(event => `
        <div class="event-item">
            <a href="#" onclick="window.open('${event.link}', '_blank');return false;">${event.title}</a>
            <span class="event-detail-link" onclick="window.open('${event.link}', '_blank')">
                Detaylar için Tıklayın
            </span>
        </div>
    `).join('') || '<div class="event-item">Henüz bugün için bir etkinlik belirlenmemiştir, sosyal medya hesaplarımızı takipte kalarak gerçekleşecek etkinliklerden haberdar olabilirsiniz.</div>';
    
    eventsList.innerHTML += `
        <div class="event-item" style="margin-top: 20px;">
            <span></span>
            <span class="event-detail-link" onclick="window.open('https://kisalt1.gg/galalink', '_blank')">
                Sosyal Medya Hesaplarımıza Ulaşmak için Tıklayın
            </span>
        </div>`;

    updateCalendarOverview();
    document.getElementById('calendarOverview').classList.remove('visible');
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateCalendarOverview() {
    const overview = document.getElementById('calendarOverview');
    overview.innerHTML = '';
    
    const firstDay = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth(), 1);
    const lastDay = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth() + 1, 0);
    
    const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    weekDays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day weekday';
        dayEl.textContent = day;
        overview.appendChild(dayEl);
    });

    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        overview.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        const currentDateCopy = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth(), day);
        const dateStr = formatDate(currentDateCopy);
        if (events[dateStr]) {
            dayEl.classList.add('has-event');
        }

        dayEl.onclick = () => {
            currentDate = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth(), day);
            updateCalendar();
        };

        overview.appendChild(dayEl);
    }
}

function navigateDay(offset) {
    const overview = document.getElementById('calendarOverview');
    const isCalendarView = overview.classList.contains('visible');
    
    if (isCalendarView) {
        currentDisplayMonth.setMonth(currentDisplayMonth.getMonth() + offset);
        showCalendarView();
    } else {
        currentDate.setDate(currentDate.getDate() + offset);
        updateCalendar();
    }
}

function showCalendarView() {
    currentDisplayMonth = new Date();
    
    const overview = document.getElementById('calendarOverview');
    const currentDateElement = document.getElementById('currentDate');
    const eventsList = document.getElementById('eventsList');
    
    overview.classList.add('visible');
    
    currentDateElement.textContent = currentDisplayMonth.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long'
    });
    
    const currentMonth = currentDisplayMonth.getMonth();
    const currentYear = currentDisplayMonth.getFullYear();
    let monthlyEventCount = 0;
    
    for (let date in events) {
        const eventDate = new Date(date);
        if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
            monthlyEventCount += events[date].length;
        }
    }
    
    eventsList.innerHTML = `
        <div class="event-item">Bu ay toplamda ${monthlyEventCount} adet etkinliğimiz vardır.</div>
        <div class="event-item" style="margin-top: 20px;">
            <span></span>
            <span class="event-detail-link" onclick="window.open('https://kisalt1.gg/galalink', '_blank')">
                Sosyal Medya Hesaplarımıza Ulaşmak için Tıklayın
            </span>
        </div>`;
    
    updateCalendarOverview();
}

function goToToday() {
    currentDate = new Date();
    updateCalendar();
    document.getElementById('calendarOverview').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', fetchEvents);
