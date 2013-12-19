var request = require("request");

var cheerio = require("cheerio");

//var nexmo = require("easynexmo/lib/nexmo");
var cache = require("memory-cache");

var poslajutracking = require("../../lib/poslajutracking_lib.js");

var Main = function() {
    //nexmo.initialize("c3f76bb8", "571c5e4a", "http", false);
    this.index = function(req, resp, params) {
        if (cache.get("index") == null) {
            var respondObj = {
                format: "html",
                template: "app/views/main/index"
            };
            cache.put("index", respondObj);
            this.respond(params, respondObj);
        } else {
            this.respond(params, cache.get("index"));
        }
    };
    this.get = function(req, respo, params) {
        var self = this;
        if (cache.get(params.id) == null) {
            poslajutracking.parseTrackingID(params.id, params.type, this, function(respObj) {
                cache.put(params.id, respObj, 9e5);
                if (params.type === "json") {
                    self.respond(JSON.stringify(respObj), {
                        format: "js"
                    });
                } else {
                    self.respond(JSON.stringify(respObj), {
                        format: "txt"
                    });
                }
            });
        } else {
            if (params.type === "json") {
                this.respond(JSON.stringify(cache.get(params.id)), {
                    format: "js"
                });
            } else {
                this.respond(JSON.stringify(cache.get(params.id)), {
                    format: "txt"
                });
            }
        }
    };
    this.priceDomestic = function(req, respo, params) {
        var self = this;
        if (cache.get(params.gram + params.id) == null) {
            poslajutracking.parseDomesticPricing(params.gram, params.id, params.type, this, function(respObj) {
                cache.put(params.gram + params.id, respObj, 864e5);
                if (params.type === "json") {
                    self.respond(JSON.stringify(respObj), {
                        format: "js"
                    });
                } else {
                    self.respond(JSON.stringify(respObj), {
                        format: "txt"
                    });
                }
            });
        } else {
            if (params.type === "json") {
                this.respond(JSON.stringify(cache.get(params.gram + params.id)), {
                    format: "js"
                });
            } else {
                this.respond(JSON.stringify(cache.get(params.gram + params.id)), {
                    format: "txt"
                });
            }
        }
    };
    this.notify = function(req, respo, params) {
        var self = this;
        var Parcelparams = {
            posid: params.id,
            notifyemail: params.notifyemail,
            delivered: 0
        };
        var parcel = geddy.model.Parcel.create(Parcelparams);
        if (parcel.isValid()) {
            parcel.save(function(err, data) {
                if (err) {
                    throw err;
                }
                self.respond({saved: true}, {
                    format: "json"
                });
            });
        }
        
    };
};

exports.Main = Main;