const API_URL = '/api';

// Adicionar campo de item
function addItem() {
    const container = document.getElementById('itemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-input';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Item da lista" class="item-text" required>
        <button type="button" class="remove-item" onclick="removeItem(this)">×</button>
    `;
    container.appendChild(itemDiv);
}

// Remover campo de item
function removeItem(button) {
    if (document.querySelectorAll('.item-input').length > 1) {
        button.parentElement.remove();
    }
}

// Carregar checklists ao iniciar
document.addEventListener('DOMContentLoaded', loadChecklists);

// Formulário de nova checklist
document.getElementById('checklistForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('checklistTitle').value;
    const itemInputs = document.querySelectorAll('.item-text');
    const items = Array.from(itemInputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
    
    if (items.length === 0) {
        alert('Adicione pelo menos um item à checklist');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/checklists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                title, 
                items: items.map(text => ({ text, completed: false }))
            }),
        });
        
        if (response.ok) {
            document.getElementById('checklistForm').reset();
            // Reset para um único campo de item
            document.getElementById('itemsContainer').innerHTML = `
                <div class="item-input">
                    <input type="text" placeholder="Item da lista" class="item-text" required>
                    <button type="button" class="remove-item" onclick="removeItem(this)">×</button>
                </div>
            `;
            loadChecklists();
        } else {
            alert('Erro ao salvar checklist');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
});

// Carregar checklists
async function loadChecklists() {
    try {
        const response = await fetch(`${API_URL}/checklists`);
        const checklists = await response.json();
        
        const container = document.getElementById('checklistsContainer');
        container.innerHTML = '';
        
        if (checklists.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma checklist encontrada</p>';
            return;
        }
        
        checklists.forEach(checklist => {
            const checklistElement = document.createElement('div');
            checklistElement.className = 'checklist-item';
            checklistElement.innerHTML = `
                <h3>${escapeHtml(checklist.title)}</h3>
                <div class="checklist-items" id="checklist-${checklist.id}"></div>
                <small>Criado em: ${new Date(checklist.createdAt).toLocaleString('pt-BR')}</small>
                <br>
                <button class="delete-btn" onclick="deleteChecklist(${checklist.id})">🗑️ Excluir Checklist</button>
            `;
            container.appendChild(checklistElement);
            
            // Carregar itens da checklist
            loadChecklistItems(checklist.id, checklist.items);
        });
    } catch (error) {
        console.error('Erro ao carregar checklists:', error);
        document.getElementById('checklistsContainer').innerHTML = '<p style="text-align: center; color: #ff4757;">Erro ao carregar checklists</p>';
    }
}

// Carregar itens de uma checklist
function loadChecklistItems(checklistId, items) {
    const container = document.getElementById(`checklist-${checklistId}`);
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `checklist-item-row ${item.completed ? 'completed' : ''}`;
        itemElement.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''} 
                   onchange="toggleItem(${checklistId}, ${item.id})">
            <label>${escapeHtml(item.text)}</label>
        `;
        container.appendChild(itemElement);
    });
}

// Alternar estado do item
async function toggleItem(checklistId, itemId) {
    try {
        const response = await fetch(`${API_URL}/checklists/${checklistId}/items/${itemId}/toggle`, {
            method: 'PUT',
        });
        
        if (!response.ok) {
            alert('Erro ao atualizar item');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// Excluir checklist
async function deleteChecklist(id) {
    if (confirm('Tem certeza que deseja excluir esta checklist?')) {
        try {
            const response = await fetch(`${API_URL}/checklists/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                loadChecklists();
            } else {
                alert('Erro ao excluir checklist');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        }
    }
}

// Função para evitar XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}