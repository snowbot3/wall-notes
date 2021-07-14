import { css, doms } from '../wall.js';

css(`
a.link-ramble {
	display: block;
	margin: 10px;
	padding: 10px;
	color: black;
}
`);

async function fetchRambles() {
	const resp = await fetch('/api/rambles?_expand=note');
	return await resp.json();
}

function single(ramble) {
	console.log('::COF:: ', ramble);
	return doms(function(div, a){
		return a`class="link-ramble th-head th-corner"
				href=#ramble/${ramble.id}`(
			ramble.id, ' ', ramble.note.note
		);
	});
}

export default async function page() {
	const resp = await fetchRambles();
	return doms(function(div) {
		const divs = resp.map(single);
		return div(...divs);
	});
}
