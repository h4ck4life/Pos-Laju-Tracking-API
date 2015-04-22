var request = require("request");

var cheerio = require("cheerio");

//var nexmo = require("easynexmo/lib/nexmo");
var cache = require("memory-cache");

var poslajutracking = require("../../lib/poslajutracking_lib.js");

var Main = function () {
	//nexmo.initialize("c3f76bb8", "571c5e4a", "http", false);
	this.index = function (req, resp, params) {
		if (cache.get("index") == null) {
			var respondObj = {
				format: "html",
				template: "app/views/main/index"
			};
			cache.put("index", respondObj);
			this.respond({
				title: 'Pos Laju Tracking API | @h4ck4life'
			}, respondObj);
		} else {
			this.respond({
				title: 'Pos Laju Tracking API | @h4ck4life'
			}, cache.get("index"));
		}
	};
	this.get = function (req, respo, params) {
		var self = this;
		if (cache.get(params.id) == null) {
			poslajutracking.parseTrackingID(params.id, params.type, this, function (respObj) {
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
	this.delete = function (req, respo, params) {
	  var self = this;
	  geddy.model.Parcel.remove({posid: params.id, submitterID: params.submitterID}, function (err, data) {
      if (err) {
          self.respond({
              saved: false,
              debug: "Delete not successful. Please try again."
          }, {
              format: "json"
          });
          throw err;
      }
      self.respond({
          saved: true
      }, {
          format: "json"
      });
    });
	};
	this.priceDomestic = function (req, respo, params) {
		var self = this;
		if (cache.get(params.gram + params.id) == null) {
			poslajutracking.parseDomesticPricing(params.gram, params.id, params.type, this, function (respObj) {
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
	this.monitor = function (req, respo, params) {
		var self = this;
		var Parcelparams;
		var origin = req.headers.host;
		// poslajutracking.herokuapp.com
		// localhost:4000
		/*
		if (origin !== "poslajutracking.herokuapp.com") {
			self.respond({
				saved: false,
				debug: "You're not allowed to post. Sorry."
			}, {
				format: "json"
			});
			return false;
		}*/
		if (params.notifyemail && params.id && params.postitle) {
			geddy.model.Parcel.all({
				posid: params.id,
				submitterID: params.submitterID
			}, function (err, data) {
				if (data.length > 0) {
					self.respond({
						saved: false,
						debug: "Parcel ID already exists.",
						parcelId: params.id
					}, {
						format: "json"
					});
					return false;
				} else {
					Parcelparams = {
						posid: params.id,
						postitle: params.postitle,
						notifyemail: params.notifyemail,
						ccnotifyemail: params.ccnotifyemail,
						submitterID: params.submitterID,
						delivered: 0
					};
					var parcel = geddy.model.Parcel.create(Parcelparams);
					if (parcel.isValid()) {
						parcel.save(function (err, data) {
							if (err) {
								self.respond({
									saved: false,
									debug: "Make sure 'id' and 'notifyemail' parameters are present"
								}, {
									format: "json"
								});
								throw err;
							}
							self.respond({
								saved: true
							}, {
								format: "json"
							});
							return false;
						});
					}
				}
			});
		} else {
			self.respond({
				saved: false,
				debug: "Make sure 'id' and 'notifyemail' parameters are present"
			}, {
				format: "json"
			});
		}
	};
	this.notify = function (req, respo, params) {
		var paramsRender = {
			title: 'Pos Laju Parcel Status Notifier'
		};
		if (cache.get("notify") == null) {
			var respondObj = {
				format: "html",
				template: "app/views/main/notify"
			};
			cache.put("notify", respondObj);
			this.respond(paramsRender, respondObj);
		} else {
			this.respond(paramsRender, cache.get("notify"));
		}
	};
};

exports.Main = Main;
