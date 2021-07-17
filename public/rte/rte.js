/**
 * rich text editor?
 * div contentEditable=true
 */
import { css, dom, doms, elem } from '../wall.js';
import * as status from '../status.js';
import log from '../log.js';

css(`
div.rte {
	height: 100%;
	padding: 18px 0;
}
div.rte > div,
div.rte > p {
	padding: 2px 20px;
}
div.rte > p {
	margin: 0.5em 0;
}
div.rte-single {
	display: inline-block;
	padding: 2px;
}
div.rte-single > div,
div.rte-single > p {
	padding: 2px;
}
`);

//import { doms } from '../wall.js';
//import log from '../log.js';

// how to handle formating?
// start with html?
// toolbar options?
// I want one of my fields to be a single line. How do I want to handle that?

function inspect(ev, event) {
	/* if (['ArrowLeft', 'Left', 'ArrowRight', 'Right'].includes(ev.key)) {
		const sel = document.getSelection();
		console.log(`on${event}:arrow: `, sel.focusOffset);
	} else */
	if (ev.key.length > 1) {
		console.log(`on${event}: `, ev.key);
		// single characters or Spacebar should label the current not as dirty.
	} else if (ev.key == 'i') {
		const sel = document.getSelection();
		console.log(`on${event}:i: `, sel.anchorNode, sel.anchorNode.textContent);
		//idle(()=>console.log(`on${event}:idle: `, sel.anchorNode, sel.anchorNode.textContent))
		//delay(()=>console.log(`on${event}:delay: `, sel.anchorNode, sel.anchorNode.textContent))
	}
}

function onKeyDown(ev) {
	inspect(ev, 'keydown');
}

function onKeyPress(ev) {
	inspect(ev, 'keypress');
}

function onKeyUp(ev) {
	inspect(ev, 'keyup');
}

class RichText {
	constructor(opts, kids) {
		this.opts = opts;
		if (this.opts.editable) {
			kids.push(doms((div,br)=>div(br())));
		}
		if (this.opts.single) {
			kids = [ kids[0] ];
			this.opts.classList = [...this.opts.classList, 'rte-single'];
		}
		this.elem = dom`div class="rte ${this.opts.classList.join(' ')}"
			contentEditable=${true}
			onkeydown=${(ev)=>this.onKeyDown(ev)}
			onkeypress=${(ev)=>this.onKeyPress(ev)}
			onkeyup=${(ev)=>this.onKeyUp(ev)}`(...kids);
		//this.load();
	}
	onKeyDown(ev) {
		if (ev.key == 'Enter' && this.opts.single) {
			ev.preventDefault();
			return;
		}
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key} : ${ev.keyCode}`);
		onKeyDown(ev);
		if (['Backspace','Enter'].includes(ev.key)) {
			// check for changes?
			console.log('::COF:: Down:: ', ev.key);
			const sel = window.getSelection();
			this.fromDown = {
				focusNode: sel.focusNode,
			};
		}
	}
	onKeyPress(ev) {
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key} : ${ev.keyCode}`);
		onKeyPress(ev);
	}
	onKeyUp(ev) {
		log(`${ev.constructor.name} : ${ev.type} : ${ev.key} : ${ev.keyCode}`);
		onKeyUp(ev);
		if (ev.key == 'Enter') {
			const sel = window.getSelection();
			const line = this.findLineElem(sel.focusNode);
			delete line.dataset.id;
			if (line.textContent == '') {
				delete line.dataset.created;
				delete line.dataset.dirty;
			}
		} else if (ev.key == 'Backspace') {
			console.log('::COF:: Up:: ', this.fromDown.focusNode.parentElement);
			const sel = window.getSelection();
			if (sel.focusNode == this.fromDown.focusNode) {
				// This is not easy.
			}
		} else if (ev.key.length == 1) {
			// not sure about alt key checking yet.
			if (!this.dirty) {
				this.dirty = true;
				status.push('Dirty');
			}
			const sel = window.getSelection();
			const line = this.findLineElem(sel.focusNode);
			if (!line.dataset.dirty) {
				line.dataset.dirty = 'dirty'; // would a timestamp help here?
				if (!line.dataset.created) {
					line.dataset.created = (new Date()).toString();
				}
			}
		}
	}
	findLineElem(node) {
		if (!node || !node.parentElement) {
			throw new Error('wall-rte: No path to rte line elem');
		}
		if (node.parentElement.classList.contains('rte')) {
			return node;
		}
		return this.findLineElem(node.parentElement);
	}
}

const defaultOpts = {
	editable: true,
	single: false,
	classList: ['th-even']
};

// options could be plain objects
export default function rte(...kids) {
	const opts = {};
	Object.assign(opts, defaultOpts);
	if (kids[0] instanceof Object && !(kids[0] instanceof Node)) {
		Object.assign(opts, kids.shift());
	}
    const rte = new RichText(opts, kids);
	return rte;
}
