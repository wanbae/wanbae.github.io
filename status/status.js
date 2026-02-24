// Service Status Management

const SERVICES = [
    {
        name: 'ChargeBook',
        icon: '⚡',
        url: 'https://ev.proudeng.com',
        description: '전기차 충전 관리 시스템'
    },
    {
        name: 'Proud English',
        icon: '🎧',
        url: 'https://audio.proudeng.com',
        description: '영어 학습 오디오 스트리밍'
    },
    {
        name: 'Reserve Camping (Staging)',
        icon: '🏕️',
        url: 'https://camping-stg.proudeng.com',
        description: '캠핑장 예약 알림 (테스트)'
    },
    {
        name: 'SSCharger (Production)',
        icon: '🔌',
        url: 'https://sscharger.proudeng.com',
        description: '충전소 정보 서비스'
    }
];

let statusChart = null;

// Load status data
async function loadStatusData() {
    try {
        // Try to load from GitHub Actions generated JSON
        const response = await fetch('status.json');
        if (response.ok) {
            const data = await response.json();
            displayStatusData(data);
            return;
        }
    } catch (error) {
        console.log('Status JSON not found, using mock data');
    }

    // Fallback to mock data for initial setup
    displayMockData();
}

// Display status data
function displayStatusData(data) {
    document.getElementById('last-updated').textContent =
        new Date(data.updated).toLocaleString('ko-KR');

    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    let onlineCount = 0;
    let totalResponseTime = 0;
    let validResponseCount = 0;

    data.services.forEach(service => {
        const isOnline = service.status === 200 || service.status === '200';
        if (isOnline) onlineCount++;

        if (service.response_time && !isNaN(service.response_time)) {
            totalResponseTime += parseFloat(service.response_time);
            validResponseCount++;
        }

        const card = createServiceCard(service, isOnline);
        servicesList.appendChild(card);
    });

    // Update overview
    document.getElementById('services-online').textContent =
        `${onlineCount} / ${data.services.length}`;

    if (validResponseCount > 0) {
        const avgResponse = (totalResponseTime / validResponseCount * 1000).toFixed(0);
        document.getElementById('avg-response').textContent = `${avgResponse}ms`;
    }

    // Update chart
    updateResponseTimeChart(data);
}

// Display mock data for testing
function displayMockData() {
    const mockData = {
        updated: new Date().toISOString(),
        services: SERVICES.map((service, index) => ({
            ...service,
            status: 200,
            response_time: (Math.random() * 0.5 + 0.1).toFixed(3),
            last_check: new Date().toISOString()
        }))
    };

    displayStatusData(mockData);

    document.getElementById('last-updated').innerHTML +=
        ' <span style="color: var(--warning);">(Mock Data)</span>';
}

// Create service card element
function createServiceCard(service, isOnline) {
    const card = document.createElement('div');
    card.className = `service-card ${isOnline ? 'online' : 'offline'}`;

    const statusText = isOnline ? 'Online' : 'Offline';
    const statusClass = isOnline ? 'online' : 'offline';
    const responseTime = service.response_time
        ? (parseFloat(service.response_time) * 1000).toFixed(0)
        : 'N/A';

    card.innerHTML = `
        <div class="service-icon">${service.icon || '🌐'}</div>
        <div class="service-info">
            <h3>${service.name}</h3>
            <a href="${service.url}" target="_blank" class="service-url">${service.url}</a>
            <div class="service-meta">
                <span>📍 ${service.description || 'Service'}</span>
                ${service.last_check ? `<span>🕐 ${new Date(service.last_check).toLocaleTimeString('ko-KR')}</span>` : ''}
            </div>
        </div>
        <div class="service-status">
            <div class="status-indicator ${statusClass}">
                ${isOnline ? '✓' : '✗'} ${statusText}
            </div>
            <div class="response-time">
                Response: <strong>${responseTime}ms</strong>
            </div>
        </div>
    `;

    return card;
}

// Update response time chart
function updateResponseTimeChart(data) {
    const ctx = document.getElementById('responseTimeChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (statusChart) {
        statusChart.destroy();
    }

    // Prepare chart data
    const labels = data.services.map(s => s.name);
    const responseTimes = data.services.map(s =>
        s.response_time ? (parseFloat(s.response_time) * 1000).toFixed(0) : 0
    );

    const colors = data.services.map(s => {
        const isOnline = s.status === 200 || s.status === '200';
        return isOnline ? 'rgba(72, 187, 120, 0.8)' : 'rgba(245, 101, 101, 0.8)';
    });

    statusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '응답 시간 (ms)',
                data: responseTimes,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `응답 시간: ${context.parsed.y}ms`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + 'ms';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Auto refresh
let refreshInterval;

function startAutoRefresh(intervalMinutes = 5) {
    refreshInterval = setInterval(() => {
        loadStatusData();
    }, intervalMinutes * 60 * 1000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStatusData();
    startAutoRefresh(5); // Refresh every 5 minutes
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
    if (statusChart) {
        statusChart.destroy();
    }
});
