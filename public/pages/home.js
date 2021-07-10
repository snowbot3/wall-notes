import { css, dom, doms, elem } from '../wall.js';

css(`
div.list-notes {
	height: 100%;
}
div.list-notes >div:nth-child(even) {
	background: #f8f8ff;
}
`);

async function data() {
	const resp = await fetch('/api/notes?_page=1');
	return await resp.json();
}

/*
function idle(fn) {
	window.requestIdleCallback(fn);
}
function delay(fn) {
	window.setTimeout(fn, 1);
}
*/

function single(note){
	return doms(div=>div`data-id=${note.id} data-created=${note.created}`(note.note));
}

function inspect(ev, event) {
	if (['ArrowLeft', 'Left', 'ArrowRight', 'Right'].includes(ev.key)) {
		const sel = document.getSelection();
		console.log(`on${event}:arrow: `, sel.focusOffset);
	} else if (ev.key == 'Enter') {
		// a new line is formed. make sure it did not duplicate the id of the previous.
		// and if it is empty, clear the created datetime.
	} else if (ev.key.length > 1) {
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
		this.elem = dom`div class=list-notes
			contentEditable=${true}
			onkeydown=${onKeyDown}
			onkeypress=${onKeyPress}
			onkeyup=${(ev)=>this.onKeyUp(ev)}
			`();
		//this.load();
	}
	onKeyUp(ev) {
		console.log('class keyup');
		onKeyUp(ev);
	}
	async load() {
		const [ div, br ] = doms('div', 'br');
		const notes = await data();
		const list = notes.map(single);
		list.push(div(br()))
		elem(this.elem).append(...list);
	}
	async fetch() {
		const resp = await fetch('/api/notes?_page=1');
		return await resp.json();
	}
}

export default async function page() {
	const page = new NotesPage();
	await page.load();
	return page.elem;
}
