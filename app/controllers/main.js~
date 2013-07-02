/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var request = require('request');
var cheerio = require('cheerio');

var metainfo =  {
	author: '@h4ck4life',
	about: 'Pos Laju Tracking API - Free',
	email: 'alifaziz@gmail.com',
	version: '0.0.1'
    }

var parseTrackingID = (function(idx, app) {
    
  var url = 'http://www.pos.com.my/emstrack/viewdetail.asp?parcelno=' + idx;

  request(url, ( function(app) {
    return function(err, resp, body) {
	if (err)
	    throw err;
	$ = cheerio.load(body);
	
	// TODO: scraping goes here!
	var posDetails = [];
	
	$('.login tr').each(function(index, elem) {
	  if(index > 0) {
	    var posContent = {};
	    
	    $(this).find('td').each(function(index, elem) {
		var txtContent = $(this).html();
		txtContent = txtContent.replace('<br>', ' to ');
		
		switch(index) {
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
	
	app.respond(JSON.stringify(parentx), {
	  format: 'txt'
	});

    }
    
})(app));
});



var parseDomesticPricing = (function(weightInGram, zonId, app){
  
  var url = 'http://www.pos.com.my/pos_bm/appl/EmsRatedb.asp?berat='+ (weightInGram / 1000) +'&airmail='+ zonId;

  request(url, ( function(app) {
    return function(err, resp, body) {
	if (err)
	    throw err;
	$ = cheerio.load(body);
	
	// TODO: scraping goes here!
	
	if(zonId == 1) { var zonDetail = 'Dalam Bandar Yang Sama' };
	if(zonId == 2) { var zonDetail = 'Dalam Semenanjung / Sabah /Sarawak' };
	if(zonId == 4) { var zonDetail = 'Antara Semenanjung Dengan Sarawak' };
	if(zonId == 5) { var zonDetail = 'Antara Semenanjung Dengan Sabah' };
	if(zonId == 3) { var zonDetail = 'Antara Sabah Dan Sarawak' };
	
	priceDetails = {
	  price_without_tax: $('font[color=red]').text(),
	  weight_in_grams: weightInGram,
	  zon: { 
	    id: zonId,
	    detail: zonDetail },
	  tax_info: {
	    fuel_surchage: '15%',
	    handling_charges: '10%',
	    GST: '6%' }
	};
	
	
	var parentx = {
	  meta: metainfo,
	  data: priceDetails
	};
	
	// Respond
	app.respond(JSON.stringify(parentx), {
	  format: 'txt'
	});
	
    }

    })(app)); 
  
});




//------------------------------------------------------
// Controllers
//======================================================


var Main = function () {
  
  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };
  
  this.get = function(req, respo, params){
    parseTrackingID(params.id, this);    
  };
  
  this.priceDomestic = function(req, respo, params){
    parseDomesticPricing(params.gram, params.id, this);
  };
  
//======================================================
  
};

exports.Main = Main;


