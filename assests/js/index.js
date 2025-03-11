

function show_inDisplayNotification(notType, title, message, details) { 

    var noti = null
    var noti_tit = null
    var noti_mes = null
    var noti_details = null

    if (notType == "success") {
        noti = document.getElementById('showSuccessAlert')
        noti_tit = document.getElementById('showSuccessAlertMessage1')
        noti_mes = document.getElementById('showSuccessAlertMessage2')
        noti_details = document.getElementById('showSuccessAlertDetail')

    } else if (notType == "alert")  {
        noti = document.getElementById('showVipAlert');
        noti_tit = document.getElementById("showVipAlertMessage1");
        noti_mes = document.getElementById('showVipAlertMessage2');
        noti_details = document.getElementById('showVipAlertDetail')

    } else if (notType == "warn")  {
        noti = document.getElementById('showWarningAlert');
        noti_tit = document.getElementById('showWarningAlertMessage1');
        noti_mes = document.getElementById('showWarningAlertMessage1');
        noti_details = document.getElementById('showWarningAlertDetail')

    } else {
        noti = document.getElementById('showDangerAlert');
        noti_tit = document.getElementById('showDangerAlertMessage1');
        noti_mes = document.getElementById('showDangerAlertMessage2');
        noti_details = document.getElementById('showDangerAlertDetail')
    }

    noti.style.display = "block";
    noti_tit.innerHTML = title;
    noti_mes.innerText = message;
    
    if (noti_details && details.length > 0) {
        
        noti_details.style.marginBottom = "2vh";
        noti_details.style.marginTop = "1vh";
    } else {
        noti_details.style.marginBottom = "0";
        noti_details.style.marginTop = "0";
    }
    noti_details.innerText = details;
    setTimeout(function() {
        noti.style.display = "none";
    }, 5000);
}

function showLoader() {
    const loader = document.getElementById("request_response_loader")
    loader.style.display = "flex";
    loader.style.zIndex = "10";

}

function hideLoader() {
    const loader  = document.getElementById("request_response_loader");
    loader.style.display = "none";
    loader.style.zIndex = "10";
}


function generateFeatureContainers(features) {
    const popular_features   = document.getElementById('popular_features');
    const allFunctionalities = document.getElementById('all_functionalities');
    
    popular_features.innerHTML = ''; 
    allFunctionalities.innerHTML = ''; // Clear existing content

    Object.keys(features).forEach(feature_name => {
        const feature = features[feature_name];

        Object.entries(feature.methods).forEach(([methodKey, methodData]) => {
            
            method_name = String(methodKey).toLowerCase();
            var methodContainer;

            if (feature.external_link){
                methodContainer = createFeatureContainer(`${methodData.desc}`, feature.icon, true);
                methodContainer.href = feature.external_link;
                methodContainer.target = "_blank";
                methodContainer.style.textDecoration = "none";
                
                // methodContainer.addEventListener('click', () => { document.open(feature.external_link) })
            }
            else {
                methodContainer = createFeatureContainer(`${methodData.desc}`, feature.icon, false);
                methodContainer.feature_name = feature_name;
                methodContainer.func = method_name.includes("default")? methodData.module : methodKey;
                
                methodContainer.addEventListener("click", function () {
                    document.getElementById('tab').classList.add("blur");
                    document.getElementById('popup').style.display = "block";
                    createPopupContent(feature_name, methodKey, feature);
                });
            }
            (method_name.includes("default") ? popular_features : allFunctionalities).appendChild(methodContainer);
        });
    });
}


function createFeatureContainer(title, icon, isExternal) {
    console.log(isExternal? isExternal: "");
    const container = document.createElement(isExternal? 'a' : 'div');
    container.className = 'featureContainer';

    const img = document.createElement('img');
    const p = document.createElement('p');
    img.src = `${icon}`;
    img.alt = title;
    p.className = 'feature_title';
    p.textContent = title;
    container.appendChild(img);
    container.appendChild(p);
    return container;
}


function getMethodArguments(jsonData, feature, reqMethod) {
    
    const featureData = jsonData[feature];
    if (!featureData) return `No Feature Found ${feature}`;

    const featureMethods = featureData.methods || {};
    if (!featureMethods) return `Feature Don't Have Methods`;

    const result = [];
    for (const [method, details] of Object.entries(featureMethods)) {
        if (method === reqMethod) {
            const argsList = details.args || [];
            const kwargsList = Object.keys(details.kwargs || {}).map(key => `${key} [OPT]`);
            result.push(...argsList, ...kwargsList);
        }
    }
    return result;
}



