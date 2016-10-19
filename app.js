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
addTask ('testik4', function(err) {
    console.log(err,'Updated bing2');
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

/*
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const csv = require('csv');
const eachLimit = require('async/eachLimit');
function add(data, cb) {
    let q = datastore.createQuery([kind])
        .filter('key', '=', data.key);

    datastore.runQuery(q, function(err, entities, nextQuery) {
        if (err) {
            cb(err);
        } else if (entities.length == 0) {
            create(data, cb);
        } else {
            update(entities[0].key.id, data, cb);
        }
    });
}

router.post('/add', upload.single('spawns'), function(req, res, next) {
    if (req.query.key) {
        if (req.file) {
            csv.parse(req.file.buffer, function(err, data) {
                if (err) {
                    res.status(400).json({ status: 'failure', message: 'Unable to parse file' });
                } else {
                    req.setTimeout(6000000);
                    data.shift();
                    var added = 0;
                    eachLimit(data, 500, (item, cb) => {
                        spawns.add({
                            cell: item[0],
                            key: item[1],
                            latitude: parseFloat(item[2]),
                            longitude: parseFloat(item[3]),
                            interval: parseInt(item[4]),
                            frequency: parseInt(item[5])
                        }, (err) => {
                        if (!err) {
                        added++;
                        if (added % 10000 == 0)
                            console.log(added)
                    }
                    cb(err);
                });
            }, (err) => {
                if (err) {
                res.status(500).json({ status: 'failure', added: added, total: data.length, error: err });
            } else {
                res.json({ status: 'success', added: added, total: data.length, percentage: added / data.length });
            }
        });
    }
});
} else {
    res.status(400).json({ status: 'failure', message: 'No file passed through' });
}
} else {
    res.status(401).json({ status: 'failure', message: 'Access not authorised' });
}
});

    */