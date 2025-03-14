const { ipcRenderer } = require('electron');


// showToast(`Error fetching features: ${error.message}`);
// show_inDisplayNotification('success', "Success", "Features Fetched Successfully!", '');

var API_ENDPOINT = "http://localhost:8081"


function showToast(message) {
    ipcRenderer.send('notification.notify', {
        title: 'Notification',
        body: message,
        icon: '/home/magician/Desktop/mouce/images/tts_feature.png',
        autoClose: true,
        onClick: 'onClick',
        onClickArgs: { message: "Hurrah", "feature": "TTS" },
        onClose: 'onClose',
        onCloseArgs: { message: "Hurrah", "feature": "TTS" }
    });
}


async function fetch_features() {
    try {
        showLoader();
        const response = await fetch(`${API_ENDPOINT}/get-features`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error('Error fetching data:', error);
        show_inDisplayNotification('danger', "ERROR!", `Failed To Fetch Features Data.`, `${error}`);
        return [];
    } finally {
        hideLoader();
    }
}

async function runFeature(feature_name, func_name, args, file_uploads, showResponse = false) {
    try {
        showLoader();
        const response = await fetch(`${API_ENDPOINT}/run-feature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                feature_name: feature_name,
                func_name: func_name,
                args: args,
                uploads: file_uploads
            })
        });
        const data = await response.json();
        if (response.ok) {
            if (showResponse) show_inDisplayNotification("success", "Run Feature!", `Feature Is Running With Task Id: ${data.data.task_id}`)
            return data.data.response;
        } else {
            show_inDisplayNotification("danger", "Run Feature!", `Failed To Run Feature ${feature_name} View Logs`, data.error)
            return null;
        }
    } catch (error) {
        show_inDisplayNotification("danger", "Run Feature!", `Failed To Run Feature ${feature_name} View Logs`, error.message);
        return null;
    } finally {
        hideLoader();
    }
}


async function getRunningTasks() {
    try {
        // showLoader();
        const response = await fetch(`${API_ENDPOINT}/get-running-tasks`);
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${await response.text()}`);
            return;
        }
        const responseJson = await response.json();
        const tasks = responseJson?.data?.tasks || [];

        const runningTasks = tasks.flatMap(featureTasks =>
            Object.entries(featureTasks).flatMap(([name, tasksList]) =>
                tasksList.map(task => [
                    task.task_id,
                    task.task_type,
                    task.tags,
                    task.isRunning ? 'Running' : 'Stopped',
                    `<a href="#" class="action-links" data-feature="${name}" data-id="${task.task_id}">Logs</a>`,
                    `<a href="#" class="action-links" data-feature="${name}" data-id="${task.task_id}">Edit</a>`,
                    `<a href="#" class="action-links" data-feature="${name}" data-id="${task.task_id}">Stop</a>`,
                    `<a href="#" class="action-links" data-feature="${name}" data-id="${task.task_id}">Delete</a>`
                ])
            )
        );
        return runningTasks;
    } catch (error) {
        console.error('Error running feature:', error);
        return [];
    } finally {
        // hideLoader();
    }
}



async function runOperation(id, feature, func_name, showResponse, rtnType = []) {
    try {
        showLoader()
        const response = await fetch(`${API_ENDPOINT}/run-feature-operation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                feature: feature,
                func_name: func_name,
                kwargs: { task_id: id }
            })
        });
        const data = await response.json();
        if (response.ok) {
            if (showResponse) show_inDisplayNotification('success', "Success", `Feature Executed Successfully`, data.data.response);
            return data.data.response;
        } else {
            if (showResponse) show_inDisplayNotification('danger', "Error!", "Run Operation Failed!", `${data.error}`);
            return { status: "failed", error: data.error, data: {} };
        }
    } catch (error) {
        return rtnType;
    } finally {
        hideLoader();
    }
}




async function addNewServer() {
    try {
        showLoader();
        const response = await fetch(`${API_ENDPOINT}/add-server`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        if (response.ok) {
            if (showResponse) show_inDisplayNotification('success', "Success", `Feature Executed Successfully`, data.data.response);
            return data.data.response;
        } else {
            if (showResponse) show_inDisplayNotification('danger', "Error!", "Run Operation Failed!", `${data.error}`);
            return { status: "failed", error: data.error, data: {} };
        }
    } catch (error) {
        return rtnType;
    } finally {
        hideLoader();
    }
}



async function getConnectedServers() {
    try {
        showLoader();
        const response = await fetch(`${API_ENDPOINT}/get-servers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        if (response.ok) {
            if (showResponse) show_inDisplayNotification('success', "Success", `Feature Executed Successfully`, data.data.response);
            return data.data.response;
        } else {
            if (showResponse) show_inDisplayNotification('danger', "Error!", "Run Operation Failed!", `${data.error}`);
            return [
                {
                    "server_id": "001",
                    "server_name": "Amazon Server 001",
                    "server_address": "192.168.8.100",
                    "isRunning": true
                },
                {
                    "server_id": "002",
                    "server_name": "Amazon Server 002",
                    "server_address": "192.168.8.100",
                    "isRunning": false
                }
            ];
        }
    } catch (error) {
        return rtnType;
    } finally {
        hideLoader();
    }
}



async function uploadFile(file) {
    try {
        showLoader();
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_ENDPOINT}//upload-file`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log(result)
        if (response.ok) {
            return result.data.response;
        } else {
            if (response.status === 413) {
                show_inDisplayNotification("danger", "File Too Large", "The file you are trying to upload exceeds the size limit.",  result.error);
                return null;
            }
            show_inDisplayNotification("danger", "Run Feature!", "Failed To Run Feature. View Logs", result.error);
            return null;
        }
    } catch (error) {
        console.error('Error running feature:', error);
        return null;
    } finally {
        hideLoader();
    }
}