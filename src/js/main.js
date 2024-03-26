window.update_content = update_content
window.sync_scroll = sync_scroll
window.display_line_count = display_line_count
window.handle_keydown = handle_keydown
window.add_tab = add_tab
window.show_tab = show_tab
window.close_tab = close_tab
window.select_theme = select_theme

const FILES_PATH_LIST = { _1 : undefined }

function element_resolver(id){
  const textarea = document.getElementById(id)
  const pre = document.getElementById(id.replace("textarea","pre"))
  const code = pre.children[0]
  const line_num = document.getElementById(`line-counter-${pre.id.replace("tab-body-pre-","")}`)
  const tab_head = document.getElementById(`tab-head-${pre.id.replace("tab-body-pre-","")}`)
  return {
    textarea, pre, line_num, tab_head, code
  }
}

function handle_keydown(event){
    const {key} = event
    switch (key) {
	    case "Tab":
		    handle_tab(event.target,event)
		    break;
	    case key.match(/\{|\(|\[|\"|\'|\`/)?.input:
		    autocomplete_(event.target, event)
		    break;
	    default:
		    break;
    }

	  if(
	    event.ctrlKey == true &&
	    event.key == "t"
	  ){
		add_tab()
	  }

	  if(
	    event.ctrlKey == true &&
	    event.key == "q"
	  ){
		close_tab(Number(event.target.id.replace("tab-body-textarea-","")))
	  }
	  if(
	    event.ctrlKey == true &&
	    /[0-9]/.test(event.key)
	  ){
	    	if(existing_tab_ids().includes(Number(event.key))) show_tab(Number(event.key))
	  }
	  if(
	    event.ctrlKey == true &&
	    event.key == "f"
	  ){
	    	document.querySelector("#search-field-input").focus()
	    	document.querySelector("#search-field-input").dataset.tab = event.target.id.replace("tab-body-textarea-","")
	  }
	  if(
	    event.ctrlKey == true &&
	    event.key == "Tab"
	  ){
	     cycle_tab(event.target.id)
	  }
	  if(
	    event.ctrlKey == true &&
	    event.key == "G"
	  ){
	    event.target.scrollTop = event.target.scrollHeight
	    event.target.setSelectionRange(event.target.value.length, event.target.value.length)
	  }
	  if(
	    event.ctrlKey == true &&
	    event.key == "g"
	  ){
	    event.target.scrollTop = 0
	    event.target.setSelectionRange(0, 0)
	  }
}

async function update_content(el){
  let text_ = el.value
  if(text_[text_.length-1] == "\n") {
    text_ += " " 
  }
  const highlight = hljs.highlightAuto(
    text_
  )
  element_resolver(el.id).code
  .innerHTML = highlight.value
  status_bar_update(el.id.replace("tab-body-textarea-",""))
  const coordinates = getCaretCoordinates(el, el.selectionEnd);
  suggest_popup(coordinates, el, get_matching_keywords(get_current_word(el).word))
  sync_scroll(el)
  const path = FILES_PATH_LIST[
    `_${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
  ]
  if(path){
    const file_status = document.querySelector("#file-status")
    file_status.textContent = 'saving...'
    await save_file(el)
    file_status.textContent = 'saved'
  }
}

function get_current_word(textarea) {
    const text = textarea.value;
    const caretPos = textarea.selectionStart;
    let startPos = caretPos - 1;
    while (startPos >= 0 && !/\s/.test(text[startPos])) {
        startPos--;
    }
    startPos++;
    let endPos = caretPos;
    while (endPos < text.length && !/\s/.test(text[endPos])) {
        endPos++;
    }
    const currentWord = text.substring(startPos, endPos);
    return { word: currentWord, start: startPos, end: endPos };
}

function get_matching_keywords(pattern) {
   if(pattern.length > 1){
    const regex = new RegExp(pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&'));
    const matchingStrings = keyword_list.filter(item => typeof item === 'string' && regex.test(item));
    return matchingStrings;
   } else {
     return []
   }
}

const rgb_to_hex = (r, g, b) => '#' + [r, g, b]
  .map(x => x.toString(16).padStart(2, '0')).join('')

function suggest_popup(coordinates, el, list){
  if(document.querySelector(`#${el.id}-popup`)){
    document.querySelector(`#${el.id}-popup`).remove()
  }
  const keys = []
  const rgb_values = getComputedStyle(document.querySelector('.hljs-comment')).color.replace("rgb(","").replace(")","").split(",")
  const popup_focus_color = rgb_to_hex(
    Number(rgb_values[0]), Number(rgb_values[1]), Number(rgb_values[2])
  )
  list.forEach(e => {
  	keys.push(
	  `<button 
	  class="
	  outline-none
	  font-semibold
	  text-start
	  focus:bg-[${popup_focus_color + "90"}]
	  ">${e}</button>`
	)
  });
  const font_size = getComputedStyle(el).getPropertyValue('font-size');
  if(keys.length > 0){
    document.querySelector('#tab-container-body > div > textarea').parentElement.insertAdjacentHTML(`beforeend`, `
		  <div id="${el.id}-popup"
		  style="position:absolute"
		  class="z-10 hljs flex flex-col max-h-[100px] overflow-y-auto text-start"
		  >
		    ${keys.join().replaceAll(",","")}
		  </div>
      `)
      const co_x = coordinates.left
      const offset = document.querySelector(`#${el.id}-popup`).clientHeight
      let co_y = (coordinates.top + Number(font_size.replace("px", '')))
      if((coordinates.top - el.scrollTop) >  Math.floor(el.clientHeight - offset)){
	co_y = coordinates.top - (el.scrollTop + offset -  Number(font_size.replace("px", ''))) 
      }
      document.querySelector(`#${el.id}-popup`).style.top = `${co_y}px`
      document.querySelector(`#${el.id}-popup`).style.left = `${co_x}px`
      document.querySelector(`#${el.id}-popup > button`).focus()
      document.querySelector(`#${el.id}-popup`)
      .addEventListener("keydown", function(event) {
	event.preventDefault()
	const total_child = event.target.parentElement.children
	if(event.key == "ArrowUp"){
	  if(document.activeElement.previousSibling instanceof HTMLElement){
	    document.activeElement.previousSibling.focus()
	  } else {
		total_child[total_child.length - 1].focus()
	  }
	} else if(event.key == "ArrowDown"){
	  if(document.activeElement.nextSibling instanceof HTMLElement){
	    document.activeElement.nextSibling.focus()
	  } else {
		total_child[0].focus()
	  }
	} else if(event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "Escape"){
		el.focus()
		document.querySelector(`#${el.id}-popup`).remove()
	}  else if(/[a-zA-Z0-9\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\,]/.test(event.key) && event.key.length == 1){
		el.focus()
	  	caret_pre_update(el, event.key)
	} else if(event.key == "Backspace"){
		simulate_backspace(el)
	  	update_content(el)
	  	if(
		document.querySelector(`#${el.id}-popup`)
		){
		  document.querySelector(`#${el.id}-popup`).remove()
		}
	  	el.focus()
	} else if(event.key == " "){
		el.focus()
	  	caret_pre_update(el," ")
	} else if(event.key == "Tab"){
		el.focus()
	 	caret_pre_update(el,"\t")
	} else if(event.key == "Enter"){
	  	replace_current_word(el, document.activeElement.textContent)
		document.querySelector(`#${el.id}-popup`).remove()
	  	update_content(el)
	  	el.focus()
		document.querySelector(`#${el.id}-popup`).remove()
	}
      })
  }
}

function replace_current_word(textarea, newWord) {
    const { start, end } = get_current_word(textarea);
    const text = textarea.value;
    const newText = text.substring(0, start) + newWord + text.substring(end);
    textarea.value = newText;
    const newCaretPos = start + newWord.length;
    textarea.setSelectionRange(newCaretPos, newCaretPos);
}

function simulate_backspace(textarea) {
    const caretPos = textarea.selectionStart;
    const text = textarea.value;
    if (caretPos > 0) {
        const newText = text.substring(0, caretPos - 1) + text.substring(caretPos);
        textarea.value = newText;
        textarea.setSelectionRange(caretPos - 1, caretPos - 1);
    }
}

function sync_scroll(element) {
  const ref = element_resolver(element.id)
  const result_element = ref.pre
  const line_counter = ref.line_num
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
  line_counter.scrollTop = element.scrollTop;
}

function handle_tab(element,event) {
    event.preventDefault();
    caret_pre_update(element, "\t")
}

function autocomplete_(element,event){
    event.preventDefault();
    const {key} = event
    let comp_char
    switch (key) {
      case "(":
	comp_char = "()"
	break;
      case "{":
	comp_char = "{}"
	break;
      case "[":
	comp_char = "[]"
	break;
      case '"':
	comp_char = '""'
	break;
      case "'":
	comp_char = "''"
	break;
      case "`":
	comp_char = "``"
	break;
      default:
	      break;
    }
    caret_pre_update(element, comp_char)
}

function caret_pre_update(element,value,is_backspace = false){
    let start = element.selectionStart;
    let end = element.selectionEnd;
    if(is_backspace){
      start = start - 1
    }
    element.value = element.value.substring(0, start) +
      value + element.value.substring(end);
    element.selectionStart =
      element.selectionEnd = start + 1;
    update_content(element);
}

function display_line_count(el){
   const ref = element_resolver(el.id)
   ref.line_num
    .innerHTML = ''
   const text_ = el.value
   const line_count = text_.split('\n').length
   for (let index = 1; index <= line_count; index++) {
       ref.line_num
       .innerHTML += `<span>${index}</span>`
   }
}

function tab_count(){
  return document.querySelectorAll('[id^=tab-head-]').length
}

function add_tab(){
	const new_tab_num = tab_count() + 1
  	const tab_head_html = `
	<div class="p-2 flex space-x-2
	  items-center
	  cursor-pointer
	  z-0
	  "
	  onclick="show_tab(${new_tab_num})"
	  id="tab-head-${new_tab_num}"
	>
	  <span id="tab-icon-head">
	    <i class="fa-solid fa-code text-sm"></i>
	  </span>
	  <span id="file-name-${new_tab_num}">Untitled ${new_tab_num}</span>
	  <button class="z-[1]" 
	  onclick="close_tab(${new_tab_num})"
	  >
	    <i class="fa-solid fa-xmark"></i>
	  </button>
      </div>
	`
  	const tab_body_html = `
	<div class="flex flex-col
	     p-2 hljs
	     overflow-y-auto
	     pointer-events-none
	     "
	  id="line-counter-${new_tab_num}">
	  <span>1</span>
	</div>

	<div class="relative w-full h-full hljs">
	  <textarea class="w-full h-full font-mono
	      absolute top-0 left-0  
	      z-[1]
	      p-2
	      text-transparent
	      bg-transparent
	      overflow-auto 
	      resize-none
	      [tab-size:2]
	      outline-none
	    " 
	    id="tab-body-textarea-${new_tab_num}"
	    oninput="
	    update_content(this);
	    display_line_count(this)
	    "
	    onscroll="sync_scroll(this)"
	    onkeydown="handle_keydown(event)"
	    spellcheck="false"
	    ></textarea>
	  <pre 
	      id="tab-body-pre-${new_tab_num}"
	      class="w-full h-full absolute
	      overflow-auto hljs
	      whitespace-break-spaces
	      break-words
	      [tab-size:2]
	      top-0 left-0 z-0 p-2"><code class="
	      font-mono
	      [tab-size:2]
	  "></code></pre>
	</div>
	`
  	const tab_head_parent = document.querySelector("#tab-container-head")
  	const tab_body_parent = document.querySelector("#tab-container-body")
  	tab_head_parent.insertAdjacentHTML("beforeend", tab_head_html)
  	tab_body_parent.insertAdjacentHTML("beforeend", tab_body_html)
  	FILES_PATH_LIST[`_${new_tab_num}`] = undefined
  	show_tab(new_tab_num)
	undo_redo_manager(document.querySelector(`#tab-body-textarea-${new_tab_num}`))
  	set_caret_color()
  	return new_tab_num
}

function show_tab(new_tab_num){
  document.querySelectorAll("[id^=tab-body-textarea-]").forEach((e) => {
	if(Number(e.id.replace("tab-body-textarea-","")) !== new_tab_num){
	  e.parentElement.style.display = "none"
	} else {
	  e.parentElement.style.display = ""
	}
  })
  document.querySelectorAll("[id^=line-counter-]").forEach((e) => {
	if(Number(e.id.replace("line-counter-","")) !== new_tab_num){
	  e.style.display = "none"
	} else {
	  e.style.display = "flex"
	}
  })
  document.querySelectorAll("[id^=tab-head-]").forEach((e) => {
	if(Number(e.id.replace("tab-head-","")) !== new_tab_num){
	  if(!e.classList.contains("brightness-50")){
	    e.classList.add("brightness-50")
	  }
	} else {
	   e.classList.remove("brightness-50")
	}
  })
  document.querySelector(`#tab-body-textarea-${new_tab_num}`).focus()
  status_bar_update(new_tab_num)
}

function check_tab_exist(new_tab_num){
  let tab_exist = false
  document.querySelectorAll("[id^=tab-body-textarea-]").forEach((e) => {
	if(Number(e.id.replace("tab-body-textarea-","")) == new_tab_num){
	  tab_exist = true
	} 
  })
  return tab_exist
}

function existing_tab_ids(){
  const ids = []
  document.querySelectorAll("[id^=tab-head-]").forEach((e) => {
  	ids.push(
	  Number(e.id.replace("tab-head-", ""))
	)
  })
  return ids
}

function close_tab(new_tab_num){
  setTimeout(() => {
  if(new_tab_num && new_tab_num !== null && new_tab_num > 1){
     if(check_tab_exist(new_tab_num - 1)){
       show_tab(new_tab_num - 1)
     } else {
       const tab_ids = existing_tab_ids()
       show_tab(tab_ids[0])
     }
    document.querySelector(`#tab-body-textarea-${new_tab_num}`).parentElement.remove()
    document.querySelector(`#tab-head-${new_tab_num}`).remove()
    document.querySelector(`#line-counter-${new_tab_num}`).remove()
    delete FILES_PATH_LIST[`_${new_tab_num}`]
     }
  },300)
}

function status_bar_update(tab_num){
	const file_status = document.querySelector("#file-status")
  	const file_lang = document.querySelector("#file-language")
  	const file_tab = document.querySelector("#file-tab")
  	const file_line = document.querySelector("#file-line-count")
  	const file_char = document.querySelector("#file-char-count")
  	const file_word = document.querySelector("#file-word-count")
  	const file_size = document.querySelector("#file-size")
  	file_tab.textContent = "T:" + tab_num
  	const text_ = document.querySelector(`#tab-body-textarea-${tab_num}`).value
        const line_count = text_.split('\n').length
  	file_line.textContent = "L:" + line_count
  	const file_info = hljs.highlightAuto(text_)
  	if(file_info.language){
	  const lang = file_info.language
	  file_lang.textContent = /template/.test(lang) ? 'html-mixed' : lang
	  const icon_class_ = /template/.test(lang) ? 'html5' : lang.replace(/\-.*/g,'')
	  const icon_class = search_devicon(icon_class_)
	  if(icon_class !== null && icon_class){
	    document.querySelector(`#tab-head-${tab_num} > #tab-icon-head`)
	      .innerHTML = `<i class="devicon devicon-${icon_class}-plain text-sm"></i>`
	  } else {
	    document.querySelector(`#tab-head-${tab_num} > #tab-icon-head`)
	      .innerHTML = `<i class="fa-solid fa-code text-sm"></i>`
	  }
	}
  	file_word.textContent = "W:" + count_words(text_)
  	file_char.textContent = "C:" + count_char(text_)
  	file_size.textContent = format_file_size(byte_size(text_))
  	if(FILES_PATH_LIST[`_${tab_num}`]){
	  file_status.textContent = "saved"
	} else {
	  file_status.textContent = "unsaved"
	}
}

function search_devicon(value) {
   for (let i = 0; i < devicon_data.length; i++) {
        const obj = devicon_data[i];
        if (obj.name === value) {
            return obj.name;
        }
    }
    for (let i = 0; i < devicon_data.length; i++) {
        const obj = devicon_data[i];
        if (
	  obj.tags && obj.tags.includes(value) &&
	  (obj.tags.includes("language") &&
	    !obj.tags.includes("framework") )
	) {
            return obj.name;
        }
        if (obj.altnames && obj.altnames.includes(value)) {
            return obj.name;
        }
    }
    return null;
}

function count_words(str) {
    str = str.trim();
    if (str === "") {
        return 0;
    }
    return str.split(/\s+/).length;
}

function count_char(str) {
    const strippedString = str.replace(/\s/g, "");
    return strippedString.length;
}

const byte_size = str => new Blob([str]).size;
function format_file_size(bytes,decimalPoint) {
   if(bytes == 0) return '0B';
   var k = 1000,
       dm = decimalPoint || 2,
       sizes = ['B', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}


function undo_redo_manager(textarea){
let undoStack = [];
let redoStack = [];

const saveState = () => {
  undoStack.push(textarea.value);
  redoStack = [];
};

const undo = () => {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    textarea.value = undoStack[undoStack.length - 1];
    update_content(textarea)
    display_line_count(textarea)
  }
};

const redo = () => {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    textarea.value = undoStack[undoStack.length - 1];
    update_content(textarea)
    display_line_count(textarea)
  }
};

textarea.addEventListener('input', () => {
  saveState();
});

textarea.addEventListener('change', () => {
  saveState();
});

textarea.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    undo();
  }
});

textarea.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    redo();
    }
  });
};

