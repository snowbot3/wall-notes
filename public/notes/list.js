import { css, doms } from '../wall.js';
import wall_rte from '../rte/rte.js';
//import { css, dom, doms, elem } from '../wall.js';
//import * as status from '../status.js';
//import log from '../log.js';

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
function singleNote(note) {
	return doms(div=>div`data-id=${note.id} data-created=${note.created}`(note.note));
}
async function fetchNotes() {
	const resp = await fetch('/api/notes?_page=1');
	return await resp.json();
}
async function loadNotes() {
	const notes = await fetchNotes();
	const list = notes.map(singleNote);
	//const [ div, br ] = doms('div', 'br');
	//list.push(div(br()))
	return list;
}

export default async function list(filter) {
	// filter will but used eventually
	const notes = await loadNotes();
	const rte = wall_rte(...notes);
	// TODO: need a better way of handling this. Maybe make notes.elem the promise.
	//await notes.load();
	return rte.elem;
}