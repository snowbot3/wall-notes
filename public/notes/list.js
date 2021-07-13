import { css, dom, doms, elem } from '../wall.js';
import * as status from '../status.js';
import log from '../log.js';

css(`
div.list-notes {
	height: 100%;
	padding: 18px 0;
}
div.list-notes >div {
	padding: 2px 20px;
}
`);

/*
function idle(fn) {
	window.requestIdleCallback(fn);
}
function delay(fn) {
	window.setTimeout(fn, 1);
}
*/

function inspect(ev, event) {
	/* if (['ArrowLeft', 'Left', 'ArrowRight', 'Right'].includes(ev.key)) {
		const sel = document.getSelection();
		console.log(`on${event}:arrow: `, sel.focusOffset);
	} else */
	if (ev.key.length > 1) {
		console.log(`on${event}: `, ev.key);
		// single characters or Spacebar should label the current not as dirty.
	} else if (ev.key == 'i') {
		const sel = document.getSelection();
		console.log(`on${event}:i: `, sel.anchorNode, sel.anchorNode.textContent);
		//idle(()=>console.log(`on${event}:idle: `, sel.anchorNode, sel.anchorNode.textContent))
		//delay(()=>console.log(`on${event}:delay: `, sel.anchorNode, sel.anchorNode.textContent))
	}
}

function onKeyDown(ev) {
	inspect(ev, 'keydown');
}

function onKeyPress(ev) {
	inspect(ev, 'keypress');
}

function onKeyUp(ev) {
	inspect(ev, 'keyup');
}

class NotesPage {
	constructor() {
		this.elem = dom`div class="list-notes th-even"
			contentEditable=${true}
			onkeydown=${(ev)=>this.onKeyDown(ev)}
			onkeypress=${(ev)=>this.onKeyPress(ev)}
			onkeyup=${(ev)=>this.onKeyUp(ev)}
			`();
		//this.load();
	}
	onKeyDown(ev) {
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key}`);
		onKeyDown(ev);
		if (['Backspace','Enter'].includes(ev.key)) {
			// check for changes?
			console.log('::COF:: Down:: ', ev.key);
			const sel = window.getSelection();
			this.fromDown = {
				focusNode: sel.focusNode,
			};
		}
	}
	onKeyPress(ev) {
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key}`);
		onKeyPress(ev);
	}
	onKeyUp(ev) {
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key}`);
		onKeyUp(ev);
		if (ev.key == 'Enter') {
			const sel = window.getSelection();
			const div = this.findNoteDiv(sel.focusNode);
			delete div.dataset.id;
			if (div.textContent == '') {
				delete div.dataset.created;
				delete div.dataset.dirty;
			}
		} else if (ev.key == 'Backspace') {
			console.log('::COF:: Up:: ', this.fromDown.focusNode.parentElement);
			const sel = window.getSelection();
			if (sel.focusNode == this.fromDown.focusNode) {
				// This is not easy.
			}
		} else if (ev.key.length == 1) {
			// not sure about alt key checking yet.
			if (!this.dirty) {
				this.dirty = true;
				status.push('Dirty');
			}
			const sel = window.getSelection();
			const div = this.findNoteDiv(sel.focusNode);
			if (!div.dataset.dirty) {
				div.dataset.dirty = 'dirty'; // would a timestamp help here?
				if (!div.dataset.created) {
					div.dataset.created = (new Date()).toString();
				}
			}
		}
	}
	findNoteDiv(node) {
		if (!node || !node.parentElement) {
			throw new Error('wall-notes: list-notes: No path to parent note element');
		}
		if (node.parentElement.classList.contains('list-notes')) {
			return node;
		}
		return this.findNoteDiv(node.parentElement);
	}
	single(note) {
		return doms(div=>div`data-id=${note.id} data-created=${note.created}`(note.note));
	}
	async load() {
		const [ div, br ] = doms('div', 'br');
		const notes = await this.fetch();
		const list = notes.map(this.single);
		list.push(div(br()))
		elem(this.elem).append(...list);
	}
	async fetch() {
		const resp = await fetch('/api/notes?_page=1');
		return await resp.json();
	}
}

export default async function list(filter) {
	// filter will but used eventually
	const notes = new NotesPage(filter);
	// TODO: need a better way of handling this. Maybe make notes.elem the promise.
	await notes.load();
	return notes.elem;
}