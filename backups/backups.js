// Backup Dashboard Management

const PROJECTS = [
    {
        name: 'ChargeBook',
        icon: '⚡',
        database: 'chargebook',
        schedule: '02:00 UTC'
    },
    {
        name: 'Proud English',
        icon: '🎧',
        database: 'proud_english',
        schedule: '02:05 UTC'
    },
    {
        name: 'Reserve Camping',
        icon: '🏕️',
        database: 'camping_alerts',
        schedule: '02:10 UTC'
    }
];

let backupChart = null;

// Load backup data
async function loadBackupData() {
    try {
        // Try to load from GitHub Actions generated JSON
        const response = await fetch('backup-status.json');
        if (response.ok) {
            const data = await response.json();
            displayBackupData(data);
            return;
        }
    } catch (error) {
        console.log('Backup JSON not found, using mock data');
    }

    // Fallback to mock data for initial setup
    displayMockData();
}

// Display backup data
function displayBackupData(data) {
    document.getElementById('last-updated').textContent =
        new Date(data.updated).toLocaleString('ko-KR');

    const backupList = document.getElementById('backup-list');
    backupList.innerHTML = '';

    let successCount = 0;
    let totalSize = 0;

    data.backups.forEach(backup => {
        if (backup.status === 'success') successCount++;
        totalSize += parseSizeToBytes(backup.size);

        const card = createBackupCard(backup);
        backupList.appendChild(card);
    });

    // Update overview
    document.getElementById('successful-backups').textContent =
        `${successCount} / ${data.backups.length}`;
    document.getElementById('total-size').textContent =
        formatBytes(totalSize);

    // Update chart
    updateBackupChart(data);
}

// Display mock data for testing
function displayMockData() {
    const mockData = {
        updated: new Date().toISOString(),
        backups: PROJECTS.map(project => ({
            project: project.name,
            icon: project.icon,
            database: project.database,
            status: 'success',
            last_backup: new Date().toISOString(),
            size: getRandomSize(),
            duration: (Math.random() * 3 + 1).toFixed(1) + 's',
            message: '백업 완료: ' + getRandomSize()
        }))
    };

    displayBackupData(mockData);

    document.getElementById('last-updated').innerHTML +=
        ' <span style="color: var(--warning);">(Mock Data)</span>';
}

function getRandomSize() {
    const sizes = ['420K', '452K', '2.1M', '2.2M', '1.8M'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// Create backup card element
function createBackupCard(backup) {
    const card = document.createElement('div');
    const statusClass = backup.status === 'success' ? 'success' :
                       backup.status === 'warning' ? 'warning' : 'error';

    card.className = `backup-card ${statusClass}`;

    const statusBadge = backup.status === 'success' ? '성공' :
                       backup.status === 'warning' ? '경고' : '실패';

    card.innerHTML = `
        <div class="backup-header">
            <h3>${backup.icon || '📦'} ${backup.project}</h3>
            <span class="backup-badge ${statusClass}">${statusBadge}</span>
        </div>
        <div class="backup-info">
            <div class="backup-info-item">
                <span class="icon">🗄️</span>
                <div>
                    <div class="label">데이터베이스</div>
                    <div class="value">${backup.database}</div>
                </div>
            </div>
            <div class="backup-info-item">
                <span class="icon">🕐</span>
                <div>
                    <div class="label">마지막 백업</div>
                    <div class="value">${new Date(backup.last_backup).toLocaleString('ko-KR', { timeZone: 'UTC' })}</div>
                </div>
            </div>
            <div class="backup-info-item">
                <span class="icon">📦</span>
                <div>
                    <div class="label">백업 크기</div>
                    <div class="value">${backup.size}</div>
                </div>
            </div>
            <div class="backup-info-item">
                <span class="icon">⏱️</span>
                <div>
                    <div class="label">소요 시간</div>
                    <div class="value">${backup.duration || 'N/A'}</div>
                </div>
            </div>
        </div>
        ${backup.message ? `<div class="backup-message">${backup.message}</div>` : ''}
    `;

    return card;
}

// Parse size string to bytes
function parseSizeToBytes(sizeStr) {
    if (!sizeStr) return 0;

    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?)$/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    const multipliers = {
        '': 1,
        'K': 1024,
        'M': 1024 * 1024,
        'G': 1024 * 1024 * 1024,
        'T': 1024 * 1024 * 1024 * 1024
    };

    return value * (multipliers[unit] || 1);
}

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Update backup size chart
function updateBackupChart(data) {
    const ctx = document.getElementById('backupSizeChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (backupChart) {
        backupChart.destroy();
    }

    // Prepare chart data
    const labels = data.backups.map(b => b.project);
    const sizes = data.backups.map(b => {
        const bytes = parseSizeToBytes(b.size);
        return (bytes / (1024 * 1024)).toFixed(2); // Convert to MB
    });

    const colors = data.backups.map(b => {
        if (b.status === 'success') return 'rgba(72, 187, 120, 0.8)';
        if (b.status === 'warning') return 'rgba(246, 173, 85, 0.8)';
        return 'rgba(245, 101, 101, 0.8)';
    });

    backupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '백업 크기 (MB)',
                data: sizes,
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
                            return `백업 크기: ${context.parsed.y} MB`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' MB';
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

function startAutoRefresh(intervalHours = 24) {
    refreshInterval = setInterval(() => {
        loadBackupData();
    }, intervalHours * 60 * 60 * 1000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBackupData();
    startAutoRefresh(24); // Refresh every 24 hours
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
    if (backupChart) {
        backupChart.destroy();
    }
});
