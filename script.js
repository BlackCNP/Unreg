document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('statusFilter');
    const rows = document.querySelectorAll('#verbsTable tbody tr');
    
    // Завантажуємо прогрес із пам'яті браузера
    const savedStatuses = JSON.parse(localStorage.getItem('verbProgress')) || {};

    // Функція, яка ховає/показує рядки (фільтрація)
    function applyFilter() {
        const filterValue = filter.value;
        rows.forEach(row => {
            const rowStatus = row.getAttribute('data-status');
            if (filterValue === 'all' || filterValue === rowStatus) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    rows.forEach(row => {
        const verbId = row.getAttribute('data-verb-id');
        const select = row.querySelector('.status-select');

        // 1. Встановлюємо збережений колір при завантаженні
        if (savedStatuses[verbId]) {
            row.setAttribute('data-status', savedStatuses[verbId]);
            select.value = savedStatuses[verbId];
        }

        // 2. Зміна кольору при виборі в селекті
        select.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            
            // ОНОВЛЮЄМО АТРИБУТ (це змусить CSS спрацювати)
            row.setAttribute('data-status', newStatus);

            // Зберігаємо в пам'ять
            savedStatuses[verbId] = newStatus;
            localStorage.setItem('verbProgress', JSON.stringify(savedStatuses));
            
            // Якщо увімкнено фільтр, рядок може зникнути, якщо колір не підходить
            applyFilter();
        });
    });

    // 3. Слухаємо зміни головного фільтра
    filter.addEventListener('change', applyFilter);

    // 4. Запускаємо фільтр одразу (щоб при завантаженні все було чисто)
    applyFilter();
});