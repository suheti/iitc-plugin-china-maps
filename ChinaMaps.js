// ==UserScript==
// @id             iitc-plugin-china-maps
// @name           IITC plugin: china maps
// @category       Misc
// @version        0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/suheti/iitc-plugin-china-maps/master/ChinaMaps.js
// @downloadURL    https://raw.githubusercontent.com/suheti/iitc-plugin-china-maps/master/ChinaMaps.js
// @description    Show portal position in Chinese map apps on IITC Mobil, giving correct positions on map even when "Fix Google Map offsets in China" plugin is enabled.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'local';
plugin_info.dateTimeVersion = '20170625.102106';
plugin_info.pluginId = 'basemap-gaode';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

  // Use own namespace for plugin
  window.plugin.chinaMaps = function() {};

  // The entry point for this plugin.
  function setup() {
    window.addHook('portalDetailsUpdated', window.plugin.chinaMaps.addToSidebar);
  }

  window.plugin.chinaMaps.addToSidebar = function() {
    $('.linkdetails').append('<aside><a id="china-maps">China Maps</a></aside>');
    $('#china-maps').on('click', function() {
      window.plugin.chinaMaps.chinaMaps(window.selectedPortal);
    });
  };

  window.plugin.chinaMaps.chinaMaps = function(guid) {

    var portalDetails = portalDetail.get(guid);

    var p_name = $('.title').text();

    var p_latE6 = portalDetails.latE6 / 1E6;
    var p_lngE6 = portalDetails.lngE6 / 1E6;

    var selectedPortal = 'selected portal';
    var baiduURI, gaodeURI;

    var tempString = 'nothing';
    if(L.Browser.mobile){
      baiduURI = 'baidumap://map/marker?location=' + p_latE6 + ',' + p_lngE6 + '&amp;title=' + p_name + '&amp;content='+selectedPortal+'&amp;src=iitc-plugin-chinaMaps&amp;coord_type=wgs84';
    } else {
      baiduURI = 'http://api.map.baidu.com/marker?location=' + p_latE6 + ',' + p_lngE6 + '&amp;title=' + encodeURIComponent(p_name) + '&amp;content='+encodeURIComponent(selectedPortal)+'&amp;src=iitc-plugin-chinaMaps&amp;coord_type=wgs84&amp;output=html';
      alert(baiduURI);
    }

    var textBody = 'window.plugin.chinaMaps.gaodeMap('+p_name+','+p_latE6+','+p_lngE6+');' +tempString +
    '<a onclick="window.plugin.chinaMaps.gaodeMap(\''+p_name+'\',\''+p_latE6+'\',\''+p_lngE6+'\');" id="gaode-map">高德地图</a>' +
    '<br><br>' +
    '<a id="baidu-map" href=' + baiduURI + '>百度地图</a>';

    dialog({
    html: textBody,
    id: 'plugin-china-maps',
    dialogClass: 'ui-dialog-chinamaps',
    title: 'China Maps'
    });
  };

  window.plugin.chinaMaps.gaodeMap = function(p_name, p_latE6, p_lngE6) {
    // var rec = "another" + p_name + " " + p_latE6 + " " + p_lngE6;
    // alert("fuck");
    // alert(rec);
    //alert();
    window.location = "http://www.google.com/";
    //window.location = "androidamap://viewMap?sourceApplication=iitc-plugin-chinaMaps&poiname="+p_name+"&lat="+p_latE6+"&lon="+p_lngE6+"&dev=1";
  };

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
