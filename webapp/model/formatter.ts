import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

class Rating {
    Author : String
    Message : String
    numStars : number
    Type : String
    Date: Date
}

export default {
    calcAverage(arr: Array<any>) {
        if (arr != null) {
            if (arr.length > 0) {
                //console.log(arr)
                //console.log(arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Rating), 0)/(arr.filter(e => parseInt(e.Rating) > 0).length));

                return arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Rating), 0)/(arr.filter(e => parseInt(e.Rating) > 0).length);
            }
            else {
                return 0
            }
        }
    },

    ratingDesc(arr: Array<any>) {
        if (arr != null) {
            if (arr.length > 0) {
                //console.log(arr)
                //console.log(arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Rating), 0)/(arr.filter(e => parseInt(e.Rating) > 0).length));
                return "Average rating of " + Math.round(arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Rating), 0)/(arr.filter(e => parseInt(e.Rating) > 0).length) * 100) / 100  + "/5 based on " + (arr.filter(e => parseInt(e.Rating) > 0).length) + " reviews";
            }
        }
        else {
            return "No reviews yet"
        }
    },

    numItems(arr: Array<any>, name: String) {
        if (arr != null) {
            if (arr.filter(e => e.Name == name).length > 0) {
                return arr.filter(e => e.Name == name).length + " in Shopping Cart"
            }
            else {
                return "None"
            }
        }
        else {
            return "None"
        }
    },

    totalSum(arr: Array<any>) {
        if (arr != null) {
            if (arr.length > 0) {
                console.log(arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Price), 0))
                return arr.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.Price), 0);
            }
            else {
                return "None"
            }
        }
        else {
            return "None"
        }
    }

}