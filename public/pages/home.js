import { css, doms } from '../wall.js';
import singleNote from '../notes/single.js';

async function data() {
	const resp = await fetch('/api/notes?_page=1');
	const json = await resp.json();
	return json;
}

export default async function page() {
	const notes = await data();
	return doms(div=>div(
		div(...(
			notes.map(singleNote)
		))
	));
}
