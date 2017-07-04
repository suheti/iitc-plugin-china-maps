// ==UserScript==
// @id             iitc-plugin-china-maps
// @name           IITC plugin: china maps
// @category       Misc
// @version        0.0.2
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/suheti/iitc-plugin-china-maps/master/ChinaMaps.user.js
// @downloadURL    https://raw.githubusercontent.com/suheti/iitc-plugin-china-maps/master/ChinaMaps.user.js
// @description    Export portal position in mainland China map vendors, giving correct positions on map with or without "Fix Google Map offsets in China" plugin enabled. Currently works on android and desktop, not for ios.
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
      //android uri
      baiduURI = 'baidumap://map/marker?location=' + p_latE6 + ',' + p_lngE6 + '&amp;title=' + encodeURIComponent(p_name) + '&amp;content='+encodeURIComponent(selectedPortal)+'&amp;src=iitc-plugin-chinaMaps&amp;coord_type=wgs84';
      gaodeURI = "androidamap://viewMap?sourceApplication=iitc-plugin-chinaMaps&amp;poiname=" + encodeURIComponent(p_name)+"&amp;lat="+p_latE6+"&amp;lon="+p_lngE6+"&amp;dev=1";

    } else {
      baiduURI = 'http://api.map.baidu.com/marker?location=' + p_latE6 + ',' + p_lngE6 + '&amp;title=' + encodeURIComponent(p_name) + '&amp;content='+encodeURIComponent(selectedPortal)+'&amp;src=iitc-plugin-chinaMaps&amp;coord_type=wgs84&amp;output=html';
      gaodeURI = 'http://uri.amap.com/marker?position=' + p_lngE6 + ',' + p_latE6 + '&name='+encodeURIComponent(p_name)+'&src=iitc-plugin-chinaMaps&coordinate=wgs84&callnative=0';
    }

    var textBody = 
    '<a id="gaode-map" href=' + gaodeURI + '>高德地图</a>' +
    '<br><br>' +
    '<a id="baidu-map" href=' + baiduURI + '>百度地图</a>';

    dialog({
    html: textBody,
    id: 'plugin-china-maps',
    dialogClass: 'ui-dialog-chinamaps',
    title: 'China Maps'
    });
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
