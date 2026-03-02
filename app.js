const shiftData = {
    "M9":  { time: "08:00 - 14:00", label: "Morning", dur: "6 hrs" },
    "M27": { time: "09:00 - 15:00", label: "Morning", dur: "6 hrs" },
    "RS":  { time: "11:00 - 17:00", label: "Sliding", dur: "6 hrs" },
    "E14": { time: "14:00 - 20:00", label: "Sliding", dur: "6 hrs" },
    "E12": { time: "14:00 - 02:00", label: "Sliding", dur: "12 hrs" },
    "E25": { time: "20:00 - 02:00", label: "Evening", dur: "6 hrs" },
    "N1":  { time: "20:00 - 08:00", label: "Night",   dur: "12 hrs" },
    "N11": { time: "02:00 - 08:00", label: "Night",   dur: "6 hrs" },
    "X":   { time: "OFF",           label: "Rest",    dur: "-" },
    "0":   { time: "OFF",           label: "Weekend", dur: "-" }
};

async function updateRota() {
    const selectedDate = document.getElementById('date-select').value;
    const query = document.getElementById('staff-search').value.toLowerCase();
    const container = document.getElementById('shift-list');

    try {
        const response = await fetch('rota.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(r => r.length > 5).map(r => r.split(','));
        const headers = rows[0].map(h => h.trim());
        const dateIndex = headers.indexOf(selectedDate);

        if (dateIndex === -1) {
            container.innerHTML = `<p style="padding:20px">No data for ${selectedDate}</p>`;
            return;
        }

        let list = rows.slice(1).map(row => {
            const code = row[dateIndex]?.trim() || "X";
            const info = shiftData[code] || shiftData["X"];
            return {
                name: row[0].trim(),
                code: code,
                info: info,
                isOff: code === "X" || code === "0",
                startTime: info.time.substring(0, 5)
            };
        });

        // Sorting: Working first -> By Time -> By Name
        list.sort((a, b) => {
            if (a.isOff !== b.isOff) return a.isOff ? 1 : -1;
            if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime);
            return a.name.localeCompare(b.name);
        });

        container.innerHTML = list
            .filter(p => p.name.toLowerCase().includes(query))
            .map(p => `
                <div class="shift-card ${p.isOff ? 'off' : ''}" data-code="${p.code}">
                    <div class="staff-info">
                        <h4>${p.name}</h4>
                        <span class="shift-category">${p.info.label} (${p.code})</span>
                    </div>
                    <div class="shift-time">
                        ${p.info.time}
                        <span class="duration">${p.info.dur}</span>
                    </div>
                </div>
            `).join('');
            
    } catch (err) {
        container.innerHTML = "<p>Error loading CSV file.</p>";
    }
}

document.getElementById('date-select').addEventListener('change', updateRota);
document.getElementById('staff-search').addEventListener('input', updateRota);
window.onload = updateRota;