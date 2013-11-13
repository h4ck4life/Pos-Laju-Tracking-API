var request = require("request");

var cheerio = require("cheerio");

var nexmo = require("easynexmo/lib/nexmo");


var metainfo = {
    author: "@h4ck4life",
    about: "Pos Laju Tracking API - Free",
    email: "alifaziz@gmail.com",
    version: "0.0.2"
};

var parseTrackingID = function(idx, calltype, app) {
    var url = "http://www.pos.com.my/emstrack/viewdetail.asp?parcelno=" + idx;
    request(url, function(app) {
        return function(err, resp, body) {
            if (err) throw err;
            $ = cheerio.load(body);
            var posDetails = [];
            $(".login tr").each(function(index, elem) {
                if (index > 0) {
                    var posContent = {};
                    $(this).find("td").each(function(index, elem) {
                        var txtContent = $(this).html();
                        txtContent = txtContent.replace("<br>", " to ");
                        switch (index) {
                          case 0:
                            posContent.date = $(txtContent).text();
                            break;

                          case 1:
                            posContent.time = $(txtContent).text();
                            break;

                          case 2:
                            posContent.process = $(txtContent).text();
                            break;

                          case 3:
                            posContent.office = $(txtContent).text();
                            break;
                        }
                    });
                    posDetails.push(posContent);
                } else {}
            });
            var parentx = {
                meta: metainfo,
                data: posDetails
            };
	    
// 	    nexmo.sendTextMessage('PosLajuTracking', '60136301910', 'EM417670204MY Consignment dispatch out from Transit Office PPL KUALA LUMPUR', function(){
// 	      console.log('SMS SENT!');
// 	    });
	    
            // options of output. JSON or TXT
            if (calltype === "json") {
                app.respond(JSON.stringify(parentx), {
                    format: "js"
                });
            } else {
                app.respond(JSON.stringify(parentx), {
                    format: "txt"
                });
            }
        };
    }(app));
};

var parseDomesticPricing = function(weightInGram, zonId, calltype, app) {
    var url = "http://www.pos.com.my/pos_bm/appl/EmsRatedb.asp?berat=" + weightInGram / 1e3 + "&airmail=" + zonId;
    request(url, function(app) {
        return function(err, resp, body) {
            if (err) throw err;
            $ = cheerio.load(body);
            if (zonId == 1) {
                var zonDetail = "Dalam Bandar Yang Sama";
            }
            if (zonId == 2) {
                var zonDetail = "Dalam Semenanjung / Sabah /Sarawak";
            }
            if (zonId == 4) {
                var zonDetail = "Antara Semenanjung Dengan Sarawak";
            }
            if (zonId == 5) {
                var zonDetail = "Antara Semenanjung Dengan Sabah";
            }
            if (zonId == 3) {
                var zonDetail = "Antara Sabah Dan Sarawak";
            }


            priceActual = $("font[color=red]").text();
            priceActual = parseFloat(priceActual.substring(3, priceActual.length)).toFixed(2);

            priceCharge = parseFloat((0.25 * priceActual) + priceActual).toFixed(2);

            priceChargePlusActual = parseFloat(parseFloat(priceCharge) + parseFloat(priceActual)).toFixed(2);

            price_with_tax = parseFloat((parseFloat(0.06 * priceChargePlusActual)) + parseFloat(priceChargePlusActual)).toFixed(2);

            priceDetails = {
                price_with_tax: price_with_tax,
                price_without_tax: priceActual,
                weight_in_grams: weightInGram,
                zon: {
                    id: zonId,
                    detail: zonDetail
                },
                tax_info: {
                    fuel_surchage: "15%",
                    handling_charges: "10%",
                    GST: "6%"
                }
            };
            var parentx = {
                meta: metainfo,
                data: priceDetails
            };
            // options of output. JSON or TXT
            if (calltype === "json") {
                app.respond(JSON.stringify(parentx), {
                    format: "js"
                });
            } else {
                app.respond(JSON.stringify(parentx), {
                    format: "txt"
                });
            }
        };
    }(app));
};

var Main = function() {
  
    nexmo.initialize('c3f76bb8', '571c5e4a', 'http', false);
  
    this.index = function(req, resp, params) {
        this.respond(params, {
            format: "html",
            template: "app/views/main/index"
        });
    };
    this.get = function(req, respo, params) {
        parseTrackingID(params.id, params.type, this);
    };
    this.priceDomestic = function(req, respo, params) {
        parseDomesticPricing(params.gram, params.id, params.type, this);
    };
};

exports.Main = Main;