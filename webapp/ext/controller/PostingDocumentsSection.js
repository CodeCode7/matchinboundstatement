sap.ui.define(['sap/m/MessageBox', 'sap/ui/core/mvc/Controller'], function (MessageBox, Controller) {
    "use strict";

    let _errorMessage = (oContext, messsageType) => {
        const message = oContext.getModel("i18n").getResourceBundle().getText(messsageType);
        MessageBox.error(message);
    };

    let _doApiCallPost = (url, type, data) => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: type,
                data: JSON.stringify(data),
                processData: false,
                contentType: "application/json;charset=utf-8",
                async: false,
                dataType: "text",
                crossDomain: true,
                success: function (response) {
                    resolve(response);
                },
                error: function (err) {
                    reject(err);
                },
            });
        });

    };

    return {
        onAddToMatch: function (oEvent, aSelectedContext) {
            if (aSelectedContext.length == 0) {
                return;
            }
            let aUnMatchedPostingDocument = [];
            aSelectedContext.forEach(function (oSelectedContext) {
                let contextId = oSelectedContext.getObject();
                let oUnMatchedDocument = {};
                oUnMatchedDocument.unmatchedStatementId = contextId.ID;
                oUnMatchedDocument.postingDocumentId = contextId.postingDocument.ID;
                aUnMatchedPostingDocument.push(oUnMatchedDocument);
            });
            const API_URL = "/rest/match-inbound-statement/add-to-match";
            let oPromise = _doApiCallPost(API_URL, "POST", aUnMatchedPostingDocument);
            oPromise.then(function (value) {

                this.refresh();

            }.bind(this),
                function (errResponse) {
                    let message = "";
                    if (errResponse.status == "422" && errResponse.responseText != undefined) {
                        message = errResponse.responseText;
                    }
                    else {
                        message = this.getModel("i18n").getResourceBundle().getText("MATCH_FAILED");
                    }
                    MessageBox.error(message);
                }.bind(this));
        },
        onRemoveToMatch: function (oEvent, aSelectedContext) {
            if (aSelectedContext.length == 0) {
                return;
            }
            let aUnMatchedPostingDocument = [];
            aSelectedContext.forEach(function (oSelectedContext) {
                let contextId = oSelectedContext.getObject();
                let oUnMatchedDocument = {};
                oUnMatchedDocument.matchedStatementId = contextId.ID;
                oUnMatchedDocument.postingDocumentId = contextId.postingDocument.ID;
                aUnMatchedPostingDocument.push(oUnMatchedDocument);
            });
            const API_URL = "/rest/match-inbound-statement/remove-to-match";
            let oPromise = _doApiCallPost(API_URL, "POST", aUnMatchedPostingDocument);
            oPromise.then(function (value) {

                this.refresh();

            }.bind(this),
                function (errResponse) {
                    let message = "";
                    if (errResponse.status == "422" && errResponse.responseText != undefined) {
                        message = errResponse.responseText;
                    }
                    else {
                        message = this.getModel("i18n").getResourceBundle().getText("MATCH_FAILED");
                    }
                    MessageBox.error(message);
                }.bind(this));

        }




    };
});
