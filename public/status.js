// site status used to relay important information.
// dirty, loading, saving

import * as wall from './wall.js';
wall.css(`
span.status {
	display: inline-block;
}
`);

const elem = wall.elem`span class=status`();
const states = [];

function push(state) {
	states.push(state);
	// should status text change?
	elem.clear();
	elem.append(state);
}
function pop(state) {
	const ind = states.indexOf(state);
	states.splice(ind, 1);
	// should status text change?
	elem.clear();
	if (states.length > 0) {
		elem.append(states[states.length-1]);
	}
}

export { elem, push, pop };