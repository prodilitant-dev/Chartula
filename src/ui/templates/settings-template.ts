export function createSettingsHTML(): string {
    return `
        <div class="modal-overlay" id="settings-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Настройки</h3>
                    <button class="close-btn" id="close-settings">✖</button>
                </div>

                <!-- БЛОК: ДАННЫЕ -->
                <div class="settings-section">
                    <h4>💾 Данные</h4>
                    <p class="settings-hint">Хранятся локально на устройстве.</p>
                    <div class="settings-actions">
                        <button class="btn" id="btn-export">📦 Экспорт (ZIP)</button>
                        <label class="btn">
                            📥 Импорт (ZIP)
                            <input type="file" id="input-import" accept=".zip" style="display:none;">
                        </label>
                    </div>
                </div>

                <!-- БЛОК: ВНЕШНИЙ ВИД -->
                <div class="settings-section">
                    <h4>🎨 Внешний вид</h4>
                    <div class="setting-row">
                        <span>Тема</span>
                        <select id="select-theme" class="filter-select">
                            <option value="dark">Тёмная</option>
                            <option value="light">Светлая</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span>Размер шрифта</span>
                        <select id="select-fontsize" class="filter-select">
                            <option value="small">Мелкий</option>
                            <option value="medium">Средний</option>
                            <option value="large">Крупный</option>
                        </select>
                    </div>
                </div>

                <!-- БЛОК: ОБ АВТОРЕ (Спойлер) -->
                <details class="settings-details">
                    <summary>👤 Об авторе</summary>
                    <div class="about-content">
                        <p>Привет. Меня зовут Виталик. Я — <strong>ПроДилИтант</strong>.</p>
                        <p>Верхом на ИИ, Ctrl+C, Ctrl+V, погнали к новым горизонтам. Делаю приложения, пилю доски и создаю инструменты, которые меняют жизни. Честно. Грязно. Полезно.</p>
                        <p style="color: var(--accent); font-family: var(--font-hand); font-size: 1.5rem; margin-top: 15px;">Pank immortalis est.</p>
                    </div>
                </details>
            </div>
        </div>
    `;
}