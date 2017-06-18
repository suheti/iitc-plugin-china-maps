// ==UserScript==
// @id china-maps@suheti
// @name IITC Plugin: china maps
// @category Misc
// @version 0.0.1
// @namespace 
// @description Show portal position in Chinese map apps on IITC Mobil, giving correct positions on map even when "Fix Google Map offsets in China" plugin is enabled.
// @downloadURL 
// @updateURL   
// @include http://www.ingress.com/intel*
// @match http://www.ingress.com/intel*
// @include https://www.ingress.com/intel*
// @match https://www.ingress.com/intel*
// @grant none
// ==/UserScript==

// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.
function wrapper(plugin_info) {
  // Make sure that window.plugin exists. IITC defines it as a no-op function,
  // and other plugins assume the same.
  if (typeof window.plugin !== 'function') window.plugin = function() {};

  // Use own namespace for plugin
  window.plugin.chinaMaps = {};

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

    var textBody = 
    '<a href="androidamap://viewMap?sourceApplication=iitc-plugin-chinaMaps&amp;poiname='+p_name+'&amp;lat='+p_latE6+'&amp;lon='+p_lngE6+'&amp;dev=1">高德地图</a>' +
    '<br><br>' +
    '<a href="baidumap://map/marker?location=' + p_latE6 + ',' + p_lngE6 + '&amp;title=' + p_name + '&amp;content='+selectedPortal+'&amp;src=iitc-plugin-chinaMaps&amp;coord_type=wgs84">百度地图</a>';

    alert(textBody);
  };

  

  // Add an info property for IITC's plugin system
  setup.info = plugin_info;

  // Make sure window.bootPlugins exists and is an array
  if (!window.bootPlugins) window.bootPlugins = [];
  // Add our startup hook
  window.bootPlugins.push(setup);
  // If IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
}


// Create a script element to hold our content script
var script = document.createElement('script');
var info = {};

// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

// Create a text node and our IIFE inside of it
var textContent = document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')');
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(script);