function generateHTMLFromData(key, value) {

    const formMessage = document.createElement('div');
    formMessage.className = 'popupForm_message';

    const label = document.createElement('div');
    label.className = 'popupLabel';
    label.textContent = `${key.split('_').join(' ').replace(/\b\w/g, c => c.toUpperCase())}*`;

    let element;

    if (typeof value === "string") {
        const match = value.match(/^\[(.*?)\]\[(.*?)\]\s*(.*)$/);
        if (match) {
            const [, tagType, subtype, content] = match;
            
            switch (tagType.toLowerCase()) {
                case "input":
                    element = document.createElement('input');
                    element.className = 'popupInput';
                    element.type = subtype === "file" ? "file" : "text";
                    element.placeholder = subtype !== "file" && content.match(/--(.*?)--/) ? "" : content;
                    if (subtype !== "file" && content.match(/--(.*?)--/)) element.value = content.match(/--(.*?)--/)[1];
                    break;

                case "a":
                    element = document.createElement('a');
                    element.href = subtype;
                    element.textContent = content;
                    element.target = "_blank";
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
        } else {
            element = document.createElement('p');
            element.textContent = value;
        }
    } else if (typeof value === "boolean") {
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

        const labelYes = createRadio(`${key}_yes`, key, "true", value, "Yes");
        const labelNo = createRadio(`${key}_no`, key, "false", !value, "No");

        formMessage.appendChild(label);
        formMessage.appendChild(labelYes);
        formMessage.appendChild(labelNo);
        return formMessage;
    } else if (Array.isArray(value)) {
        element = document.createElement('select');
        element.className = 'popupInput selectInput';
        element.style.height = "4.5vh";

        value.forEach((optionValue, index) => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            element.appendChild(option);
            if (index === 0) option.selected = true;
        });
    } else {
        element = document.createElement('p');
        element.textContent = `Unsupported type for ${key}`;
    }

    element.id = key;
    formMessage.appendChild(label);
    formMessage.appendChild(element);
    return formMessage;
}


