export function createSettingsHTML(): string {
    return `
        <div class="modal-overlay" id="settings-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 style="display: flex; align-items: center; gap: 8px; margin: 0;">
                        © 2026 Chartula. 
                        <span id="app-version" title="Проверить обновления" style="font-size: 0.75rem; color: var(--text-muted); cursor: pointer; font-weight: normal; border-bottom: 1px dashed var(--text-muted);">
                            v${__APP_VERSION__}
                        </span>
                    </h3>
                    <button class="close-btn" id="close-settings">✖</button>
                </div>

                <!-- ДАННЫЕ -->
                <div class="settings-section">
                    <div class="settings-header-row">
                        <h4>💾 Данные</h4>
                        <div class="settings-icon-row">
                            <button class="btn icon-only" id="btn-export" title="Экспорт (ZIP)">📦</button>
                            <label class="btn icon-only" title="Импорт (ZIP)">
                                📥
                                <input type="file" id="input-import" accept=".zip" style="display:none;">
                            </label>
                        </div>
                    </div>
                    
                    <!-- Информация о хранилище -->
                    <div id="storage-info" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 15px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px;">
                        <div>Занято: <span id="storage-used">...</span> из <span id="storage-quota">...</span></div>
                        <div style="width: 100%; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 4px;">
                            <div id="storage-bar" style="height: 100%; width: 0%; background: var(--accent); transition: width 0.3s;"></div>
                        </div>
                    </div>

                    <button class="btn btn-danger" id="btn-clear-data" style="width: 100%;">
                        🗑️ Очистить все данные
                    </button>
                </div>

                <!-- ВНЕШНИЙ ВИД -->
                <div class="settings-section">
                    <h4>🎨 Внешний вид</h4>
                    <div class="setting-row">
                        <span>Тема</span>
                        <select id="select-theme" class="filter-select">
                            <option value="system">Системная</option>
                            <option value="dark">Тёмная</option>
                            <option value="light">Светлая</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span>Размер интерфейса</span>
                        <select id="select-fontsize" class="filter-select">
                            <option value="small">Мелкий</option>
                            <option value="medium">Средний</option>
                            <option value="large">Крупный</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span>Сетка</span>
                        <select id="select-grid" class="filter-select">
                            <option value="1">1 колонка</option>
                            <option value="2">2 колонки</option>
                        </select>
                    </div>
                </div>

                <!-- ЦВЕТА КАТЕГОРИЙ -->
                <div class="settings-section" style="border-bottom: none; padding-bottom: 0;">
                    <h4>🏷️ Цвета категорий</h4>
                    <div id="category-colors-list" class="category-colors-list">
                        <!-- Сюда JS вставит список -->
                    </div>
                </div>

                <!-- ОБ АВТОРЕ -->
                <details class="settings-details" style="margin-top: 10px; border-top: 1px dashed var(--border); padding-top: 15px;">
                    <summary>👤 Об авторе</summary>
                    <div class="about-content">
                        <p>Привет. Меня зовут Виталий. Я — <strong>ПроДилИтант</strong>.</p>
                        
                        <!-- Ссылки -->
                        <div class="about-links">
                            <a href="https://t.me/akvariumist2gr" target="_blank" rel="noopener noreferrer">https://t.me/akvariumist2gr</a>
                            <a href="https://t.me/Pro_DilItant" target="_blank" rel="noopener noreferrer">https://t.me/Pro_DilItant</a>
                            <a href="mailto:prodilitant@gmail.com">prodilitant@gmail.com</a>
                        </div>

                        <p>Делаю легкие приложения без рекламы и подписок, пилю доски и делаю всякие разности. Честно. Грязно. Полезно.</p>
                                                
                        <!-- Кнопка поддержки -->
                        <button class="btn btn-support" id="btn-support" style="width: 100%; margin-top: 10px; margin-bottom: 15px;">
                            🤘 Поддержать автора 🤘
                        </button>
                        
                        <p style="color: var(--accent); font-family: var(--font-hand); font-size: 1.5rem; text-align: center;">Pank immortalis est.</p>
                    </div>
                </details>
            </div>
        </div>
    `;
}