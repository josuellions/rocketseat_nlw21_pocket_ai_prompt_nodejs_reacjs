// Chave para identificar os dados salvos pela aplicação no navegador
const STORAGE_KEY = "prompts_storare"

// Estado carregar os prompts salvos e exibir na sidebar
const state = {
  prompts: [],
  selectedId: null,
}

// Seleciona os elementos principais por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),

  sidebar: document.querySelector(".sidebar"),

  btnCollapse: document.getElementById("btn-collapse"),
  btnOpen: document.getElementById("btn-open"),
  btnSave: document.getElementById("btn-save"),
  btnCopy: document.getElementById("btn-copy"),
  btnNew: document.getElementById("btn-new"),

  promptList: document.getElementById("prompts-list"),

  inputSearch: document.getElementById("search-input"),
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
  // elements.sidebar.style.display = "flex"
  // elements.btnOpen.style.display = "none"

  elements.sidebar.classList.add("open")
  elements.sidebar.classList.remove("collapsed")
}

function collapseSidebar() {
  // elements.sidebar.style.display = "none"
  // elements.btnOpen.style.display = "block"
  elements.sidebar.classList.add("collapsed")
  elements.sidebar.classList.remove("open")
}

function save() {
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()
  const hasContent = elements.promptContent.textContent.trim()

  if (!title || !hasContent) {
    alert("Título e conteúdo são obrigatórios.")
    return
  }

  if (state.selectedId) {
    // Edição de prompt existente
    const promptExisting = state.prompts.find((p) => p.id === state.selectedId)
    if (promptExisting) {
      promptExisting.title = title
      promptExisting.content = content
    }
  } else {
    // Criação de novo prompt
    const newPrompt = {
      id: Date.now().toString(36),
      title,
      content,
    }

    state.prompts.unshift(newPrompt)
    state.selectedId = newPrompt.id
  }

  // Salva no localStorage
  renderPromptList(elements.inputSearch.value)
  alert("Prompt salvo com sucesso!")
  persistState()
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error)
  }
}

function loadState() {
  try {
    const storedPrompts = localStorage.getItem(STORAGE_KEY)
    if (storedPrompts) {
      state.prompts = storedPrompts ? JSON.parse(storedPrompts) : []
      state.selectedId = null
    }
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error)
  }
}

function createPromptListItem(prompt) {
  // Tratativa para não exibir o HTML no texto
  const tmp = document.createElement("div")
  tmp.innerHTML = prompt.content

  return `<li class="prompt-item" data-id="${prompt.id}" data-action="select">
    <div class="prompt-item-content">
      <span class="prompt-item-title">${prompt.title}</span>
      <span class="prompt-item-description">${tmp.textContent}</span>
    </div>  
    <button class="btn-icon" title="Remover" data-action="remove">
      <img src="assets/remove.svg" alt="remover"  class="icon icon-trash" />
    </button>      
  </li>
  `
}

function renderPromptList(filterText = "") {
  const filteredPrompts = state.prompts
    .filter((prompt) =>
      prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())
    )
    .map((item) => createPromptListItem(item))
    .join("")

  elements.promptList.innerHTML = filteredPrompts
}

function add() {
  state.selectedId = null

  elements.promptTitle.textContent = ""
  elements.promptContent.textContent = ""

  updateAllEditableStates()

  elements.promptTitle.focus()
}

function copy() {
  try {
    if (navigator.clipboard) {
      alert("Esse navegador não suporta copiar para a área de transferência!")
      console.info("Clipboard API não suportada nesse navegador")

      return
    }

    const content = elements.promptContent

    navigator.clipboard.writeText(content.innerText)

    alert("Conteúdo copiado para a área de transferência!")

    return
  } catch (error) {
    console.error("Erro ao copiar para a área de transferência: ", error)
  }
}

// Eventos
elements.btnSave.addEventListener("click", save)

elements.btnCopy.addEventListener("click", copy)

elements.btnNew.addEventListener("click", add)

elements.inputSearch.addEventListener("input", (e) => {
  renderPromptList(e.target.value)
})

elements.promptList.addEventListener("click", (e) => {
  const removeBtn = e.target.closest('button[data-action="remove"]')
  const item = e.target.closest("[data-id]")

  if (!item) {
    return
  }

  const promptId = item.getAttribute("data-id")
  state.selectedId = promptId

  if (removeBtn) {
    // Remover prompt
    state.prompts = state.prompts.filter((item) => item.id !== promptId)

    renderPromptList(elements.inputSearch.value)
    persistState()
    return
  }

  if (e.target.closest('[data-action="select"]')) {
    const prompt = state.prompts.find((p) => p.id === promptId)

    if (prompt) {
      state.selectedId = prompt.id
      elements.promptTitle.textContent = prompt.title
      elements.promptContent.innerHTML = prompt.content
      updateAllEditableStates()
    }
  }
})

// Função de inicialização
function init() {
  loadState()
  renderPromptList("")
  attachAllEditableHandlers()
  updateAllEditableStates() // Atualiza o estado inicial ao carregar

  //Estado inicial: sidebar aberta, botão de abrir oculto
  // elements.sidebar.style.display = "flex"
  // elements.btnOpen.style.display = "none"

  elements.sidebar.classList.remove("open")
  elements.sidebar.classList.remove("collapsed")

  // Evento para abrir e fechar a sidebar
  elements.btnOpen.addEventListener("click", openSidebar)
  elements.btnCollapse.addEventListener("click", collapseSidebar)
}

// Executa a inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init)
