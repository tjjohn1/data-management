'use strict';

var todoList = require('../controllers/todoListController');

module.exports = function(app) {

    // todoList Routes
    app.route('/files')
        .get(todoList.list_all_files);
    app.route('/files/day')
        .get(todoList.list_day_files);
    app.route('/files/vendor')
        .get(todoList.list_vendor_files);
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
