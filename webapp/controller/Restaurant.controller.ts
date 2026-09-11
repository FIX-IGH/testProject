// webapp/controller/Detail.controller.ts
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import Model from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";
import ObjectListItem from "sap/m/ObjectListItem";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Context from "sap/ui/model/Context";
import View from "sap/ui/core/mvc/View";
import SelectDialog from "sap/m/SelectDialog";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace tp.example.controller
 */
export default class Restaurant extends Controller {
	private pDialog: Promise<Dialog> | null = null;
	private pView: View;
	onInit(): void {
		const router = UIComponent.getRouterFor(this);
		(router.getRoute("restaurant") as Route).attachPatternMatched(this.onObjectMatched, this);
	}

	onObjectMatched(event: Route$PatternMatchedEvent): void {
		var order = this.getView()?.getModel("order") as JSONModel;
		this.getView()?.bindElement({
			path: "/" + window.decodeURIComponent((event.getParameter("arguments") as any).restaurantPath),
			model: "test"
		});
		this.pView = this.getView() as View;
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
	
	onAddDish(oEvent : ListItemBase$PressEvent): void {
		var order = this.getOwnerComponent()?.getModel("order") as JSONModel;
		var oItem = oEvent.getSource();
		var context = oItem.getBindingContext("test") as Context;
		//order.setProperty("/Restaurant", context.getProperty("/Restaurant"));
		if (order.getProperty("/Restaurant/RestaurantName") != undefined && this.pView.getBindingContext("test")?.getProperty("RestaurantName") != order.getProperty("/Restaurant/RestaurantName")) {
			MessageBox.confirm("You have an unfinished order for " + order.getProperty("/Restaurant/RestaurantName")+ ". Do you want to start a new order?", {
				title: "Cancel current order?",
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						var dishes = [];
						dishes.push(context.getProperty(""))
						order.setProperty("/Dishes", dishes)
						order.setProperty("/Restaurant", this.pView.getBindingContext("test")?.getProperty(""))
						order.updateBindings(true);
					}
				}
			});
		}
		else {
			var dishes = order.getProperty("/Dishes").slice();
			dishes.push(context.getProperty(""))
			order.setProperty("/Dishes", dishes)
			order.setProperty("/Restaurant", this.pView.getBindingContext("test")?.getProperty(""))
			order.updateBindings(true);
		}
	}

	async onCartPress(): Promise<void> {
		const view = this.getView();
		if (!view) return;

		if (!this.pDialog) {
			this.pDialog = Fragment.load({
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
			(await this.pDialog)?.close();
			document.removeEventListener("click", onClickOutsideClose);
		}
	}

		// Dialog anzeigen
		const dialog = await this.pDialog;
		document.addEventListener("click", onClickOutsideClose);
		dialog.open();
	}

	onButtonCheckout(): void {
		const router = UIComponent.getRouterFor(this);
		router.navTo("checkout");
	}

	onProfilePress(): void {
		const router = UIComponent.getRouterFor(this);
		router.navTo("profile");
	}

};