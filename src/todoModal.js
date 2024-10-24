import { pubsub } from './pubsub.js';
import { data } from './data.js';
import { state } from './state.js';
import { Todo } from './todo.js';

const initTodoModal = () => {
	const newTodoBtn = document.querySelector('.new-todo');
	newTodoBtn.addEventListener('click', () => {
		if (data.lists == {}) {
			return
		};
		pubsub.publish('newTodoBtnClicked');
	});

	let modal = document.querySelector('.todo-modal');
	let cancelBtn = document.querySelector('.todo-modal .cancel');
	let completeInput = document.querySelector('#todocomplete');
	let nameInput = document.querySelector('#todoname');
	let prioInput = document.querySelector('#todoprio');
	let dateInput = document.querySelector('#tododate');
	let descInput = document.querySelector('#tododesc');

	function close() {
		completeInput.checked = false;
		nameInput.value = '';
		prioInput.value = 'None';
		dateInput.value = '';
		descInput.value = '';
		modal.close();
	};

	cancelBtn.addEventListener('click', close);

	modal.addEventListener('submit', (event) => {
		let todo;
		event.preventDefault();
		if (
			nameInput.value.length <= 80 &&
			!nameInput.value.includes('`') &&
			!nameInput.value.includes('"') &&
			(!data.getTodo(state.workingList, nameInput.value) || nameInput.value == state.workingTodo) &&
			nameInput.value != ''
		) {
			todo = new Todo(completeInput.checked ? true : false, nameInput.value, prioInput.value, dateInput.value, descInput.value);
		}
		else {
			alert("Todo name must: \n Be 80 characters or less \n Not be the same as another todo in this list \n Not include backticks (`) or quotes (\") \n Not be blank");
			return
		};
		if (state.workingTodo) { // true if user is editing a todo
			pubsub.publish('todoEdited', todo);
			state.clearWorkingTodo();
		}
		else {
			pubsub.publish('todoAdded', todo);
		};
		close();
	});

};

export { initTodoModal };
