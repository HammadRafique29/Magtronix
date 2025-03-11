export function createTitleBar() {
    return `
    <div id="titleBar">
        <div id="info">
            <div id="logo" class="short_icons"> <img src="../images/app_logo.png" style="width:100%;height:100%;background-color:transparent"> </div>
            <div id="title"> <a style="font-weight:bold;"> Magtronix </a> | <a style="font-weight:normal;"> Your Secure AI Automation </a> </div>
        </div>
        <div class="window-buttons">
            <div id="minimize_control_btn" class="control_btn minimize"></div>
            <div id="maximize_control_btn" class="control_btn maximize"></div>
            <div id="close_control_btn" class="control_btn close"></div>
        </div>
    </div>
    `;
};



// <div id="miniBtn" class="short_icons"></div>
// <div id="maxiBtn" class="short_icons"></div>
// <div id="closeBtn" class="short_icons"></div>

export function createNavBar() {
    return `
    <div id="navBar">
        <div id="Features" class="navBtn" data-page="features"><img src="../images/dashboard1.png" alt="">Features</div>
        <div id="Scenarios" class="navBtn" data-page="scenarios"><img src="../images/automation.png" alt="">Scenarios</div>
        <div id="Tasks" class="navBtn" data-page="tasks"><img src="../images/scheme.png" alt="">Tasks</div>
        <div id="Servers" class="navBtn" data-page="servers"><img src="../images/servers.png" alt="">Servers</div>
    </div>
    `;
    // <div id="Dashboad" class="navBtn" data-page="features"><img src="../images/dashboard1.png" alt="">Dashboad</div>
};



export function createPopup() {
    return `
    <div id="popup">
        <div id="popupTitle"></div>
        <div id="popupBody">
            <div id="popupForm">
                <!-- <div class="popupForm_message">
                    <div class="popupLabel">Text</div>
                    <input type="text" id="_message" class="popupInput" placeholder="Enter your message">
                </div>
                <div class="popupForm_message">
                    <div class="popupLabel">Username</div>
                    <input type="text" id="_message" class="popupInput" placeholder="Enter your message">
                </div>
                <div class="popupForm_message">
                    <div class="popupLabel">Date of Birth</div>
                    <input type="text" id="_message" class="popupInput" placeholder="Enter your message">
                </div> -->
                <!-- <div class="popupForm_message" id="feature_response">
                    <p class="text_response_box" id="p_response_box"></p>
                </div> -->
                <div class="popupForm_message" id="feature_response_2" style="display: flex;">
                    <audio src="/home/magician/Desktop/Magtronix/magtronix_backend/docs/SARAH.wav"></audio>
                </div>
            </div>
            <div class="popupImage">
                <img src="../images/tts_feature.png" style="width: 10.5vw; height: 10.5vw;" alt="">
            </div>
        </div>
        <div id="popupBtns">
            <div id="cancelBtn" class="popupBtnDeco">Cancel</div>
            <div id="submitBtn" class="popupBtnDeco" >Submit<div class="form_submit_loader"></div></div>
        </div>
    </div>
    `
}


