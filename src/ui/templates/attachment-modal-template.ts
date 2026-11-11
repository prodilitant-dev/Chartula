export function createAttachmentModalHTML(): string {
    return `
        <div class="modal-overlay" id="attachment-modal">
            <div class="modal-content" style="max-width: 800px; padding: 15px;">
                <div class="modal-header" style="margin-bottom: 10px;">
                    <h3>Вложения</h3>
                    <button class="close-btn" id="close-attachment">✖</button>
                </div>
                <div id="attachment-gallery" class="att-gallery"></div>
            </div>
        </div>
    `;
}