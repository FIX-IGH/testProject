import Input from "sap/m/Input";
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Context from "sap/ui/model/Context";

/**
 * @namespace tp.example.controller
 */
export default class Profile extends Controller {

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

    onPasswordChange(): void {
        var oldPassword = this.byId("oldPasswordInput") as Input;
        var newPassword = this.byId("newPasswordInput") as Input;
        var newPasswordRepeat = this.byId("newPasswordInputRepeat") as Input;
        var profile = this.getOwnerComponent()?.getModel("profile") as JSONModel;

        if (oldPassword.getValue() == profile.getProperty("/Password")) {
            if (newPassword.getValue() == newPasswordRepeat.getValue()) {
                profile.setProperty("/Password", newPassword.getValue());
                MessageBox.success("Password changed successfully");
                oldPassword.setValue("");
                newPassword.setValue("");
                newPasswordRepeat.setValue("");
            }
            else {
                MessageBox.error("New password was not repeated correctly");
            }
        }
        else {
            MessageBox.error("Password was incorrect");
        }

    }

    onProfilePress(): void {
        const router = UIComponent.getRouterFor(this);
        router.navTo("profile");
    }

    onRepeatOrder(oEvent : ListItemBase$PressEvent) {
        const item = oEvent.getSource();
        var context = item.getBindingContext("profile") as Context;
        var order = this.getOwnerComponent()?.getModel("order") as JSONModel;
        order.setProperty("/Restaurant", context.getProperty("Restaurant"));
		order.setProperty("/Dishes", context.getProperty("Dishes"));
        const router = UIComponent.getRouterFor(this);
        router.navTo("checkout");
    }

};