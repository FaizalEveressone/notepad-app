const API_URL = '/api';

// Carregar notas ao iniciar
document.addEventListener('DOMContentLoaded', loadNotes);

// Formulário de nova nota
document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });
        
        if (response.ok) {
            document.getElementById('noteForm').reset();
            loadNotes();
        } else {
            alert('Erro ao salvar nota');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
});

// Carregar notas
async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();
        
        const container = document.getElementById('notesContainer');
        container.innerHTML = '';
        
        if (notes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma nota encontrada</p>';
            return;
        }
        
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.innerHTML = `
                <h3>${escapeHtml(note.title)}</h3>
                <div class="note-content">${escapeHtml(note.content)}</div>
                <small>Criado em: ${new Date(note.createdAt).toLocaleString('pt-BR')}</small>
                <br>
                <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️ Excluir</button>
            `;
            container.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        document.getElementById('notesContainer').innerHTML = '<p style="text-align: center; color: #ff4757;">Erro ao carregar notas</p>';
    }
}

// Excluir nota
async function deleteNote(id) {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
        try {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                loadNotes();
            } else {
                alert('Erro ao excluir nota');
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