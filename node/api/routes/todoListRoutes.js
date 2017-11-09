'use strict';

var todoList = require('../controllers/todoListController');

module.exports = function(app) {

    // todoList Routes
    app.route('/tasks')
        .get(todoList.list_all_tasks);
        //.post(todoList.create_a_task);

/*
    app.route('/tasks/:taskId')
        .get(todoListTasks.read_a_task)
        .put(todoListTasks.update_a_task)
        .delete(todoListTasks.delete_a_task);
*/


    app.route('/imports')
        .get(todoList.get_files)

    app.route('/imports/process')
        .post(todoList.processCSV)

    app.route('/imports/combine')
        .post(todoList.combineFiles)
};