function create_feature_popUp_arguments(arg, Value, label, formMessage, isOptional=false) {

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
function createPopupContent(feature_name, method_name, featureData) {
    const methodData = featureData.methods[method_name];
    const isDefaultMethod = method_name.includes("default");
    const actualMethodName = isDefaultMethod ? methodData.module : method_name;

    const popupTitle = document.getElementById('popupTitle');
    popupTitle.innerHTML = `<p style='padding: 0;margin:0;margin-top: 10px;'>${methodData.desc.split(' - ')[0]} - <a>${methodData.desc.split(' - ')[1]}</a></p>`;

    const popupImage = document.querySelector('.popupImage img');
    popupImage.src = featureData.icon;
    popupImage.alt = featureData.name;

    const popupForm = document.getElementById('popupForm');
    popupForm.innerHTML = '';

    const createFormElement = (key, value, isOptional = false) => {
        const formMessage = document.createElement('div');
        formMessage.className = 'popupForm_message';

        const label = document.createElement('div');
        label.className = 'popupLabel';
        const labelText = key.split('_').join(' ').toLowerCase();
        label.textContent = `${labelText[0].toUpperCase() + labelText.substring(1)}${!isOptional ? '*' : ''}`;

        create_feature_popUp_arguments(key, value, label, formMessage, isOptional);
        return formMessage;
    };

    Object.keys(methodData.args).forEach(arg => {
        popupForm.appendChild(createFormElement(arg, methodData.args[arg]));
    });

    Object.keys(methodData.kwargs).forEach(kwarg => {
        popupForm.appendChild(createFormElement(kwarg, methodData.kwargs[kwarg], true));
    });

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.onclick = async () => {
        try {
            const args = {};
            const kwargs = {};
            const uploaded_files = {};
            let isValidRequest = true;

            const getInputValues = async (data, target, isOptional = false) => {
                for (const key of Object.keys(data)) {
                    const input = document.getElementById(key);
                    if (!input) continue;

                    let value;
                    if (input.type === "file") {
                        if (input.files.length === 0 && !isOptional) {
                            show_inDisplayNotification("danger", "Error", "No file selected", '');
                            isValidRequest = false;
                            return false;
                        }
                        if (input.files.length > 0) {
                            const file = input.files[0];
                            const res = await uploadFile(file);
                            if (!res) {
                                isValidRequest = false;
                                return false;
                            }
                            uploaded_files[key] = res;
                            value = res
                        } else {
                            value = null;
                        }
                    } else {
                        value = input.value;
                        if (!value && !isOptional) {
                            show_inDisplayNotification("danger", "Error", "Field with * are required", '');
                            isValidRequest = false;
                            return false;
                        }
                        value = value === "true" ? true : value === "false" ? false : value;
                    }
                    target[key] = value;
                }
                return true;
            };

            disableInteractiveElements();
            showSubmitLoader(submitBtn);

            if (!(await getInputValues(methodData.args, args) && await getInputValues(methodData.kwargs, kwargs, true))) {
                return;
            }

            let featureResponse = await runFeature(
                feature_name,
                actualMethodName,
                { args, kwargs },
                uploaded_files,
                false
            );

            await handleFeatureResponse(featureResponse, popupForm);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            hideSubmitLoader(submitBtn);
            enableInteractiveElements();
        }
    };

    async function handleFeatureResponse(featureResponse, popupForm) {
        let popupForm_message = document.getElementById("feature_response");
        if (!popupForm_message) {
            popupForm_message = document.createElement('div');
            popupForm_message.id = 'feature_response';
            popupForm_message.className = 'popupForm_message';
            popupForm_message.style.display = "flex";
            popupForm.appendChild(popupForm_message);
        } else {
            popupForm_message.innerHTML = '';
        }

        let response_box;
        let temp_label;

        const createResponseBox = (tag, content) => {
            response_box = document.getElementById("p_response_box") || document.createElement(tag);
            response_box.classList.add("text_response_box");
            response_box.id = "p_response_box";
            response_box.textContent = content;
            popupForm_message.style.display = "flex";
            return response_box;
        };

        const createAudioResponse = (src) => {
            temp_label = document.getElementById("output_file_label") || document.createElement('div');
            temp_label.className = 'popupLabel';
            temp_label.textContent = `Output File`;
            temp_label.style.fontWeight = "bold";
            temp_label.id = "output_file_label";

            popupForm_message.style.padding = "0";
            response_box = document.getElementById("audio_response_") || document.createElement('audio');
            response_box.classList.add("audio_response_box");
            response_box.id = "audio_response_";
            response_box.setAttribute("controls", "");
            response_box.src = src;

            popupForm_message.style.display = "flex";
            popupForm_message.style.border = "none";
            return [temp_label, response_box];
        };

        switch (featureResponse?.rtn) {
            case "response/str":
                response_box = createResponseBox('p', featureResponse.value);
                break;
            case "response/md":
                response_box = createResponseBox('pre', featureResponse.value);
                break;
            case "response/json":
                response_box = createResponseBox('p', JSON.stringify(featureResponse.value, null, 2));
                break;
            case "response/id":
                show_inDisplayNotification("success", "Success", `Task is running with id ${featureResponse.value}`, '');
                return;
            case "audio/file":
                const [label, audioBox] = createAudioResponse(featureResponse.value);
                popupForm_message.appendChild(label);
                response_box = audioBox;
                break;
            default:
                if (typeof (featureResponse) === "string") {
                    show_inDisplayNotification("success", "Success", featureResponse, '');
                } else if (featureResponse?.task_id) {
                    show_inDisplayNotification("success", "Success", `Task is running with id ${featureResponse.task_id}`, '');
                }
                break;
        }

        if (response_box) {
            popupForm_message.appendChild(response_box);
        }
    }

    function disableInteractiveElements() {
        document.querySelectorAll('button, input, select, textarea, a').forEach(element => {
            element.disabled = true;
        });
    }

    function enableInteractiveElements() {
        document.querySelectorAll('button, input, select, textarea, a').forEach(element => {
            element.disabled = false;
        });
    }

    function showSubmitLoader(submitBtn) {
        const loader = submitBtn.querySelector(".form_submit_loader");
        loader.style.display = "inline-block";
        submitBtn.style.pointerEvents = "none";
        submitBtn.style.opacity = "0.7";
    }

    function hideSubmitLoader(submitBtn) {
        const loader = submitBtn.querySelector(".form_submit_loader");
        loader.style.display = "none";
        submitBtn.style.pointerEvents = "auto";
        submitBtn.style.opacity = "1";
    }
}

