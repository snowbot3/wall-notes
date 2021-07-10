import { css, elem, doms } from './wall/js/all.mjs';
import theme from './theme.js';

css(`
body {
	margin: 0;
	min-height: 100vh;
	display: grid;
	grid-template: 50px auto 24px / 150px auto;
}
header {
	grid-column: 1 / span 2;
	grid-row: 1;
	background: ${theme.head.bg};
	padding: 4px 10px;
}
header >img {
	height: 36px;
	margin: 2px;
}
nav {
	grid-column: 1;
	grid-row: 2 / span 2;
	background: ${theme.side.bg};
}
section {
	grid-column: 2;
	grid-row: 2;
	padding: 20px;
}
section >div {
	height: 100%;
}
footer {
	grid-column: 2;
	grid-row: 3;
	text-align: center;
}
`);

async function resolve(obj) {
	if (typeof obj == 'function') {
		return resolve(obj());
	} else if(obj instanceof Promise) {
		return await obj;
	}
	return obj;
}

const frame = elem`div`();
async function fetchPage(page) {
	frame.clear();
	try {
		const mod = await import(`./pages/${page}.js`);
		const dom = await resolve(mod.default);
		frame.append(dom);
	} catch(er) {
		frame.append(elem('div', 'Error: ', er));
	}
}

function onHashChange(ev) {
	const hash = location.hash.slice(1);
	//if (hash[0] == '#') { hash = hash.slice(1); }
	//let ind = hash.indexOf('/');
	//if (ind == -1) { ind = hash.length; }
	//const page = hash.slice(0, ind) || 'home';
	const page = hash.split('/',1)[0] || 'home';
	fetchPage(page);
}
window.addEventListener('hashchange', onHashChange);

const body = elem(document.body);
body.append(...doms(function(header,h1,nav,section,footer,ul,li,a,img){
	return [
		header(
			img`src=img/logo-black.png`()
		),
		nav(
			ul(
				li(a`href=#`('Notes')),
				li(a`href=#active`('Active')),
				li(a`href=#search`('Search'))
			)
		),
		section(
			frame
		),
		footer('by snowbot3')
	];
}));

onHashChange();
