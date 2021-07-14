import { doms } from '../wall.js';
const div = doms('div');

async function fetchRamble(id) {
	const resp = await fetch(`/api/rambles?id=${id}&_expand=note`);
	return await resp.json();
}

export default async function page(id) {
	const resp = await fetchRamble(id);
	const ramble = resp[0];
	console.log(resp);
	return div`class=th-body`(
		div`class=th-head`(
			ramble.id, ' ', ramble.note.note
		),
		div(
			ramble.text
		)
	);
}
