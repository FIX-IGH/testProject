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

/**
 * @namespace tp.example.controller
 */
export default class Restaurant extends Controller {

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
		
	}

	onNavBack(): void {
		const history = History.getInstance();
		const previousHash = history.getPreviousHash();

		if (previousHash !== undefined) {
			window.history.go(-1);
		} else {
			const router = UIComponent.getRouterFor(this);
			router.navTo("app", {}, true);
		}
	}
	
	onAddDish(oEvent : ListItemBase$PressEvent): void {
		var order = this.getView()?.getModel("order") as JSONModel;
		var oItem = oEvent.getSource();
		var context = oItem.getBindingContext("test") as Context;
		//order.setProperty("/Restaurant", context.getProperty("/Restaurant"));
		var dishes = order.getProperty("/Dishes");
		dishes.push(context.getProperty(""))
		order.setProperty("/Dishes", dishes)
		console.log(order);
		this.getView().byId("DefaultIconButton").setText(order.getProperty("/Dishes").length)
	}

	getDishesLength(aDishes) {
		console.log(aDishes)

		return aDishes.length;
	}
};