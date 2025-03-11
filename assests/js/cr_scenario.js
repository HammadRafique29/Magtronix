var DRAFT_SCENARIOS = {
    "default": {
        "task_id": "task_001",
        "feature": "TTS",
        "func": "bulk_tts_with_excel",
        "icon": "../images/tts_feature.png",
        "args": { "message": "My name is Hammad", "speaker_name": "Sarah", "language": "en" },
        "kwargs": { "message": "My name is Hammad", "speaker_name": "Sarah", "language": "en", "image": "ghcr.io/coqui-ai/tts" },
        "return_val": {
            'type': "str",
            'kwargs': { 'id': null }
        },
        'child': {
            "task_id": "task_002",
            "feature": "TTS - Automate",
            "func": "bulk_tts_with_excel",
            "icon": "../images/tts_feature.png",
            "args": { "message": "Today, is my birthday", "speaker_name": "Sarah", "language": "en" },
            "kwargs": { "message": "Today, is my birthday", "speaker_name": "Sarah", "language": "en", "image": "ghcr.io/coqui-ai/tts" },
            "return_val": {
                'type': "str",
                'kwargs': { 'id': null }
            },
            'child': null
        }
    }
};

/**
 * Recursively finds a task by task_id within a given dictionary key.
 * @param {Object} dict - The dictionary containing tasks.
 * @param {string} dictKey - The key to search within (e.g., "default").
 * @param {string} taskId - The task ID to find.
 * @returns {Object|null} - The matched task object, or null if not found.
 */
function findTask(dict, dictKey, taskId) {
    function searchTask(task) {
        if (task.task_id === taskId) {
            return { ...task, child: task.child ? { ...task.child } : null };
        }
        return task.child ? searchTask(task.child) : null;
    }
    return dict[dictKey] ? searchTask(dict[dictKey]) : null;
}
/**
 * Recursively updates a key's value in the specified task and returns the updated dictionary.
 * @param {Object} dict - The dictionary containing tasks.
 * @param {string} dictKey - The key to search within (e.g., "default").
 * @param {string} taskId - The task ID to update.
 * @param {string} key - The key to update inside the task.
 * @param {*} value - The new value to set.
 * @returns {Object} - The updated dictionary for the given dictKey.
 */
function updateTask(dict, dictKey, taskId, key, value) {
    function searchAndUpdate(task) {
        if (task.task_id === taskId) {
            task[key] = value;
            return true;
        }
        return task.child ? searchAndUpdate(task.child) : false;
    }

    if (dict[dictKey]) {
        searchAndUpdate(dict[dictKey]);
    }
    return dict[dictKey]; // Return the updated dictionary
}



// Function to dynamically add feature containers
async function display_scenarios_features(scenarios, onclick=null) {

    var FEATURES_DATA = await fetch_features();

    const featuresFrame = document.getElementById("features_frame");

    // Remove all child nodes from featuresFrame
    while (featuresFrame.firstChild) {
        featuresFrame.removeChild(featuresFrame.firstChild);
    }
    
    const scenario_features = scenarios;

    scenario_features.forEach(({ feature, title, func, desc, icon, args, kwargs }) => {
        // Create feature container
        const featureDiv = document.createElement("div");
        featureDiv.classList.add("show_features_containers");

        featureDiv.dataset.feature = feature;
        featureDiv.dataset.title = title;
        featureDiv.dataset.func = func;

        // Create image element
        var img;
        if (icon) {
            img = document.createElement("img");
            img.src = icon;
            img.alt = title;
        }

        // Create feature description container
        const featureDesc = document.createElement("div");
        featureDesc.classList.add("featureDesc");

        // Create feature title
        const featureTitle = document.createElement("p");
        featureTitle.classList.add("featureTitle");
        featureTitle.style.margin = "0";
        featureTitle.style.padding = "0";
        featureTitle.textContent = title;

        // Create feature info
        const featureInfo = document.createElement("p");
        featureInfo.classList.add("featureInfo");
        featureInfo.style.margin = "0";
        featureInfo.style.padding = "0";
        featureInfo.textContent = desc;

        // Append title and info to featureDesc
        featureDesc.appendChild(featureTitle);
        featureDesc.appendChild(featureInfo);

        // Append img and featureDesc to featureDiv
        if (icon) featureDiv.appendChild(img);
        featureDiv.appendChild(featureDesc);
    
        // Append featureDiv to featuresFrame
        featuresFrame.appendChild(featureDiv);

        
        featureDiv.addEventListener('click', (event) => {

            if (onclick) {
                onclick(kwargs); // Pass the kwargs as an object
            } else {
                createPopupContent(feature, func, FEATURES_DATA[feature]);
                document.getElementById('popup').style.display = "flex";
            }
            document.getElementById('feature_selector').style.display = "none";
        })

        document.getElementById('cancelBtn').addEventListener('click', (event) => {
            document.getElementById('feature_selector').style.display = "flex";
            document.getElementById('popup').style.display = "none";
        })

    });

}


