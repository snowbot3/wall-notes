import { css, elem, doms } from './wall/js/all.mjs';
import * as status from './status.js';
import { elem as log_elem } from './log.js';
import './theme.js'; // just apply

css.link('./global.css');

async function resolve(obj, parts) {
	if (typeof obj == 'function') {
		return resolve(obj(...parts), parts);
	} else if(obj instanceof Promise) {
		return await obj;
	}
	return obj;
}

const frame = elem`section`();
async function fetchPage(page, parts) {
	status.push('Loading');
	frame.clear();
	//try {
		const mod = await import(`./pages/${page}.js`);
		const dom = await resolve(mod.default, parts);
		frame.append(dom);
	/*} catch(er) {
		frame.append(elem('div', 'Error: ', er.toString()));
		status.push('Error');
	}*/
	status.pop('Loading');
}

function onHashChange(ev) {
	const hash = location.hash.slice(1);
	const parts = hash.split('/');
	const page = parts.shift() || 'home';
	fetchPage(page, parts);
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
				li(a`href=#rambles`('Rambles')),
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
