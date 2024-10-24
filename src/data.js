import { pubsub } from './pubsub.js';
import { state } from './state.js';
import { List } from './list.js';

const data = {
	lists: {},
	getList: (listName) => {
		return data.lists[listName]
	},
	getTodo: (listName, todoName) => {
		return data.lists[listName]['todos'][todoName]
	},
	addList: (listName) => {
		data.lists[listName] = new List(listName);
		if (Object.keys(data.lists).length == 1) {
			pubsub.publish('firstListAdded', listName);
		};
	},
	deleteList: (listName) => {
		delete data.lists[listName];
	},
	addTodo: (todo) => {
		data.lists[state.workingList]['todos'][todo.name] = todo;
	},
	deleteTodo: (todoName) => {
		if (state.workingList) {
			delete data.lists[state.workingList]['todos'][todoName];
		};
	},
	updateTodo: (newInfo) => {
		const workingTodo = data.getTodo(state.workingList, state.workingTodo);
		workingTodo.complete = newInfo.complete;
		workingTodo.name = newInfo.name;
		workingTodo.priority = newInfo.priority;
		workingTodo.dueDate = newInfo.dueDate;
		workingTodo.description = newInfo.description;

		let newTodos = {};
		let oldTodos = data.getList(state.workingList)['todos'];
		for (const key of Object.keys(oldTodos)) {
			let name = oldTodos[key]['name'];
			newTodos[name] = oldTodos[key];
		}
		data.getList(state.workingList)['todos'] = newTodos;
	},
};

pubsub.subscribe('listAdded', data.addList);
pubsub.subscribe('listDeleted', data.deleteList);
pubsub.subscribe('todoAdded', data.addTodo);
pubsub.subscribe('todoEdited', data.updateTodo);
pubsub.subscribe('todoDeleted', data.deleteTodo);

export { data };
