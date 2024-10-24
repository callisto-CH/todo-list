import { data } from './data.js';
import { state } from './state.js';
import { pubsub } from './pubsub.js';

const activeListContent = document.querySelector('.active-list-content');
const newTodoBtn = document.querySelector('.new-todo');
const todoModal = document.querySelector('.todo-modal');
let todoComplete = document.querySelector('#todocomplete');
let todoName = document.querySelector('#todoname');
let todoPrio = document.querySelector('#todoprio');
let todoDate = document.querySelector('#tododate');
let todoDesc = document.querySelector('#tododesc');

const render = {
	newListModal: () => {
		document.querySelector('.new-list-modal').showModal();
	},
	renderListInSidebar: (listName) => {
		let lists = document.querySelector('.lists')
		let newListFrag = document.createDocumentFragment();

		let newList = document.createElement('li');

		let div = document.createElement('div');
		div.classList.add('li-content');

		let name = document.createElement('span');
		name.classList.add('list-name');
		name.textContent = listName;
		name.addEventListener('click', () => {
			if (listName != state.workingList) {
				pubsub.publish('listSelected', listName);
			};
		});
		
		let del = document.createElement('button');
		del.classList.add('delete-list');
		del.textContent = 'Delete list';
		del.addEventListener('click', () => {
			render.unrenderListInSidebar(newList);
			if (listName == state.workingList) {
				render.unrenderWorkingList();
			};
			pubsub.publish('listDeleted', listName);
		});
		
		newList.appendChild(div);
		div.appendChild(name);
		div.appendChild(del);
		newListFrag.appendChild(newList);
		lists.appendChild(newListFrag);
	},
	unrenderListInSidebar: (listNode) => {
		listNode.remove();
	},
	renderWorkingList: (listName) => {
		let todos = data.getList(listName)['todos'];
		
		let header = document.querySelector('.active-list-name');
		header.textContent = listName;

		let frag = document.createDocumentFragment();
		let content = document.querySelector('.active-list-content');
		
		newTodoBtn.style.display = 'grid';

		for (const key in todos) {
			let todo = todos[key];
			let node = render.generateTodoNode(todo);
			frag.appendChild(node);
		};

		content.appendChild(frag);
	},
	unrenderWorkingList: () => {
		const header = document.querySelector('.active-list-name');
		header.textContent = '';

		const todos = document.querySelectorAll('.todo');
		todos.forEach((todo) => {
			todo.remove();
		});

		newTodoBtn.style.display = 'none';
	},
	todoModal: (editingTodoName) => {
		if (editingTodoName) { // if user is editing an existing todo, its name is passed in
			const todo = data.lists[state.workingList]['todos'][editingTodoName];
			todoComplete.checked = todo.complete ? true : false;
			todoName.value = todo.name;
			todoPrio.value = todo.priority;
			todoDate.value = todo.dueDate;
			todoDesc.value = todo.description;
		};
		todoModal.showModal();
	},
	closeTodoModal: () => {
		todoComplete.checked = false;
		todoName.value = '';
		todoPrio.value = 'None';
		todoDate.value = '';
		todoDesc.value = '';
		todoModal.close();
	},
	generateTodoNode: (todo) => {
		let todoFrag = document.createDocumentFragment();

		let div = document.createElement('div');
		div.classList.add('todo');
		div.setAttribute('data-name', todo.name);

		let complete = document.createElement('input');
		complete.setAttribute('type', 'checkbox');
		complete.checked = todo.complete;
		complete.addEventListener('click', () => {
			let t = data.getTodo(state.workingList, todo.name);
			t.complete = t.complete ? false : true;
		});
	
		let nameDiv = document.createElement('div');
		nameDiv.classList.add('todo-name');
		let name = document.createElement('span');
		name.classList.add('name');
		name.textContent = todo.name;

		let priorityDiv = document.createElement('div');
		priorityDiv.classList.add('todo-priority');
		priorityDiv.textContent = 'Priority: ';
		let priority = document.createElement('span');
		priority.classList.add('priority');
		priority.textContent = todo.priority ? todo.priority : 'None';

		let dueDateDiv = document.createElement('div');
		dueDateDiv.classList.add('todo-due-date');
		dueDateDiv.textContent = 'Due date: ';
		let dueDate = document.createElement('span');
		dueDate.classList.add('date');
		dueDate.textContent = todo.dueDate ? render.formatDate(todo.dueDate) : '';

		let edit = document.createElement('button');
		edit.classList.add('todo-edit');
		edit.textContent = 'Edit';
		edit.addEventListener('click', () => {
			pubsub.publish('editTodoBtnClicked', todo.name);
		});

		let del = document.createElement('button');
		del.classList.add('todo-delete');
		del.textContent = 'Delete';
		del.addEventListener('click', () => {
			pubsub.publish('todoDeleted', todo.name);
		});

		let description = document.createElement('div');
		description.classList.add('todo-desc');
		description.textContent = 'Description: ' + todo.description;

		div.appendChild(complete);
		div.appendChild(nameDiv);
		nameDiv.appendChild(name);
		div.appendChild(priorityDiv);
		priorityDiv.appendChild(priority);
		div.appendChild(dueDateDiv);
		dueDateDiv.appendChild(dueDate);
		div.appendChild(edit);
		div.appendChild(del);
		div.appendChild(description);
		todoFrag.appendChild(div);
		return todoFrag
	},
	renderTodo: (todo) => {
		let node = render.generateTodoNode(todo);
		activeListContent.appendChild(node);
	},
	unrenderTodo: (todoName) => {
		let todo = document.querySelector(`[data-name="${todoName}"]`);
		todo.remove();
	},
	updateTodo: (newTodo) => {
		let todo = document.querySelector(`[data-name="${state.workingTodo}"]`);
		todo.after(render.generateTodoNode(newTodo));
		todo.remove();
	},
	formatDate: (date) => {
		let dateArray = date.split('-');
		return dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0]
	}
};

pubsub.subscribe('newListBtnClicked', render.newListModal);
pubsub.subscribe('listAdded', render.renderListInSidebar);
pubsub.subscribe('firstListAdded', render.renderWorkingList);
pubsub.subscribe('listSelected', render.unrenderWorkingList);
pubsub.subscribe('listSelected', render.renderWorkingList);
pubsub.subscribe('newTodoBtnClicked', render.todoModal);
pubsub.subscribe('todoAdded', render.renderTodo);
pubsub.subscribe('todoAdded', render.closeTodoModal);
pubsub.subscribe('editTodoBtnClicked', render.todoModal);
pubsub.subscribe('todoEdited', render.updateTodo);
pubsub.subscribe('todoDeleted', render.unrenderTodo);

export { render };
