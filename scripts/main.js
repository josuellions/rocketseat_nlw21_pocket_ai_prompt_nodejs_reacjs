// Seleciona os elementos principais por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),

  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
}

// Função que atualiza o estado visual do wrapper conforme o conteúdo
function updateEditableWrapperState(element, wrapper) {
  const hasContent = element.textContent.trim().length > 0

  wrapper.classList.toggle("is-empty", !hasContent)
}

// Atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

// Adiciona os ouvintes de eventos input para atualização em tempo real
function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener("input", () => {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })

  elements.promptContent.addEventListener("input", () => {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
}

// Função para abrir a sidebar
function openSidebar() {
  elements.sidebar.style.display = "flex"
  elements.btnOpen.style.display = "none"
}

function collapseSidebar() {
  elements.sidebar.style.display = "none"
  elements.btnOpen.style.display = "block"
}

// Função de inicialização
function init() {
  attachAllEditableHandlers()
  updateAllEditableStates() // Atualiza o estado inicial ao carregar

  //Estado inicial: sidebar aberta, botão de abrir oculto
  elements.sidebar.style.display = "flex"
  elements.btnOpen.style.display = "none"

  // Evento para abrir e fechar a sidebar
  elements.btnOpen.addEventListener("click", openSidebar)
  elements.btnCollapse.addEventListener("click", collapseSidebar)
}

// Executa a inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init)