export function inDisplayNotification() {
    return `
    <section id="inDisplayNotication">
        <div class="container mt-5">
            <div class="row">
                <div class="col-sm-12 notification_" id="showSuccessAlert" style="display: none;">
                    <div class="notification_content alert fade alert-simple alert-success alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show">
                        <div id="error_container" style="width: 100%;height:2.5vh; display: flex;justify-content: flex-start;align-items: center;margin-top: 0.3vh;">
                            <button type="button" class="notification_close_btn close font__size-18" style="color: #259c08;" data-dismiss="alert">
                                <span aria-hidden="true"><a>
                                    <i class="fa fa-times greencross"></i>
                                </a></span>
                                <span class="sr-only">X</span>
                            </button>
                            <i class="start-icon far fa-check-circle faa-tada animated"></i>
                            <strong class="font__weight-semibold" id="showSuccessAlertMessage1">Well done!</strong>
                            <p id="showSuccessAlertMessage2" style="padding:0;margin:0;margin-left: 5px;"></p>
                        </div>
                        <p id="showSuccessAlertDetail" class="details">Details here</p>
                    </div>
                </div>
    
                <div class="col-sm-12 notification_" id="showVipAlert" style="display: none;">
                    <div class="notification_content alert fade alert-simple alert-info alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
                        <div id="error_container" style="width: 100%;height:2.5vh; display: flex;justify-content: flex-start;align-items: center;margin-top: 0.3vh;">
                            <button type="button" class="notification_close_btn close font__size-18" style="color: #0396ff;" data-dismiss="alert">
                                <span aria-hidden="true">
                                    <i class="fa fa-times"></i>
                                </span>
                                <span class="sr-only">X</span>
                            </button>
                            <i class="start-icon fa fa-info-circle faa-shake animated"></i>
                            <strong class="font__weight-semibold" id="showVipAlertMessage1">Heads up!</strong>
                            <p id="showVipAlertMessage2" style="padding:0;margin:0;margin-left: 5px;"></p>
                        </div>
                        <p id="showVipAlertDetail" class="details">Details here</p>
                    </div>
                </div>
    
                <div class="col-sm-12 notification_" id="showWarningAlert" style="display: none;">
                    <div class="notification_content alert fade alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
                        <div id="error_container" style="width: 100%;height:2.5vh; display: flex;justify-content: flex-start;align-items: center;margin-top: 0.3vh;">
                            <button type="button" class="notification_close_btn close font__size-18" style="color: #ffb103;" data-dismiss="alert">
                                <span aria-hidden="true">
                                    <i class="fa fa-times warning"></i>
                                    </span>
                                <span class="sr-only">X</span>
                            </button>
                            <i class="start-icon fa fa-exclamation-triangle faa-flash animated"></i>
                            <strong class="font__weight-semibold" id="showWarningAlertMessage1">Warning!</strong>
                            <p id="showWarningAlertMessage2" style="padding:0;margin:0;margin-left: 5px;"></p>
                        </div>
                        <p id="showWarningAlertDetail" class="details">Details here</p>
                    </div>
                </div>
    
                <div class="col-sm-12 notification_" id="showDangerAlert" style="display: none;">
                    <div class="notification_content alert fade alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
                        <div id="error_container" style="width: 100%;height:2.5vh; display: flex;justify-content: flex-start;align-items: center;margin-top: 0.3vh;">
                            <button type="button" class="notification_close_btn close font__size-18" style="color: #ff0303;" data-dismiss="alert">
                                <span aria-hidden="true">
                                    <i class="fa fa-times danger "></i>
                                </span>
                                <span class="sr-only">X</span>
                            </button>
                            <i class="start-icon far fa-times-circle faa-pulse animated"></i>
                            <strong class="font__weight-semibold" id="showDangerAlertMessage1">Oh snap!</strong>
                            <p id="showDangerAlertMessage2" style="padding:0;margin:0;margin-left: 5px;"></p>
                        </div>
                        <p id="showDangerAlertDetail" class="details">Details here</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `
}



export function requestResponseLoader() {
    return `
    <div id="request_response_loader" style="display: none;">
        <div class="progress-bar">
            <div class="circle border"></div>
        </div>
    </div>
    `
}




export function task_details_popup() {
    return `
    <div id="task_details_container" style="display: none;">
        <div id="go_back_task_screen">
            <div id="task_details_header">
                <button id="task_details_logs" class="task_details_head_btn">Task Logs</button>
                <button id="task_details_file" class="task_details_head_btn">Task Files</button>
                <button id="task_details_other" class="task_details_head_btn">Task Information</button>
                <button id="task_details_other2" class="task_details_head_btn">Other Information</button>
            </div>
            <Button type="button" id="close_task_details">X</Button>
        </div>

        <div id="logs_task_details" style="display: none;">
            <pre name="task_logs" id="task_logs" rows="10">  </pre>
        </div>

        <div id="task_files_details" style="display: none;">
            <div id="task_files_details_container"
                style="width: 100%;display: flex;flex-wrap: wrap;row-gap: 10px;margin-top: 10px;margin-bottom: 10px;">
                <div id="file_actions" class="file_actions">
                    <button class="download_btn">
                        <p>⬇️</p>
                        <p>Download</p>
                    </button>
                    <button class="delete_btn">
                        <p>❌ </p>
                        <p>Delete</p>
                    </button>
                </div>
            </div>
        </div>

    </div>
    `;
}


export function search_widget() {
    return `
    <div id="SearchContainer">
        <div class="searchBox">
            <img class="" src="../images/search.png" alt="">
            <input id="searchInput" type="text" placeholder="Search Features...">
        </div>
    </div>
    `;
}


// export { createTitleBar, createNavBar, createPopup, inDisplayNotification, requestResponseLoader };