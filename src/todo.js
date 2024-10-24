function Todo(completeInput, nameInput, priorityInput, dueDateInput, descriptionInput) {
	let complete = completeInput;
	let name = nameInput;
	let priority = priorityInput;
	let dueDate = dueDateInput;
	let description = descriptionInput;
	
	return { complete, name, priority, dueDate, description };
};

export { Todo };
