import './styles.css';
import { initNewListModal } from './newListModal.js';
import { initTodoModal } from './todoModal.js';
import { initStorage } from './storage.js';
import { pubsub } from './pubsub.js';
import { state } from './state.js';
import { data } from './data.js';
import { render } from './render.js';
import { List } from './list.js';
import { Todo } from './todo.js';

initNewListModal();
initTodoModal();
initStorage();
