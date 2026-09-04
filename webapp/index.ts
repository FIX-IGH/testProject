import XMLView from "sap/ui/core/mvc/XMLView";

XMLView.create({
	viewName: "tp.example.view.App",
	id: "app"
}).then(function (view) {
	view.placeAt("content");
});
