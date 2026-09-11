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
import Token, { Token$DeleteEvent } from "sap/m/Token";
import MultiInput from "sap/m/MultiInput";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import View from "sap/ui/core/mvc/View";
import { DataSetItem$SelectedEvent } from "sap/ui/ux3/DataSetItem";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import UIComponent from "sap/ui/core/UIComponent";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Context from "sap/ui/model/Context";
import History from "sap/ui/core/routing/History";

import Restaurant from "./Restaurant.controller";

/**
 * @namespace tp.example.controller
 */

export default class App extends Controller {
    private pDialog: Promise<SelectDialog> | null = null;
    private oDialog: Promise<Dialog> | null = null;

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
                oToken.attachDelete(this.onDelete, this);
                oMultiInput.addToken(oToken);
            }
        } else {
            MessageToast.show("No new item was selected.");
        }
        this.onSearch();

        //oEvent.getSource().getBinding("items").filter([]);
    }

    public onDelete(oEvent : Token$DeleteEvent) : void {
        var oToken = oEvent.getSource();
        oToken.destroy();
        this.onSearch();
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

	public onPress(oEvent: ListItemBase$PressEvent): void {
		const item = oEvent.getSource();
		const router = UIComponent.getRouterFor(this)
        console.log(item.getBindingContext("test"))
		router.navTo("restaurant", {
			restaurantPath: window.encodeURIComponent(((item.getBindingContext("test") as Context).getPath() as string).substring(1))
		});
	}

    async onCartPress(): Promise<void> {
        const view = this.getView();
        if (!view) return;

        if (!this.oDialog) {
            this.oDialog = Fragment.load({
                id: view.getId(),
                name: "tp.example.view.Cart",
                controller: this
            }).then((oDialog) => {
                const dialog = oDialog as Dialog;
                view.addDependent(dialog);
                return dialog;
            });
        }

    const onClickOutsideClose = async (oEvent : MouseEvent): Promise<void> => {
        const target = oEvent.target as HTMLElement
        if (target.id == "sap-ui-blocklayer-popup") {
            (await this.oDialog)?.close();
            document.removeEventListener("click", onClickOutsideClose);
        }
    }

        // Dialog anzeigen
        const dialog = await this.oDialog;
        document.addEventListener("click", onClickOutsideClose);
        dialog.open();
    }

    onProfilePress(): void {
        const router = UIComponent.getRouterFor(this);
        router.navTo("profile");
    }

    onButtonCheckout(): void {
        const router = UIComponent.getRouterFor(this);
        router.navTo("checkout");
    }

    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = UIComponent.getRouterFor(this);
            router.navTo("home", {}, true);
        }
    }

};