function create_feature_popUp_arguments(arg, Value, label, formMessage, isOptional=false, featureData={}, past_results=null) {

    if (Array.isArray(Value)) {

        const select = document.createElement('select');
        select.id = arg;
        select.className = 'popupInput';
        select.classList.add('selectInput');
        select.style.height = "4.5vh";

        Value.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });
        formMessage.appendChild(label);
        formMessage.appendChild(select);

    } else if (typeof Value === "boolean") {

        const createRadio = (id, name, val, checked, text) => {
            const radio = document.createElement('input');
            radio.type = "radio";
            radio.id = id;
            radio.name = name;
            radio.value = val;
            radio.checked = checked;

            const label = document.createElement('label');
            label.textContent = ` ${text}`;
            label.prepend(radio);
            return label;
        };

        const labelYes = createRadio(`${arg}_yes`, arg, "true", Value, "Yes");
        const labelNo = createRadio(`${arg}_no`, arg, "false", !Value, "No");
        
        formMessage.appendChild(label);
        formMessage.appendChild(labelYes);
        formMessage.appendChild(labelNo);

    }  else {

        const match = (typeof Value === 'string') ? (Value.match(/^\[(.*?)\]\[(.*?)\]\s*(.*)$/)) : null;
        if (match) {
            const [, tagType, subtype, content] = match; 

            switch (tagType.toLowerCase()) {

                case "input":

                    const input = document.createElement('input');
                    input.id = arg;
                    input.className = 'popupInput';
    
                    input.type = subtype === "file" ? "file" : "text";
                    input.placeholder = subtype !== "file" && content.match(/--(.*?)--/) ? "" : isOptional? content : content;
                    if (subtype !== "file" && content.match(/--(.*?)--/)) input.value = content.match(/--(.*?)--/)[1];

                    formMessage.appendChild(label);
                    formMessage.appendChild(input);

                    const feature_selector = document.getElementById('feature_selector');
                    
                    input.addEventListener('focus', async () => {
                        if (input.value === "") {
                            const rect = input.getBoundingClientRect();
                            const x = rect.left;
                            const y = rect.top;
                        
                            feature_selector.style.left = `${x + input.offsetWidth - (input.offsetWidth/4)}px`;
                            feature_selector.style.top = `${y - (y / 3)}px`;
                            feature_selector.style.display = "flex";
                            
                            var modified_results = [];
                            past_results.forEach(result => {
                                modified_results.push({
                                    'feature': "None",
                                    "title": result.name,
                                    'func': "None",
                                    'desc': result.format,
                                    "icon": featureData['icon'],
                                    'args': {},
                                    'kwargs': { 'input': input, 'value': result.id }
                                });
                            });

                            input.style.color = "#3e9911";
                            input.style.fontWeight = "bold"
                        
                            function inputOnClick({ input, value }) {
                                console.log("We got the value: ", input, value);
                                input.value = value;
                            }
                            display_scenarios_features(modified_results, inputOnClick);
                            add_feature_selector_boundry(input);
                        }
                    });

                    input.addEventListener('blur', () => {
                        feature_selector.style.display = "none";
                        input.style.color = "";
                        input.style.fontWeight = "";
                    });

                    input.addEventListener('input', () => {
                        if (input.value !== "") {
                            feature_selector.style.display = "none";
                            input.style.color = "";
                            input.style.fontWeight = "";
                        } else {
                            input.style.color = "#3e9911";
                            input.style.fontWeight = "bold"
                        }
                    });
                    break;

                case "a":
                    const temp_div = document.createElement('div');
                    temp_div.style.width = "99%";
                    temp_div.style.height = "99%";
                    const element = document.createElement('a');
                    element.classList.add("popupAnchor");
                    element.href = subtype;
                    element.textContent = content;
                    element.target = "_blank";

                    temp_div.appendChild(element)
                    formMessage.appendChild(label);
                    formMessage.appendChild(temp_div);
                    break;

                case "button":
                    element = document.createElement('button');
                    element.className = `popupInput ${subtype}`;
                    element.textContent = content;
                    break;

                default:
                    element = document.createElement('p');
                    element.textContent = content;
            }
        }
    } 
}


