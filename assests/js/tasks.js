
const task_logs_btn = document.getElementById('task_details_logs');
const task_files_btn = document.getElementById('task_details_file');

const task_logs_screen = document.getElementById('logs_task_details');
const task_files_screen = document.getElementById('task_files_details');



async function delete_task(id, feature_name, FEATURES_DATA){
    console.log("Delete Res: ", id, feature_name);
    res = await runOperation(id, feature_name, FEATURES_DATA[feature_name]['operations']['delete']['module'], true, '')
}


async function get_logs(feature, id, FEATURES_DATA) {

    const task_logs_screen = document.getElementById('logs_task_details');
    const task_logs_btn = document.getElementById('task_details_logs');
    const logOutput = document.getElementById("task_logs");

    task_logs_screen.style.display = "block";
    task_logs_btn.style.backgroundColor = "#E79C46";

    logs = await runOperation(id, feature, FEATURES_DATA[feature]['operations']['logs']['module'], false, '')
    logOutput.textContent = logs;
}


async function get_files(id, feature, FEATURES_DATA) {

    const task_files_btn = document.getElementById('task_details_file');
    const task_files_screen = document.getElementById('task_files_details');

    task_files_screen.style.display = "flex";
    task_files_btn.style.backgroundColor = "#E79C46";
    files = await runOperation(id, feature, FEATURES_DATA[feature]['operations']['files']['module'], false, []);
    files.forEach((file) => {
        console.log(file['name'], file['loc']);
        addDownloadableFile(file['name'], file['loc'], id);
    });
    update_download_files();
}



function closeAllTabs() {

    const task_logs_btn = document.getElementById('task_details_logs');
    const task_files_btn = document.getElementById('task_details_file');
    const task_logs_screen = document.getElementById('logs_task_details');
    const task_files_screen = document.getElementById('task_files_details');
    
    task_logs_btn.style.backgroundColor = "#E7E6E6";
    task_files_btn.style.backgroundColor = "#E7E6E6";
    task_logs_screen.style.display = "none";
    task_files_screen.style.display = "none";
}


function addDownloadableFile(fileName, fileUrl, fileId) {
    const container = document.getElementById("task_files_details_container");
    const existingFile = document.getElementById(`file_id_${fileId}`);
    if (existingFile) {
        existingFile.remove();
    }
    const fileDiv = document.createElement("div");
    fileDiv.className = "download_able_files";
    fileDiv.id = `file_id_${fileId}`;
    fileDiv.dataset.id = fileId;
    fileDiv.dataset.link = fileUrl;
    fileDiv.innerHTML = `
        <img src="../images/file.png" alt="File Icon">
        <p>${fileName}</p>
    `;
    // Add download functionality
    fileDiv.addEventListener("click", () => window.location.href = fileUrl);
    // Append and ensure visibility
    container.appendChild(fileDiv);
    container.style.display = "flex";
}

function update_download_files() {
    // File Actions (download vs Delete)
    const actionBox = document.getElementById("file_actions");
    document.querySelectorAll(".download_able_files").forEach(file => {
        file.addEventListener("mouseenter", function () {
            const { left, top } = this.getBoundingClientRect();
            actionBox.style.left = `calc(${(left / window.innerWidth) * 100}vw - 8vw)`;
            actionBox.style.top = `calc(${(top / window.innerHeight) * 100}vh - 35vh)`;
            actionBox.style.display = "flex";
            actionBox.dataset.id = this.dataset.id;
            actionBox.dataset.feature = this.dataset.feature;
            actionBox.dataset.link = this.dataset.link;
        });
    });
    // Hide the action box only if mouse moves away from both the files and the action box
    document.addEventListener("mousemove", (e) => {
        if (!e.target.closest(".download_able_files") && !e.target.closest("#file_actions")) {
            actionBox.style.display = "none";
        }
    });
    // Handle click actions inside the action box
    actionBox.addEventListener("click", (e) => {
        const fileId = actionBox.dataset.id;
        const fileLink = actionBox.dataset.link;
        if (e.target.closest(".delete_btn")) {
            document.querySelector(`.download_able_files[data-id="${fileId}"]`)?.remove();
        } else if (e.target.closest(".download_btn")) {
            // alert(`Downloading file ${fileId} ${fileLink}`);
            window.location.href = fileLink;
        }
    });
}
