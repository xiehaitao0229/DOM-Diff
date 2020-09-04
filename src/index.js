import {createElement,render,renderDom} from './element';
import diff from './diff'
import patch from './patch'

let vertualDom1 = createElement('ul', { class: 'list' }, [
    createElement('li', { class: 'item' }, ['1']),
    createElement('li', { class: 'item' }, ['2']),
    createElement('li', { class: 'item ' }, ['3'])
  ]);
  let vertualDom2 = createElement('ul', { class: 'list-group' }, [
    createElement('li', { class: 'item' }, ['3']),
    createElement('li', { class: 'item' }, ['2']),
    createElement('li', { class: 'item item3' }, ['1']),
  ]);

  console.log('vertualDom1',vertualDom1)

  let el = render(vertualDom1);
  console.log('el',el)
  renderDom(el, window.root);
  let patches = diff(vertualDom1,vertualDom2);
  console.log('patches',patches);

// 给元素打补丁 重新更新视图
  patch(el, patches);
