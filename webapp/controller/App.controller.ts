import Controller from "sap/ui/core/mvc/Controller";
import Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import Fragment from "sap/ui/core/Fragment";
import Button, { Button$PressEvent } from "sap/m/Button";
import SelectDialog, { SelectDialog$ConfirmEvent } from "sap/m/SelectDialog";
import Token from "sap/m/Token";
import MultiInput from "sap/m/MultiInput";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

/**
 * @namespace tp.example.controller
 */

export default class App extends Controller {
    private pDialog: Promise<SelectDialog> | null = null;
    onInit(): void | undefined {
        console.log("AppController");
    }

    
    public async onButtonPress(): Promise<void> {
        console.log("Test");
        const view = this.getView();
        if (!view) return;

        if (!this.pDialog) {
            this.pDialog = Fragment.load({
                id: view.getId(),
                name: "tp.example.view.SelectDialog",
                controller: this
            }).then((oDialog) => {
                const dialog = oDialog as SelectDialog;
                dialog.setMultiSelect(true);
                dialog.setRememberSelections(true);
                view.addDependent(dialog);
                return dialog;
            });
        }

        // Dialog anzeigen
        const dialog = await this.pDialog;
        dialog.open("");
    }

    public onDialogClose(oEvent : SelectDialog$ConfirmEvent) : void {
        var oItems = oEvent.getParameter("selectedItems");
        var oMultiInput = this.byId("multiInput") as MultiInput;
        if (oItems && oItems.length) {
            MessageToast.show("You have chosen " + oItems.map((x) => x.getTitle()).join(", "));
            for (var i in oItems) {
                var oToken = new Token({
                    key: oItems[i].getTitle(),
                    text: oItems[i].getTitle()
                });
                oMultiInput.addToken(oToken);
            }
        } else {
            MessageToast.show("No new item was selected.");
        }
        this.onSearch();

        //oEvent.getSource().getBinding("items").filter([]);
    }

    public onSearch() : void {
        var oMultiInput = this.byId("multiInput") as MultiInput;
        var oList = this.byId("list") as List;

		const filter = [];
		if (oMultiInput.getTokens() && oMultiInput.getTokens().length > 0) {
            for (var token in oMultiInput.getTokens()) {
			    filter.push(new Filter("Categories", function(oValue) { return oValue.includes(oMultiInput.getTokens()[token].getText())}));
            }
		}
        var oCombinedFilter = new Filter({
            filters: filter,
            and: true 
        });

		const oBinding = oList?.getBinding("items") as ListBinding;
		oBinding?.filter(oCombinedFilter);
    }

        /**
    public onButtonPress(): void {
        console.log("Test")
    }
        */

};