undo_redo_manager(document.querySelector("#tab-body-textarea-1"))


let default_theme = localStorage.getItem("theme") !== null &&  localStorage.getItem("theme").length > 0 ? localStorage.getItem("theme") : "default.css"

document.body.addEventListener("keydown", async function (event) {
	if(
	  event.ctrlKey == true &&
	  event.key == "T"
	){
	  theme_list.forEach((e) => {
	  default_theme = localStorage.getItem("theme") !== null &&
	      localStorage.getItem("theme").length > 0 ?
	      localStorage.getItem("theme") : "default.css"
		document.querySelector("#select-theme").insertAdjacentHTML("beforeend", `
			<option value="${e}" ${e == default_theme ? 'selected' : ''}>
			  ${e.replace("base16/","").replaceAll("-"," ").replace(".css",'')}
			</option>
		  `)
	  })
	  document.querySelector("#theme-menu").classList.toggle("hidden")
	  if(!document.querySelector("#theme-menu").classList.contains("hidden")){
	      document.querySelector("#select-theme").focus()
	  } else {
	    document
	      .querySelector(
		`#tab-body-textarea-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`)
	      .focus()
	  }
	}
	if(
	  event.ctrlKey == true &&
	  event.key == "o"
	){
		const tab = document
	    	.querySelector(
		  `#tab-body-textarea-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		)
	       const file_name = document
	    	.querySelector(
		  `#file-name-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		)
	  	const path = await window.__TAURI__.dialog.open({
		  multiple: false,
		  title: "Open File"
		})
		const file_status = document.querySelector("#file-status")
	  	if(path){
		  const divide_path = path.split(/\//)
		  const file_name_ = divide_path[divide_path.length - 1]
		  file_name.textContent = file_name_ +
		    ` ${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		  const content = await window.__TAURI__.fs.readTextFile(path)
		  tab.value = content
		  update_content(tab)
		  display_line_count(tab)
		  tab.focus()
		  if(
		    ` ${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}` == 1
		  ){
		    FILES_PATH_LIST._1 = path
		  } else {
		    FILES_PATH_LIST[
		      `_ ${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		    ] = path
		  }
		  setTimeout(() => {
		    tab.scrollTop = tab.scrollHeight
		    file_status.textContent = 'saved'
		  },100)
		}
	}
	if(
	  event.ctrlKey == true &&
	  event.key == "s"
	){
	  	event.preventDefault()
		const file_status = document.querySelector("#file-status")
	  	file_status.textContent = "saving.."
		const tab = document
	    	.querySelector(
		  `#tab-body-textarea-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		)
	  		await save_file(tab)
			file_status.textContent = "saved"
	}
  	if(event.key == "F11"){
	  const isFullscreen = await window.__TAURI__.window.appWindow.isFullscreen()
	  if(isFullscreen){
		await window.__TAURI__.window.appWindow.setFullscreen(false)
	  } else {
		await window.__TAURI__.window.appWindow.setFullscreen(true)
	  }
	}
	if(
	  event.ctrlKey == true &&
	  event.key == "O"
	){
		const current_tab = document
	    	.querySelector(
		  `#tab-body-textarea-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		)
	  	const path = await window.__TAURI__.dialog.open({
		  multiple: true,
		  directory: false,
		  title: "Open Files"
		})
	  	if(path && path.length > 0){
		  for (let index = 0; index < path.length; index++) {
		    const p = path[index];
		    let new_tab_num
		    if(current_tab.value.length < 1 && 
		    ` ${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}` == 1
		    ) {
		      new_tab_num = 1
		    } else {
		      new_tab_num = add_tab()
		    }
		    const content = await window.__TAURI__.fs.readTextFile(p)
		    const tab = document.querySelector(
		      `#tab-body-textarea-${new_tab_num}`
		    )
		    tab.value = content
		    update_content(tab)
		    display_line_count(tab)
		    const divide_path = p.split(/\//)
		    const file_name_ = divide_path[divide_path.length - 1]
		    document.querySelector(`#file-name-${new_tab_num}`)
		      .textContent = file_name_ + ` ${new_tab_num}` 
		    FILES_PATH_LIST[`_${new_tab_num}`] = p
		    tab.focus()
		    const file_status = document.querySelector("#file-status")
		      setTimeout(() => {
			tab.scrollTop = tab.scrollHeight
			file_status.textContent = "saved"
		      },100)
		  }
	      }
	}
  	if(
	  event.ctrlKey == true &&
	  event.key == "Q"
	){
	  await window.__TAURI__.window.appWindow.close()
	}
})

async function save_file(tab){
    const path = FILES_PATH_LIST[
      `_${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
    ]
  if(path){
	  await window.__TAURI__.fs.writeTextFile(
	    path, tab.value
	  )
    } else {
      const open_save_dialog = await window.__TAURI__.dialog.save({
	title: "Save File"
      })
      	if(open_save_dialog !== null && open_save_dialog){
		const file_status = document.querySelector("#file-status")
	  	file_status.textContent = "saving.."
		const ex_name_s = open_save_dialog.split(/\//)
		const ex_name = ex_name_s[ex_name_s.length - 1]
		const file_name = document
		  .querySelector(
		    `#file-name-${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		  )
		await window.__TAURI__.fs.writeTextFile(
		  open_save_dialog, tab.value
		)
		FILES_PATH_LIST[
		    `_${document.querySelector("#file-tab").textContent.replace("T:", "").trim()}`
		] = open_save_dialog
		file_name.textContent = ex_name
	  	file_status.textContent = "saved"
      	}
    } 
}

function select_theme(event){
  document.querySelector("#theme-link").href = `/js/highlightjs/styles/${event.target.value}`
  localStorage.setItem("theme", event.target.value)
  set_caret_color()
}


document.forms["command_form"]
.addEventListener("submit", function(event){
  event.preventDefault()
  const command = event.srcElement.querySelector('input').value
  const text_elm = document.querySelector(
    `#tab-body-textarea-${event.srcElement.querySelector('input').dataset.tab}`
    )
  const text_ = text_elm.value
    if(/^\//.test(command)){
	  update_content(text_elm)
      	  const rg = command.replace(/\//,'').split(/\/r\=/) 
	  const flag = rg[1].split(/\/f\=/)
       	  const reg = new RegExp(
	    	rg[0],
	    	flag[1]
	    )
	  const new_text_ = text_.replace(reg,flag[0])
	  text_elm.value = new_text_
	  update_content(text_elm)
	  if(flag.length == 1){
	      const instance = new Mark(
	      document.querySelector(
		`#tab-body-pre-${event.srcElement.querySelector('input').dataset.tab} > code`
		 )
	      )
	      instance.mark(flag[0])
	  }

     } else {
       	  update_content(text_elm)
       	  const instance = new Mark(
	  document.querySelector(
	    `#tab-body-pre-${event.srcElement.querySelector('input').dataset.tab} > code`
	     )
	  )
       	  const reg = new RegExp(
	    command.split(/\/f\=/)[0],
	    command.split(/\/f\=/)[1]
	    )
	  instance.markRegExp(reg)
     }
})

function cycle_tab(current_tab){
        const ids = existing_tab_ids() 
        const current_tab_num = Number(current_tab.replace('tab-body-textarea-',''))
  	const index_ = ids.indexOf(current_tab_num)
  	const ids_length = ids.length - 1
  	if(ids_length > index_ && ids_length !== index_){
	    show_tab(ids[index_ + 1])
	} else if(ids_length == index_) {
	    show_tab(ids[0])
	}
}

function set_caret_color(){
  setTimeout(() => {
    const rgb_values = getComputedStyle(
      document.querySelector('.hljs-keyword'))
      .color.replace("rgb(","").replace(")","").split(",")
      const caret_color = rgb_to_hex(
	Number(rgb_values[0]), Number(rgb_values[1]), Number(rgb_values[2])
    )
    document.querySelector("#file-theme").textContent = `${default_theme.replace(".css","").replaceAll("-", "_")}`
    document.querySelectorAll("textarea").forEach((e) => {
	  e.style.caretColor = caret_color
    })
  },100)
}



document.querySelector("#theme-link").href = `/js/highlightjs/styles/${default_theme}`
document.querySelector("#file-theme").textContent = `${default_theme.replace(".css","").replaceAll("-", "_")}`
setTimeout(() => {
  set_caret_color()
  document.querySelector("textarea").focus()
},100)
