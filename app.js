'use strict';

// [START build_service]
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/gcloud-node/#/docs/google-cloud/latest/guides/authentication
var Datastore = require('@google-cloud/datastore');

// Instantiate a datastore client
var datastore = Datastore();
// [END build_service]

/*
 Installation and setup instructions.
 1. Download the TaskList sample application from [here]
 (https://github.com/GoogleCloudPlatform/nodejs-docs-samples/archive/master.zip).

 2. Unzip the download:
 ```sh
 unzip nodejs-docs-samples-master.zip
 ```

 3. Change directories to the TaskList application:
 ```sh
 cd nodejs-docs-samples-master/datastore
 ```

 4. Install the dependencies and link the application:
 ```sh
 npm install
 ```

 5. With the gcloud SDK, be sure you are authenticated:
 ```sh
 gcloud auth login
 ```

 6. At a command prompt, run the following, where `<project-id>` is the ID of
 your Google Cloud Platform project.
 ```sh
 export GCLOUD_PROJECT=<project-id>
 ```

 7. Run the application!
 ```sh
 node tasks <command>
 ```
 */

// [START add_entity]
function addTask (description, callback) {
    var taskKey = datastore.key('Task');
    console.log(taskKey);
    datastore.insert({
        key: taskKey,
        data: [
            {
                name: 'created',
                value: new Date().toJSON()
            },
            {
                name: 'description',
                value: description,
                excludeFromIndexes: true
            },
            {
                name: 'done',
                value: false
            }
        ]
    }, function (err) {
        console.log('funct');
        if (err) {
            console.log('err true');
            return callback(err);
        }
        console.log('err false');
        var taskId = taskKey.path.pop();
        console.log('Task %d created successfully.', taskId);
        return callback(null, taskKey);
    });
}
//my code
addTask ('testik3', function(err) {
    console.log(err,'Updated bing');
});
// [END add_entity]

// [START update_entity]
function markDone (taskId, callback) {
    var transaction = datastore.transaction();

    transaction.run(function (err) {
        if (err) {
            return callback(err);
        }

        var taskKey = datastore.key([
            'Task',
            taskId
        ]);

        transaction.get(taskKey, function (err, task) {
            if (err) {
                // An error occurred while getting the task
                return transaction.rollback(function (_err) {
                    return callback(err || _err);
                });
            }

            task.data.done = true;

            transaction.save(task);

            // Commit the transaction
            transaction.commit(function (err) {
                if (err) {
                    return callback(err);
                }

                // The transaction completed successfully.
                console.log('Task %d updated successfully.', taskId);
                return callback(null);
            });
        });
    });
}
// [END update_entity]

// [START retrieve_entities]
function listTasks (callback) {
    var query = datastore.createQuery('Task')
        .order('created');
    console.log(query);
    datastore.runQuery(query, function (err, tasks) {
        if (err) {
            return callback(err);
        }

        console.log('Found %d task(s)!', tasks.length);
        return callback(null, tasks);
    });
}
//my code
listTasks (function(err) {
    console.log(err,'bing');
});
// [END retrieve_entities]

// [START delete_entity]
function deleteTask (taskId, callback) {
    var taskKey = datastore.key([
        'Task',
        taskId
    ]);

    datastore.delete(taskKey, function (err) {
        if (err) {
            return callback(err);
        }

        console.log('Task %d deleted successfully.', taskId);
        return callback(null);
    });
}
// [END delete_entity]
