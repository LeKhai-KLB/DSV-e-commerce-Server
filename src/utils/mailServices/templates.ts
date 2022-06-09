function verify_mail_template(userName: string, url: string) {
    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    div.screen {
                        width: 100%;
                        background-color: #cecece;
                        padding: 30px;
                        margin: auto
                    }
                    div.contentContainer {
                        width: 380px;
                        height: 170px;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen' !important;
                        margin: auto;
                        background-color: white;
                        border-radius: 5px
                    }
                    h4 {
                        margin: 0px
                    }
                    h4.text_bold {
                        font-weight: bold;
                    }
                    h4.text_content {
                        margin: 5px 0px 10px 0px;
                        font-weight: 400
                    }
                    a.conform {
                        margin:20px 0px 0px 135px;
                        text-decoration: none;
                        display: inline-block;
                        width: 100px;
                        padding: 10px 0px;
                        font-weight: 500;
                        background-color: #FFA15F;
                        text-align: center;
                        border-radius: 5px;
                        color: white
                    }
                </style>
            </head>
            
            <body>
                <div class="screen">
                    <div class="contentContainer" >
                        <h4 class="text_bold">Hello ${userName}! Thank you for register,</h2>
                        <h4 class="text_content">
                                Please verify your email to continue... Hope you will have a good experience when shopping in our site,
                        </h4>
                        <h4 class="text_bold mb-20">Aware shop</h4>
                        <a href="${url}" class="conform">Confirm</a>
                    </div>
                </div>          
            </body>
        </html>
    `
}

function resetPassword_mail_template(password:string) {
    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    div.screen {
                        width: 100%;
                        background-color: #cecece;
                        padding: 30px;
                        margin: auto
                    }
                    div.contentContainer {
                        width: 380px;
                        height: 180px;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen' !important;
                        margin: auto;
                        background-color: white;
                        border-radius: 5px
                    }
                    h4 {
                        margin: 0px
                    }
                    h4.text_bold {
                        font-weight: bold;
                    }
                    h4.text_content {
                        margin: 5px 0px 10px 0px;
                        font-weight: 400
                    }
                    div.conform {
                        margin:20px 0px 0px 120px;
                        text-decoration: none;
                        display: inline-block;
                        width: 150px;
                        padding: 10px 0px;
                        font-weight: 500;
                        background-color: #FFA15F;
                        text-align: center;
                        border-radius: 5px;
                        color: white
                    }
                </style>
            </head>
            
            <body>
                <div class="screen">
                    <div class="contentContainer" >
                        <h4 class="text_bold">Are you forgetting your password?</h4>
                        <h4 class="text_content">
                            Don't worry, we have send you a new password... Hope you will have a good experience when shopping in our site,
                        </h4>
                        <h4 class="text_bold mb-20">Aware shop</h4>
                        <div class="conform">Your password:  <br/>${password}</div>
                    </div>
                </div>          
            </body>
        </html>
    `
}

const mail_templates = {
    verify: verify_mail_template,
    resetPassword: resetPassword_mail_template
}
export default mail_templates