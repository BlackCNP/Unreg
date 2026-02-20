document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('statusFilter');
    const tbody = document.querySelector('#verbsTable tbody');
    const savedStatuses = JSON.parse(localStorage.getItem('verbProgress')) || {};

    // Функція сортування
    function applySort() {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const priorityColor = filter.value; // Колір, який хочемо бачити першим

        // Вага кольорів для стандартного сортування
        const weights = { 'green': 3, 'yellow': 2, 'red': 1 };

        rows.sort((a, b) => {
            const statusA = a.getAttribute('data-status');
            const statusB = b.getAttribute('data-status');

            // Якщо обрано конкретний колір у фільтрі - він отримує найвищий пріоритет
            if (priorityColor !== 'all') {
                if (statusA === priorityColor && statusB !== priorityColor) return -1;
                if (statusB === priorityColor && statusA !== priorityColor) return 1;
            }

            // В іншому випадку сортуємо: Зелені -> Жовті -> Червоні
            return weights[statusB] - weights[statusA];
        });

        // Перемальовуємо таблицю в новому порядку
        rows.forEach(row => tbody.appendChild(row));
    }

    // Налаштування кожного рядка
    const initRows = tbody.querySelectorAll('tr');
    initRows.forEach(row => {
        const verbId = row.getAttribute('data-verb-id');
        const select = row.querySelector('.status-select');

        // Відновлюємо статус або ставимо 'red' (червоний) за замовчуванням
        const currentStatus = savedStatuses[verbId] || 'red';
        row.setAttribute('data-status', currentStatus);
        select.value = currentStatus;

        select.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            row.setAttribute('data-status', newStatus);
            
            // Зберігаємо
            savedStatuses[verbId] = newStatus;
            localStorage.setItem('verbProgress', JSON.stringify(savedStatuses));
            
            // Після зміни статусу — пересортовуємо таблицю
            applySort();
        });
    });

    // Слухач для зміни головного пріоритету
    filter.addEventListener('change', applySort);

    // Сортуємо одразу при завантаженні
    applySort();
});
