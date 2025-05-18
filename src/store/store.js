import { defineStore } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { api } from '../http'
import Fuse from 'fuse.js'
import { remark } from 'remark'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import 'katex/dist/katex.css'
import AppConfig from '../components/AppConfig.vue'

export const useEditStore = defineStore('editStore', () => {
  /* MAIN EDITOR */
  const title = ref('')
  const tags = ref([])
  const content = ref('')
  const rendered_content = ref('')
  const visualized = ref(false)
  const current_oid = ref('')
  const url = ref('')
  const todos = ref([])
  /* TAG EDITOR */
  const tag_editor_visible = ref(false)

  const setCurrentNote = (oid) => {
    current_oid.value = oid
    localStorage.setItem('editor_oid', oid)
    url.value = '/notes/id/'.concat(localStorage.getItem('editor_oid'))
    fetchNote()
  }

  const fetchNote = async () => {
    try {
      url.value = '/notes/id/'.concat(localStorage.getItem('editor_oid'))
      const res = await api.get(url.value)
      console.log(res.data)
      title.value = res.data.title
      tags.value = res.data.tags
      content.value = res.data.content
      todos.value = res.data.todo_list
    } catch (error) {
      console.error(error)
    }
  }

  watchEffect(
    () => {
      remark()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(content.value)
        .then((res) => {
          rendered_content.value = String(res)
        })
        .catch((err) => console.error(err))
    },
    { flush: 'pre' },
  )

  const setVisualized = (state) => {
    visualized.value = state
  }

  const updateNote = async () => {
    try {
      url.value = '/notes/id/'.concat(localStorage.getItem('editor_oid'))
      const res = await api.patch(url.value, {
        title: title.value,
        content: content.value,
        tags: tags.value,
      })
      if (res.status === 200) {
        console.log('Succes')
        await fetchNote()
      } else {
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTodos = async () => {
    const url = "/notes/id/".concat(localStorage.getItem('editor_oid'), "/todos")
    api.get(url).then((res) => {
      todos.value = res.data
    }).catch((err) => {
      console.error(err)
    })
  }
  const addTodo = async (todo_title, priority) => {
    const url = "/notes/id/".concat(localStorage.getItem('editor_oid'), "/todos")
    console.log(url, todo_title, priority)
    api.post(url, {title: todo_title, status: false, priority: priority}).then((res) => {
      if(res.status == 200) {
        fetchTodos()
      }
    }).catch((err) => {
      console.error(err)
    })
  }
  const deleteTodo = async (todo) => {
    const url = "/notes/id/".concat(localStorage.getItem('editor_oid'), "/todos/", todo._id.$oid)
    api.delete(url).then((res) => {
      if (res.status == 200) {
          fetchTodos()
      }
    }).catch((err) => {
      console.error(err)
    })
  }
  const updateTodo = async (todo) => {
    const url = "/notes/id/".concat(localStorage.getItem('editor_oid'), "/todos/", todo._id.$oid)
    api.patch(url, {
      title: todo.title, 
      status: !todo.status, 
      priority: todo.priority
    }).then((res) => {
      if(res.status == 200) {
        fetchTodos()
      } 
    }).catch((err) => {
      console.log(err)
    })
  }


  return {
    setCurrentNote,
    fetchNote,
    updateNote,
    fetchTodos, 
    addTodo,
    deleteTodo,
    updateTodo,
    tag_edtior_visible: tag_editor_visible,
    title,
    tags,
    content,
    rendered_content,
    visualized,
    current_oid,
    todos
  }
})

export const useNoteStore = defineStore('noteStore', () => {
  const notes = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const createNoteEditorVisible = ref(false)

  let intervalID

  const fuse = computed(() => {
    return new Fuse(notes.value, {
      keys: ['title', 'content', 'tags'],
      includeScore: false,
      threshold: 0.3,
    })
  })

  const filteredNotes = computed(() => {
    if (!searchQuery.value) {
      return notes.value //return all notes when search query is empty
    }
    return fuse.value.search(searchQuery.value).map((res) => res.item) //return filltered notes
  })

  onMounted(() => {
    fetchNotes()
    intervalID = setInterval(() => {
      fetchNotes()
    }, 10000)
  })

  onUnmounted(() => {
    clearInterval(intervalID)
  })

  const fetchNotes = async () => {
    loading.value = true
    api
      .get('/notes')
      .then((res) => {
        notes.value = res.data
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const deleteNote = async (oid) => {
    api.delete('/notes/id/' + oid).then((res) => {
      if (res.status === 200) {
        fetchNotes()
      }
    })
  }

  const createNote = async (title, tags) => {
    api
      .post('/notes/create', {
        title: title,
        content: 'Hello flexnotes!',
        tags: tags.split(','),
      })
      .then((res) => {
        if (res.status == 200) {
          fetchNotes()
          createNoteEditorVisible.value = false
        }
      })
  }

  const setCreateDialogVisiblity = (state) => {
    createNoteEditorVisible.value = state
  }

  return {
    notes,
    loading,
    searchQuery,
    createNoteEditorVisible,
    filteredNotes,
    deleteNote,
    fetchNotes,
    createNote,
    setCreateDialogVisiblity,
  }
})
