sap.ui.define(function() {
	"use strict";
	var Formatter = {
		matchDocumentState :  function (matchingStatusId) {
            if (matchingStatusId === 3 ) {
                return "Success";
              } else if (matchingStatusId === 2 ) {
                return "Warning";
              }
                return 'Error';
			}
	};

	return Formatter;

}, true);
