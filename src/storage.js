import { data } from './data.js';
import { state } from './state.js';
import { pubsub } from './pubsub.js';
import { Todo } from './todo.js';

const initStorage = () => {
	window.addEventListener(`load`, () => {
		if (!localStorage[`_visited`]) {
			// placeholder data that populates on first visit
			localStorage['1'] = 'Monday list';
			localStorage['11n'] = 'Laundry';
			localStorage['11c'] = 'false';
			localStorage['11p'] = 'Medium';
			localStorage['11dd'] = '2024-10-14';
			localStorage['11d'] = 'Do your laundry';
			localStorage['12n'] = 'Do the thing';
			localStorage['12c'] = 'false';
			localStorage['12p'] = 'High';
			localStorage['12dd'] = '2024-10-14';
			localStorage['12d'] = `Do that thing you've been meaning to do for a while now, it really needs to get done! You should prioritize doing this over all else...`;
			localStorage['2'] = 'Project';
			localStorage['21n'] = 'Write up outline';
			localStorage['21c'] = 'true';
			localStorage['21p'] = 'High';
			localStorage['21dd'] = '2024-10-18';
			localStorage['21d'] = 'Write up a detailed outline of the project development.';
			localStorage['22n'] = 'Create graphs';
			localStorage['22c'] = 'false'
			localStorage['22p'] = '';
			localStorage['22dd'] = '';
			localStorage['22d'] = `Shouldn't take long. Should be done before project completion.`;
			localStorage['23n'] = 'Create testing procedures';
			localStorage['23c'] = 'false';
			localStorage['23p'] = 'Medium';
			localStorage['23dd'] = '2024-10-25'
			localStorage['23d'] = 'Make sure you have time to test things before submitting the project.';
			
			localStorage['_listCount'] = '2';
			localStorage['_todoCounts'] = '2|3|';
			localStorage['_workingList'] = 'Monday list';
		};
		
		if (localStorage['_listCount'] == '0') {
			return
		};

		const todoArray = localStorage['_todoCounts'].split('|').slice(0,-1);

		for (let l = 1; l <= +localStorage['_listCount']; l++) {
			let listName = localStorage[`${l}`];
			
			pubsub.publish('listAdded', listName);
			state.setWorkingList(listName);
			
			for (let t = 1; t <= +todoArray[l-1]; t++) {
				let complete = localStorage[`${l}${t}c`] == 'true' ? true : false;
				let name = localStorage[`${l}${t}n`];
				let priority = localStorage[`${l}${t}p`];
				let dueDate = localStorage[`${l}${t}dd`];
				let description = localStorage[`${l}${t}d`];
				
				let todo = new Todo(complete, name, priority, dueDate, description);

				pubsub.publish('todoAdded', todo);
			};

		};

		if (localStorage['_workingList']) {
			pubsub.publish('listSelected', localStorage['_workingList']);
		};

		localStorage.clear();
		localStorage[`_visited`] = 'visited';
	});

	window.addEventListener(`beforeunload`, () => {
		let lists = data['lists'];
		let listCount = 0;
		let todoCounts = '';
		let l = 1;
		let t = 0;

		for (const listName in lists) {
			let list = lists[listName];
			localStorage[`${l}`] = listName;

			for (const todoName in list['todos']) {
				t += 1;
				let todo = list['todos'][todoName];
				localStorage[`${l}${t}n`] = todo.name;
				localStorage[`${l}${t}c`] = todo.complete;
				localStorage[`${l}${t}p`] = todo.priority;
				localStorage[`${l}${t}dd`] = todo.dueDate;
				localStorage[`${l}${t}d`] = todo.description;
			};

			listCount += 1;
			todoCounts += t + '|';

			l += 1;
			t = 0;
		};
		
		localStorage['_listCount'] = listCount;
		localStorage['_todoCounts'] = todoCounts;
		localStorage['_workingList'] = state.workingList;
	});
};

export { initStorage }
