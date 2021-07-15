import { doms } from '../wall.js';
import rte from '../rte/rte.js';
const div = doms('div');

async function fetchRamble(id) {
	const resp = await fetch(`/api/rambles?id=${id}&_expand=note`);
	return await resp.json();
}

export default async function page(id) {
	const resp = await fetchRamble(id);
	const ramble = resp[0];
	console.log(resp);
	const rteNote = rte({ single: true }, div(ramble.note.note));
	const rteRamble = rte(ramble.text);
	return div`class="page-outer th-body"`(
		div`class=th-head`(
			ramble.id, ' ', rteNote
		),
		div(
			rteRamble
		)
	);
}
