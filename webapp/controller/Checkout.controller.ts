import BusyDialog from "sap/m/BusyDialog";
import Controller from "sap/ui/core/mvc/Controller";
import Fragment from "sap/ui/core/Fragment";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import View from "sap/ui/core/mvc/View";
import MessageBox from "sap/m/MessageBox";
import Route from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import History from "sap/ui/core/routing/History";
import { ListBase$DeleteEvent } from "sap/m/ListBase";
import Context from "sap/ui/model/Context";

/**
 * @namespace tp.example.controller
 */
export default class Checkout extends Controller {
    private pBusyDialog : Promise<BusyDialog> | null = null;
    private iTimeoutId : any;
    async onConfirmPurchase(): Promise<void> {
			// load BusyDialog fragment asynchronously
			if (!this.pBusyDialog) {
				this.pBusyDialog = Fragment.load({
					name: "tp.example.view.BusyDialog",
					controller: this
				}).then((pBusyDialog) => {
                    const dialog = pBusyDialog as BusyDialog;
					this.getView()?.addDependent(dialog);
					syncStyleClass("sapUiSizeCompact", this.getView() as View, dialog);
					dialog.attachClose(() => {
							this.onPurchase();
						});
					return dialog;
				});
			}

            const dialog = await this.pBusyDialog;
            dialog.open();
            setTimeout(async () => (await this.pBusyDialog)?.close(), 2000);
       
    }

	onPurchase(): void {
		var order = this.getOwnerComponent()?.getModel("order") as JSONModel;
		order.setProperty("/Date", new Date().toLocaleDateString())
		var profile = this.getOwnerComponent()?.getModel("profile") as JSONModel;
		var previousOrders = profile.getProperty("/previousOrders").slice();
		previousOrders.push(JSON.parse(JSON.stringify(order.getProperty("/"))))
		profile.setProperty("/previousOrders", previousOrders)
		order.setProperty("/Restaurant", {});
		order.setProperty("/Dishes", []);
		//order.updateBindings(true);
		console.log(order)

		MessageBox.success("Payment processed successfully!"); 		
		const router = UIComponent.getRouterFor(this);
		router.navTo("profile");
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

	onDeleteItem(oEvent : ListBase$DeleteEvent): void {
		var order = this.getOwnerComponent()?.getModel("order") as JSONModel;
		var oItem = oEvent.getParameter("listItem");
		var context = oItem?.getBindingContext("order") as Context;
		//console.log(context.getProperty(""))
		var dishes = order.getProperty("/Dishes");

		var index = dishes.indexOf(context.getProperty(""));
		if (index !== -1) {
			dishes.splice(index, 1);
		}
		//order.setProperty("/Restaurant", context.getProperty("/Restaurant"));
		order.setProperty("/Dishes", dishes);
		order.updateBindings(true);
	}

}