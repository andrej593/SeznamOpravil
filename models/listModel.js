var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var tagSchema = new Schema({
	'tag' : String
});

var TagModel = mongoose.model('tag', tagSchema);

var taskSchema = new Schema({
	'taskName' : String,
	'taskDesc' : String,
	'taskDateCreated' : Date,
	'taskDateWarn' : Date,
	'taskDateEnd' : Date,
	'taskStatus' : Boolean,
	'taskListOfTags' : [tagSchema]
});

var listSchema = new Schema({
	'listName' : String,
	'listDesc' : String,
	'listCreated' : Date,
	'listStatus' : Boolean,
	'listListOfTags' : [tagSchema],
	'listTasks' : [taskSchema]
});

//TASK

listSchema.method('deleteTask', function deleteTask(id) {
	var list = this;
	list.listTasks.pull({_id: id});
});

listSchema.method('addTask', function addTask(task) {
	var list = this;
	task.taskListOfTags=JSON.parse(task.taskListOfTags);
	list.listTasks.push(task);
	return task;
});
listSchema.method('updateTask', function updateTask(idT, body) {
	var list = this;
	var task = list.listTasks.id(idT);
	task.taskName=body.taskName;
	task.taskDesc=body.taskDesc;
	return task;
});

listSchema.method('changeTaskStatus', function changeTaskStatus(id) {
	var list = this;
	var task = list.listTasks.id(id);
	task.taskStatus = !task.taskStatus;
	return task;
});

listSchema.method('addTaskTag', function addTaskTag(id, tag) {
	var list = this;
	var tag = new TagModel({"tag":tag});
	list.listTasks.id(id).taskListOfTags.push(tag);
	return tag;
});

listSchema.method('deleteTaskTag', function deleteTaskTag(id, idT2) {
	var list = this;
	list.listTasks.id(id).taskListOfTags.pull({_id: idT2});
});

listSchema.method('changeTaskWarnDate', function changeTaskWarnDate(id, date) {
	var list = this;
	list.listTasks.id(id).taskDateWarn = date;
	return list.listTasks.id(id);
});

listSchema.method('changeTaskEndDate', function changeTaskEndDate(id, date) {
	var list = this;
	list.listTasks.id(id).taskDateEnd = date;
	return list.listTasks.id(id);
});

//LIST

listSchema.method('changeListStatus', function changeListStatus() {
	var list = this;
	list.listStatus = !list.listStatus;
	if(list.listStatus){
		list.listTasks.forEach(task => {
			task.taskStatus=true;
		});
	}
});

listSchema.method('addListTag', function addListTag(tag) {
	var list = this;
	var tag = new TagModel(
		{"tag":tag}
	)
	list.listListOfTags.push(tag);
	return tag;
});

listSchema.method('deleteListTag', function deleteListTag(idT2) {
	var list = this;
	list.listListOfTags.pull({_id: idT2});
});
/*
listSchema.method('changeTaskTag', function changeTaskTag(id, tag,newtag) {
	var list = this;
	list.listTasks.id(id).taskListOfTags.pull(tag);
	list.listTasks.id(id).taskListOfTags.push(newtag);
});
listSchema.method('changeListTag', function changeListTag(tag,newtag) {
	var list = this;
	list.listListOfTags.pull(tag);
	list.listListOfTags.push(newtag);
});
*/
module.exports = mongoose.model('list', listSchema);
