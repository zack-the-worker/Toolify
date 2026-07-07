<script setup lang="ts">
import { ref, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { PanelLeftCloseIcon, PanelLeftOpenIcon, Search01Icon, GithubIcon } from '@hugeicons/core-free-icons'
import { open as openExternal } from '@tauri-apps/plugin-shell'
import { tools, toolCategories } from './tools/registry'
import { APP_VERSION } from './version'

const REPO_URL = 'https://github.com/zack-the-worker/Toolify'
const COLLAPSE_STORAGE_KEY = 'toolify.sidebarCollapsed'

const activeToolId = ref(tools[0].id)
const activeTool = computed(() => tools.find((t) => t.id === activeToolId.value)!)

const collapsed = ref(localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1')
function toggleCollapsed() {
  collapsed.value = !collapsed.value
  localStorage.setItem(COLLAPSE_STORAGE_KEY, collapsed.value ? '1' : '0')
}

const searchQuery = ref('')
const filteredTools = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return tools
  return tools.filter((t) => t.name.toLowerCase().includes(q))
})
const visibleCategories = computed(() => toolCategories.filter((cat) => toolsInCategory(cat).length > 0))

function toolsInCategory(cat: string) {
  return filteredTools.value.filter((t) => t.category === cat)
}

async function openRepo() {
  try {
    await openExternal(REPO_URL)
  } catch {
    // Not running inside Tauri (e.g. plain browser preview) — fall back to a normal navigation.
    window.open(REPO_URL, '_blank')
  }
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="brand">
        <span v-if="!collapsed" class="brand-name">Toolify</span>
        <button class="collapse-btn" @click="toggleCollapsed" :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
          <HugeiconsIcon :icon="collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon" :size="16" />
        </button>
      </div>

      <div v-if="!collapsed" class="search-box">
        <HugeiconsIcon :icon="Search01Icon" :size="14" class="search-icon" />
        <input v-model="searchQuery" class="search-input" placeholder="Search tools…" spellcheck="false" />
      </div>

      <nav>
        <div v-for="cat in visibleCategories" :key="cat" class="category">
          <div v-if="!collapsed" class="category-label">{{ cat }}</div>
          <button
            v-for="tool in toolsInCategory(cat)"
            :key="tool.id"
            class="tool-item"
            :class="{ active: tool.id === activeToolId }"
            :title="collapsed ? tool.name : ''"
            @click="activeToolId = tool.id"
          >
            <HugeiconsIcon :icon="tool.icon" :size="16" class="tool-icon" />
            <span v-if="!collapsed">{{ tool.name }}</span>
          </button>
        </div>
        <div v-if="filteredTools.length === 0" class="empty-search">No tools match "{{ searchQuery }}"</div>
      </nav>

      <div class="sidebar-footer">
        <span v-if="!collapsed" class="version">v{{ APP_VERSION }}</span>
        <button class="github-btn" @click="openRepo" title="View on GitHub">
          <HugeiconsIcon :icon="GithubIcon" :size="18" />
        </button>
      </div>
    </aside>
    <main class="content">
      <keep-alive>
        <component :is="activeTool.component" :key="activeTool.id" />
      </keep-alive>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.sidebar {
  width: 215px;
  flex-shrink: 0;
  background: var(--sidebar-bg, #181818);
  border-right: 1px solid var(--border, #2a2a2a);
  display: flex;
  flex-direction: column;
  transition: width 0.15s ease;
}
.sidebar.collapsed {
  width: 56px;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 10px 16px;
  -webkit-app-region: drag;
}
.brand-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text, #ddd);
}
.collapse-btn {
  -webkit-app-region: no-drag;
  border: none;
  background: transparent;
  color: var(--muted, #888);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.collapse-btn:hover {
  background: var(--hover-bg, #232323);
  color: var(--text, #ddd);
}
.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 12px 10px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--border, #333);
  background: var(--input-bg, #1e1e1e);
}
.search-icon {
  color: var(--muted, #888);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text, #ddd);
  font-size: 12.5px;
}
nav {
  flex: 1;
  overflow-y: auto;
}
.category {
  margin-bottom: 8px;
}
.category-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted, #666);
  padding: 6px 16px 2px;
}
.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text, #ccc);
  padding: 6px 16px;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.sidebar.collapsed .tool-item {
  justify-content: center;
  padding: 8px 0;
}
.tool-item:hover {
  background: var(--hover-bg, #232323);
}
.tool-item.active {
  background: var(--accent, #3a72ff);
  color: white;
}
.tool-icon {
  width: 16px;
  color: var(--muted, #888);
  flex-shrink: 0;
}
.tool-item.active .tool-icon {
  color: rgba(255, 255, 255, 0.8);
}
.empty-search {
  padding: 10px 16px;
  color: var(--muted, #666);
  font-size: 12px;
}
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--border, #2a2a2a);
  flex-shrink: 0;
}
.sidebar.collapsed .sidebar-footer {
  justify-content: center;
  padding: 10px 0;
}
.version {
  font-size: 11px;
  color: var(--muted, #666);
  font-family: 'SF Mono', Menlo, Consolas, monospace;
}
.github-btn {
  border: none;
  background: transparent;
  color: var(--muted, #888);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.github-btn:hover {
  background: var(--hover-bg, #232323);
  color: var(--text, #ddd);
}
.content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  background: var(--content-bg, #141414);
}
</style>
