// inline log
import { css, dom, elem as wall_elem } from './wall.js';

//css(``);

const elem = wall_elem`div class=log`();
export { elem };

export default function log(...msgs) {
	const spans = Array.prototype.map.call(msgs, msg=>dom('span', msg));
	elem.append(dom('div', ...spans));
	const par = elem.elem.parentElement;
	par.scrollTo(0, par.scrollHeight);
}