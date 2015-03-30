/**
 * [ description]
 * @return {[type]}
 */
var poslajutracking = function() {
    var request = require("request");
    var cheerio = require("cheerio");
    //var nexmo = require("easynexmo/lib/nexmo");
    //nexmo.initialize("c3f76bb8", "571c5e4a", "http", false);
    var metainfo = {
        author: "@h4ck4life",
        about: "Pos Laju Tracking API",
        email: "alifaziz@gmail.com",
        version: "0.0.5"
    };
    /**
         * Parse Tracking ID
         * @param  {[type]} idx
         * @param  {[type]} calltype
         * @param  {[type]} app
         * @return {[JSON]}
         */
    var parseTrackingID = function(idx, calltype, app, callbackFn) {
        //var url = "http://www.pos.com.my/emstrack/viewdetail.asp?parcelno=" + idx;
        var url = "http://api.pos.com.my/TrackNTraceWebApi/api/Details/"+ idx + "?callback=results";
        request(url, function(app) {
            return function(err, resp, body) {
                if (err) throw err;
                var json = body.substring(body.indexOf("(") + 1, body.lastIndexOf(")"));
                /*$ = cheerio.load(body);
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
                });*/
                var parentx = {
                    meta: metainfo,
                    data: JSON.parse(json)
                };
                //      nexmo.sendTextMessage('PosLajuTracking', '60136301910', 'EM417670204MY Consignment dispatch out from Transit Office PPL KUALA LUMPUR', function(){
                //        console.log('SMS SENT!');
                //      });
                // options of output. JSON or TXT
                
                    callbackFn(parentx);
               
            };
        }(app));
    };
    /**
         * Parse Domestic Pricing
         * @param  {[type]} weightInGram
         * @param  {[type]} zonId
         * @param  {[type]} calltype
         * @param  {[type]} app
         * @return {[type]}
         */
    var parseDomesticPricing = function(weightInGram, zonId, calltype, app, callbackFn) {
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
                priceCharge = parseFloat(parseFloat(.25) * parseFloat(priceActual) + parseFloat(priceActual)).toFixed(2);
                //priceChargePlusActual = parseFloat(parseFloat(priceCharge) + parseFloat(priceActual)).toFixed(2);
                price_with_tax = parseFloat(parseFloat(.06 * priceCharge) + parseFloat(priceCharge)).toFixed(2);
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
                // 
                callbackFn(parentx);
            };
        }(app));
    };
    return {
        parseTrackingID: parseTrackingID,
        parseDomesticPricing: parseDomesticPricing
    };
}();

module.exports = poslajutracking;