function createScenarioPopupContent(feature_name, method_name, featureData, past_results) {

    const FeatureData = featureData
    var methodData = FeatureData.methods[method_name];
    var method_name = method_name.includes("default")? methodData.module : method_name;
    console.log(feature_name);
    
    const popupTitle = document.getElementById('popupTitle');
    popupTitle.innerHTML = `<p style='padding: 0;margin:0;margin-top: 10px;'>${methodData.desc.split(' - ')[0]} - <a>${methodData.desc.split(' - ')[1]}</a></p>`

    const popupImage = document.querySelector('.popupImage img');
    popupImage.src = FeatureData.icon;
    popupImage.alt = FeatureData.name;

    const popupForm = document.getElementById('popupForm');
    popupForm.innerHTML = ''; 
    
    Object.keys(methodData.args).forEach(arg => {

        var value = arg.split('_').join(' ').toLowerCase();
        value = value[0].toUpperCase() + value.substring(1);

        const formMessage = document.createElement('div');
        formMessage.className = 'popupForm_message';

        const label = document.createElement('div');
        label.className = 'popupLabel';
        label.textContent = `${value}*`;

        const argValue = methodData.args[arg];

        create_feature_popUp_arguments(arg, argValue, label, formMessage, false, featureData, past_results)
        popupForm.appendChild(formMessage);
    });

    Object.keys(methodData.kwargs).forEach(kwarg => {

        const kwarsValue = methodData.kwargs[kwarg];
        const formMessage = document.createElement('div');
        formMessage.className = 'popupForm_message';

        var key_ = kwarg.split('_').join(' ').toLowerCase();
        key_ = key_[0].toUpperCase() + key_.substring(1);
        value_ = methodData.kwargs[kwarg];
        
        const label = document.createElement('div');
        label.className = 'popupLabel';
        label.textContent = `${key_}`;

        create_feature_popUp_arguments(kwarg, kwarsValue, label, formMessage, true,featureData, past_results);
        popupForm.appendChild(formMessage);
    });

    return FeatureData, methodData
    
}


async function scenarios_submit_actions(top_parent_id, current_task_id, RUNNING_SCENARIOS) {
    return new Promise((resolve) => {
        let submitBtn = document.getElementById('submitBtn');

        submitBtn.onclick = async function () { // Make it async
            try {
                const args = {};
                const kwargs = {};
                const uploaded_files = {};
                var isValidRequest = true;

                // Collect values from args inputs
                var current_task = findTask(RUNNING_SCENARIOS, top_parent_id, current_task_id);
                var request_method = current_task.methods;
                var target_meth_nam = Object.keys(current_task.methods)[0];

                for (const arg of Object.keys(request_method[target_meth_nam].args)) {
                    const input = document.getElementById(arg);
                    if (input && input.type === "file") {
                        if (input.files.length > 0) {
                            const res = await uploadFile(input.files[0]); // Await the file upload
                            if (!res) {
                                alert("Failed to upload file.");
                                isValidRequest = false;
                                break;
                            } else {
                                uploaded_files[arg] = res;
                                args[arg] = res;
                            }
                        } else {
                            alert("No file selected.");
                            isValidRequest = false;
                            break;
                        }
                    } else if (input) {
                        args[arg] = input.value;
                        if (!input.value) {
                            alert("Fields with '*' are required. Please fill them first");
                            isValidRequest = false;
                            break;
                        }
                    }
                    if (!isValidRequest) break;
                }

                // Collect values from kwargs inputs
                for (const kwarg of Object.keys(request_method[target_meth_nam].kwargs)) {
                    const input = document.getElementById(kwarg);
                    if (input && input.type === "file") {
                        if (input.files.length > 0) {
                            const res = await uploadFile(input.files[0]); // Await the file upload
                            if (!res) {
                                alert("Failed to upload file.");
                                isValidRequest = false;
                                break;
                            } else {
                                uploaded_files[kwarg] = res;
                                kwargs[kwarg] = res;
                            }
                        } else {
                            alert("No file selected.");
                            isValidRequest = false;
                            break;
                        }
                    } else if (input) {
                        kwargs[kwarg] = input.value;
                    }
                    if (!isValidRequest) break;
                }

                if (isValidRequest) {
                    request_method[target_meth_nam]['args'] = args;
                    request_method[target_meth_nam]['kwargs'] = kwargs;

                    RUNNING_SCENARIOS[top_parent_id] = updateTask(RUNNING_SCENARIOS, top_parent_id, current_task_id, "methods", request_method);
                    console.log("Updated Scenarios:", RUNNING_SCENARIOS[top_parent_id]);

                    // Close the Popup
                    document.getElementById('tab').classList.remove("blur");
                    document.getElementById('popup').style.display = "none";

                    console.log("Returning Back....", RUNNING_SCENARIOS);
                    resolve(RUNNING_SCENARIOS); // Resolve with updated scenarios
                } else {
                    resolve(null); // Resolve as null if request was invalid
                }

            } catch (error) {
                console.error("Error:", error);
                show_inDisplayNotification("danger", "Error", `Testing Failed`, `${error}`);
                resolve(null);
            }
        };
    });
}




// Example Usage
console.log(findTask(DRAFT_SCENARIOS, "default", "task_002")); // Get task_002
DRAFT_SCENARIOS["default"] = updateTask(DRAFT_SCENARIOS, "default", "task_002", "feature", "Updated TTS"); // Update and assign back
console.log(DRAFT_SCENARIOS); // Check updated dictionary
