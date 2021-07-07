import { css, elem, doms } from './wall/js/all.mjs';

css(`
.outer{
	border: 2px solid navy;
}
`);

const body = elem(document.body);
body.append(doms(function(div){
	return div`class=outer`('loading');
}));
