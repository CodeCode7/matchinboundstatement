sap.ui.define([
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "irp/matchinboundstatement/ext/model/Formatter"
], function (Fragment, Controller, JSONModel, Formatter) {
    "use strict";

    return {
         /**
         * This event gets fired when user triggers matched fields action for comparision
         * @param {*} oEvent 
         * @param {*} oContext
         */
        handleCustomAction: function (oEvent, oContext) {
            var indices = oContext.length;
            //Display warning message on selection of items more than two
            if (indices > 2) {
                if (!this.oDefaultDialog) {
                    this.oDefaultDialog = new sap.m.Dialog({
                        title: "{i18n>ERROR}",
                        content: new sap.m.Text({text:"{i18n>SELECT_MAXIMUM_TWO_DOCUMENTS}" }),
                        endButton: new sap.m.Button({
                            text: "{i18n>OK}",
                            press: function () {
                                this.oDefaultDialog.close();
                                return;
                            }.bind(this)
                        })
                    });
                    this.addDependent(this.oDefaultDialog);
                }
                this.oDefaultDialog.open();
                return;
            }
            if (!this._oCompareDialog) {
                this._oCompareDialog = sap.ui.xmlfragment("irp.matchinboundstatement.ext.fragment.CompareDialog", this);
                this.addDependent(this._oCompareDialog);
            }
            var list = sap.ui.getCore().byId("idTable");
            var inboundStatementNumber = oEvent.getObject().inboundStatementNumber.inboundStatementNumber;
            var partnerStatementNumber = oEvent.getObject().inboundStatementNumber.partnerStatementNumber;

            var aDataModel=[];
            var inboundStatementContext =  oEvent.getObject();
           
            var aDataModel = [
            { Field: this.getModel("i18n").getResourceBundle().getText("RETURNABLE_PACKAGING_ACCOUNT"), inboundStatement: ((inboundStatementContext.inboundStatementNumber.returnableAccountID) != null)? inboundStatementContext.inboundStatementNumber.returnableAccountID.returnableAccountNumber : null},
            // { Field: this.getModel("i18n").getResourceBundle().getText("RETURNABLE_PACKAGING_ACCOUNT"), inboundStatement: oEvent.getObject().returnableAccountID.returnableAccountNumber },
            { Field: this.getModel("i18n").getResourceBundle().getText("RETURNABLE_PACKAGING_MATERIAL"), inboundStatement: ((inboundStatementContext.inboundStatementNumber.returnableAccountID) != null)? inboundStatementContext.inboundStatementNumber.returnableAccountID.materialID.materialCode : null},
            { Field: this.getModel("i18n").getResourceBundle().getText("EXHANGE_PARTNER"), inboundStatement: ((inboundStatementContext.inboundStatementNumber.partnerID) != null)? inboundStatementContext.inboundStatementNumber.partnerID.name : null },
            { Field: this.getModel("i18n").getResourceBundle().getText("POSTING_DATE"), inboundStatement: inboundStatementContext.inboundStatementNumber.statementReceivedOn },
            { Field: this.getModel("i18n").getResourceBundle().getText("QUANTITY"), inboundStatement:  inboundStatementContext.transactionQuantity }];

            var aSelectedItems = [];
            var matchingStatus;
            //Generate data model based on selected posting documents
            for (var i = 0; i < aDataModel.length; i++) {
                if (i === 0) {
                    for (var j = 0; j < indices; j++) {
                        var aDocumentProperty = aDataModel[i];
                        var sColumn = "Document" + j;
                        matchingStatus = oContext[j].getObject().matchedStatus_ID;
                        if (oContext[j].getObject().postingDocument.returnableAccountID != null) {
                            var postingDocument = oContext[j].getObject().postingDocument.returnableAccountID.returnableAccountNumber;
                            aDocumentProperty["state"] = matchingStatus;
                            aDataModel[i] = aDocumentProperty;
                            aDocumentProperty[sColumn] = postingDocument;
                        }
                        else {
                            aDocumentProperty[sColumn] = null;
                        }
                        aDataModel[i] = aDocumentProperty;
                    }
                } else if (i === 1) {
                    for (var j = 0; j < indices; j++) {
                        var aDocumentProperty = aDataModel[i];
                        var sColumn = "Document" + j;
                        matchingStatus = oContext[j].getObject().matchedStatus_ID;
                        if (oContext[j].getObject().postingDocument.returnableAccountID != null) {
                            var postingDocument = oContext[j].getObject().postingDocument.returnableAccountID.materialID_ID;
                            aDocumentProperty["state"] = matchingStatus;
                            aDataModel[i] = aDocumentProperty;
                            aDocumentProperty[sColumn] = postingDocument;
                        }
                        else {
                            aDocumentProperty[sColumn] = null;
                        }
                        aDataModel[i] = aDocumentProperty;
                    }
                } else if (i === 2) {
                    for (var j = 0; j < indices; j++) {
                        var aDocumentProperty = aDataModel[i];
                        var sColumn = "Document" + j;
                        matchingStatus = oContext[j].getObject().matchedStatus_ID;
                        if (oContext[j].getObject().postingDocument.partnerID != null) {
                            var postingDocument = oContext[j].getObject().postingDocument.partnerID.number;
                            aDocumentProperty["state"] = matchingStatus;
                            aDataModel[i] = aDocumentProperty;
                            aDocumentProperty[sColumn] = postingDocument;
                        } else {
                            aDocumentProperty[sColumn] = null;
                        }
                        aDataModel[i] = aDocumentProperty;
                    }
                }
                else if (i === 3) {
                    for (var j = 0; j < indices; j++) {
                        var postingDocument = oContext[j].getObject().postingDocument.postingDate;
                        var aDocumentProperty = aDataModel[i];
                        var sColumn = "Document" + j;
                        matchingStatus = oContext[j].getObject().matchedStatus_ID;
                        aDocumentProperty["state"] = matchingStatus;
                        aDataModel[i] = aDocumentProperty;
                        aDocumentProperty[sColumn] = postingDocument;
                        aDataModel[i] = aDocumentProperty;
                    }
                } else if (i === 4) {
                    for (var j = 0; j < indices; j++) {
                        var aDocumentProperty = aDataModel[i];
                        var sColumn = "Document" + j;
                        matchingStatus = oContext[j].getObject().matchedStatus_ID;
                        if (oContext[j].getObject().postingDocument != null) {
                            var postingDocument = oContext[j].getObject().postingDocument.returnableMaterialQuantity;
                            aDocumentProperty["state"] = matchingStatus;
                            aDataModel[i] = aDocumentProperty;
                            aDocumentProperty[sColumn] = postingDocument;
                        } else {
                            aDocumentProperty[sColumn] = null;
                        }
                        aDataModel[i] = aDocumentProperty;
                    }
                }
                aSelectedItems.push(aDocumentProperty);
            }
            var oModel = new JSONModel(aSelectedItems);
            list.setModel(oModel, "oModelData");
 
            for (var i = 0; i < indices + 2; i++) {
                if (i === 0) {
                    var oColumn = new sap.m.Column("col" + i, {
                        header: new sap.m.ObjectIdentifier({
                            title: "{i18n>FIELD}"
                        })
                    });
                } else if (i === 1) {
                    var oColumn = new sap.m.Column("col" + i, {
                        header: new sap.m.ObjectIdentifier({
                            title: inboundStatementNumber + " / " + partnerStatementNumber,
                            text: "{i18n>INBOUND_AND_PARTNER_STATEMENT_NUMBER}"
                        })
                    });
                } else {
                    var postingDocumentNumber = oContext[i - 2].getObject().postingDocument.postingDocumentNumber;
                    var oColumn = new sap.m.Column("col" + i, {
                        header: new sap.m.ObjectIdentifier({
                            title: postingDocumentNumber,
                            text: "{i18n>POSTING_DOCUMENT}"
                        })
                    });
                }
                list.addColumn(oColumn);
            }

            //Display the DataModel in form of column list
            var oItems = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.ObjectIdentifier({
                        title: "{oModelData>Field}"
                    }),
                    new sap.m.Text({
                        text: "{oModelData>inboundStatement}"
                    }),
                    new sap.m.ObjectStatus({
                        text: "{oModelData>Document0}",
                        state:
                        {
                            parts: [{ path: 'oModelData>state' }],
                            formatter: Formatter.matchDocumentState
                        }
                    }),
                    new sap.m.ObjectStatus({
                        text: "{oModelData>Document1}",
                        state:
                        {
                            parts: [{ path: 'oModelData>state' }],
                            formatter: Formatter.matchDocumentState
                        }
                    }),
                    new sap.m.ObjectStatus({
                        text: "{oModelData>Document2}",
                        state:
                        {
                            parts: [{ path: 'oModelData>state' }],
                            formatter: Formatter.matchDocumentState
                        }
                    })
                ]
            });

            list.bindAggregation("items", {
                path: 'oModelData>/',
                template: oItems,
            });

            this._oCompareDialog.open();
        },
        closeDialog: function (oEvent) {
            if (this._oCompareDialog) {
                sap.ui.getCore().byId("idTable").destroyColumns();
                this._oCompareDialog.close();
            }
        }
    }
});