import { css, elem, doms } from './wall/js/all.mjs';
import * as status from './status.js';
import { elem as log_elem } from './log.js';
import './theme.js'; // just apply

css(`
* { box-sizing: border-box; }
body {
	font-family: sans-serif;
	margin: 0;
	min-height: 100vh;
	display: grid;
	/* grid-template: 50px auto 24px / 90px auto; */
	grid-template: 50px auto 200px / 90px auto;
}
header {
	grid-column: 1 / span 2;
	grid-row: 1;
	padding: 4px 10px;
	display: flex;
}
header >div {
	flex: 1;
}
header >div >img {
	height: 36px;
	margin: 2px;
}
header >div.header-right {
	text-align: right;
}
nav {
	grid-column: 1;
	grid-row: 2 / span 2;
}
nav > ul {
	list-style: none;
	margin: 6px;
	padding: 6px;
}
section {
	grid-column: 2;
	grid-row: 2;
}
footer {
	grid-column: 2;
	grid-row: 3;
	/* text-align: center; */
	overflow-y: scroll;
}
`);

css.link('./mobile.css');

async function resolve(obj) {
	if (typeof obj == 'function') {
		return resolve(obj());
	} else if(obj instanceof Promise) {
		return await obj;
	}
	return obj;
}

const frame = elem`section`();
async function fetchPage(page) {
	status.push('Loading');
	frame.clear();
	//try {
		const mod = await import(`./pages/${page}.js`);
		const dom = await resolve(mod.default);
		frame.append(dom);
	/*} catch(er) {
		frame.append(elem('div', 'Error: ', er.toString()));
		status.push('Error');
	}*/
	status.pop('Loading');
}

function onHashChange(ev) {
	const hash = location.hash.slice(1);
	const page = hash.split('/', 1)[0] || 'home';
	fetchPage(page);
}
window.addEventListener('hashchange', onHashChange);

status.push('Loading');
const body = elem(document.body);
body.append(...doms(function(header,nav,footer,ul,li,a,div,img,input){
	return [
		header`class=th-head`(
			div(
				img`src=img/logo-black.png`(),
			),
			div(
				input`disabled placeholder="Future Searchbar"`()
			),
			div`class=header-right`(
				status.elem
			)
		),
		nav`class=th-side`(
			ul(
				li(a`href=#`('Notes')),
				li(a`href=#active`('Active')),
				li(a`href=#search`('Search'))
			)
		),
		frame,
		footer(
			log_elem
			//'by snowbot3'
		)
	];
}));

onHashChange();
status.pop('Loading');
