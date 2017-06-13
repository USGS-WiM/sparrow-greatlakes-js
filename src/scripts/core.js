//for jshint
'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

var app = {};


// Get toast and page loader ready
$( document ).ready(function() {
  $("#page-loader").fadeOut();
  $("#toast-fixed").fadeOut();
});



require([
    'esri/arcgis/utils',
    'esri/map',
    'esri/tasks/QueryTask',
    'esri/tasks/query',
    'esri/Color',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/WMSLayer',
    'esri/dijit/Geocoder',
    'esri/dijit/PopupTemplate',
    'esri/graphic',
    'esri/geometry/Extent',
    'esri/geometry/Multipoint',
    'esri/geometry/Point',
    'esri/layers/LayerDrawingOptions',
    'esri/symbols/PictureMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/tasks/ClassBreaksDefinition',
    'esri/tasks/AlgorithmicColorRamp',
    'esri/tasks/GenerateRendererParameters',
    'esri/tasks/GenerateRendererTask',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'esri/tasks/ProjectParameters',
    'esri/geometry/webMercatorUtils',
    'esri/SpatialReference',
    'dojo/parser',
    'dojo/dnd/Moveable',
    'dojo/query',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/on',
    'dojo/domReady!'
], function (
    arcgisUtils,
    Map,
    QueryTask,
    Query,
    Color,
    HomeButton,
    LocateButton,
    ArcGISTiledMapServiceLayer,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    ArcGISImageServiceLayer,
    WMSLayer,
    Geocoder,
    PopupTemplate,
    Graphic,
    Extent,
    Multipoint,
    Point,
    LayerDrawingOptions,
    PictureMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    ClassBreaksDefinition,
    AlgorithmicColorRamp,
    GenerateRendererParameters,
    GenerateRendererTask,
    IdentifyTask,
    IdentifyParameters,
    ProjectParameters,
    webMercatorUtils,
    SpatialReference,
    parser,
    Moveable,
    query,
    dom,
    domClass,
    on
) {
    parser.parse();

    app.dragInfoWindows = true;
    app.clickSelectionActive = false;   // used when they are in selection mode
    app.drawSelectionActive = false; // used when they are rectangle selection mode
    app.userSelectedDispFieldName = ""; // holder of which DisplayFieldName they are clicking
    app.userSelectedShapes = [];
    app.customChartClicked = false; // when custom chart button clicked, need to let the chart know to show 'Show Full Chart' button
    app.shiftKey = false; // store if they are selecting (click) or unselecting (shift+click)
    app.formattedHighlightString; // from custom defined chart click, store first view in case they zoom in and want to reset back to this

    /* values come from config file */
    app.defaultMapCenter = mapCenter;
    app.defaultZoom = defaultZoomLevel;

    //setup map
    app.map = Map('mapDiv', {
        basemap: 'gray',
        center: app.defaultMapCenter,
        zoom: app.defaultZoom
    });


    //button for returning to initial extent
    app.home = new HomeButton({
        map: app.map
    }, 'homeButton');
    app.home.startup();

    //button for finding and zooming to user's location
    app.locate = new LocateButton({
        map: app.map
    }, 'locateButton');
    app.locate.startup();

    app.geocoder = new Geocoder({
        value: '',
        maxLocations: 25,
        autoComplete: true,
        arcgisGeocoder: true,
        autoNavigate: false,
        map: app.map
    }, 'geosearch');
    app.geocoder.startup();
    app.geocoder.on('select', geocodeSelect);
    app.geocoder.on('findResults', geocodeResults);
    app.geocoder.on('clear', app.clearFindGraphics);

     //TX WSC Search API
    search_api.create( 'geosearch_usgs', {
        on_result: function(o) {
            // what to do when a location is found
            // o.result is geojson point feature of location with properties
            var noExtents = ["GNIS_MAJOR", "GNIS_MINOR", "ZIPCODE", "AREACODE"];
            var noExtentCheck = noExtents.indexOf(o.result.properties["Source"])
            if (noExtentCheck == -1) {
                app.map.setExtent(
                    new esri.geometry.Extent({
                        xmin: o.result.properties.LonMin,
                        ymin: o.result.properties.LatMin,
                        xmax: o.result.properties.LonMax,
                        ymax: o.result.properties.LatMax,
                        spatialReference: {"wkid":4326}
                    }),
                    true
                );
            } else {
                app.map.centerAndZoom(
                    new Point( o.result.properties.Lon, o.result.properties.Lat ),
                    12
                );
            }

            // open popup at location listing all properties
            app.map.infoWindow.setTitle('Search Result');
            app.map.infoWindow.setContent(
                $.map( Object.keys(o.result.properties), function(property) {
                    return '<b>' + property + ': </b>' + o.result.properties[property];
                }).join('<br/>')
            );
            // Close modal
            $('#geosearchModal').modal('hide');

            app.map.infoWindow.show(
                new Point( o.result.properties.Lon, o.result.properties.Lat )
            );
        },
        "include_usgs_sw" : true,
        "include_huc2" : true,
        "include_huc4" : true,
        "include_huc6" : true,
        "include_huc8" : true,
        "include_huc12" : true
    });


    var layerDefObj = {};
    var AllAOIOptions = [];
    var Grp2NamDescArr = [];
    var tableArr = []; //global for table updating
    var labelArr = []; //glocal for table updating

    // in event-handlers.js
    loadEventHandlers();

    //fire initial query to populate AOIs
    //UPDATE IMPORTANT!  check layer and field names to make sure the fields exist in the service layers
    setupQueryTask(serviceBaseURL + 5, ['ST', 'GP3', 'GP2', 'GP1' ], '1=1');

    app.setLayerDefObj = function(newObj){

        //UPDATE NOTE: need 1 case for every AOI select
        switch(newObj.selectedId){
            case 'st-select':
                layerDefObj.AOIST = newObj.selectedValue;
                break;
            case 'grp1-select':
                layerDefObj.AOI1 = newObj.selectedValue;
                break;
            case 'grp2-select':
                layerDefObj.AOI2 = newObj.selectedValue;
                break;
            case 'grp3-select':
                layerDefObj.AOI3 = newObj.selectedValue;
                break;
        }
        app.updateAOIs(newObj.selectedId);
    };

    app.getLayerDefObj = function(){
        return layerDefObj;
    };

    app.clearLayerDefObj = function(){
        layerDefObj = {};
        $('#st-select').empty();
        $('#grp1-select').empty();
        $('#grp2-select').empty();
        $('#grp3-select').empty();
        //UPDATE NOTE: add empty method for addtl. AOI selects
        defaultAOIOptions();
    };

    //disabling dropdown need to clear selection
    app.clearOneLayerDefObj = function(whichOne){
        var selectID = '';
        switch(whichOne){
            case 'AOIST':
                //$("#st-select").empty();
                layerDefObj.AOIST = undefined;
                app.updateAOIs('grp1-select');
                app.updateAOIs('grp2-select');
                app.updateAOIs('grp3-select');
                break;
            case 'AOI1':
                //$("#grp1-select").empty();
                layerDefObj.AOI1 = undefined;
                app.updateAOIs('st-select');
                app.updateAOIs('grp2-select');
                app.updateAOIs('grp3-select');
                break;
            case 'AOI2':
                //$("#grp2-select").empty();
                layerDefObj.AOI2 = undefined;
                app.updateAOIs('grp1-select');
                app.updateAOIs('grp3-select');
                app.updateAOIs('st-select');
                break;
            case 'AOI3':
                //$("#grp2-select").empty();
                layerDefObj.AOI3 = undefined;
                app.updateAOIs('grp1-select');
                app.updateAOIs('grp2-select');
                app.updateAOIs('st-select');
                break;
        }
    };
    //return unique list of AOIs for dropdowns based on which property to filter by
    var getUniqueArray = function(originalArray, prop){
        var uniqueArray = [];
        for(var i in originalArray) {
            if (uniqueArray.map(function (p) { return p; }).indexOf(originalArray[i][prop]) < 0){
                uniqueArray.push(originalArray[i][prop]);
            }
        }
        //return them sorted
        return uniqueArray.sort();
    }

    app.updateAOIs = function(selectedId){
        // for four AOI options
        var filteredAOIOptions = [];

        var grp3Options = [];
        var grp2Options = [];
        var grp1Options = [];
        var stOptions = [];

        switch(selectedId) {
            //ST SELECT CHANGED
            case 'st-select':
                //filter the grp1- and grp3-select options using the selected ST__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOI2) {
                    $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP2 === layerDefObj.AOI2; });  //grp2 AND ST have values
                }
                else {
                    $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                /*______________________________________________________
                    filteredAOIOptions Array of Objects Example         ]
                [{                                                      ]
                    GP1: "Conasauga River",                       ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010101",                             ]
                    ST:"GA"   <--- Selected State                       ]
                },                                                      ]
                {                                                       ]
                    GP1: "Conasauga River",                       ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010102",  <-- Obj for every HUC10    ]
                    ST:"GA"                                             ]
                }]                                                      ]
                ________________________________________________________]
                */

                //get unique group 1 values
                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', grp3Options, '#grp3-select', 'AOI3');

                //filter the grp2- and grp3-select options using the selected ST__________________________________________________________________________________________________________________________________________
                filteredAOIOptions = [];
                //need to know if ST and grp1 have values
                if (layerDefObj.AOI1) {
                    $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP1 === layerDefObj.AOI1; }); //ST and grp1 have selected vals
                }
                else {
                    $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 and group3 values
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3')

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp2Options, '#grp2-select', 'AOI2', grp3Options, '#grp3-select', 'AOI3');

                //filter the grp1- and grp2-select options using the selected ST__________________________________________________________________________________________________________________________________________
                filteredAOIOptions = [];
                //need to know if ST and grp1 have values
                if (layerDefObj.AOI3) {
                    $('#grp1-select').empty(); $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP3 === layerDefObj.AOI3; }); //ST and grp3 have selected vals
                }
                else {
                    $('#grp1-select').empty(); $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 and group3 values
                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', grp2Options, '#grp2-select', 'AOI2');
                break;

            //Group 1 SELECT CHANGED
            case 'grp1-select':
                //filter the st- and grp3-select options using the selected GRP1__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOI2) {
                    $('#st-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.GP1 === layerDefObj.AOI1; });
                }
                else {
                    $('#st-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique states in the selected grp1
                stOptions = getUniqueArray(filteredAOIOptions, 'ST');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(stOptions, '#st-select', 'AOIST', grp3Options, '#grp3-select', 'AOI3');

                //filter the grp2- and grp3-select options using the selected GRP1__________________________________________________________________________________________________________________________________________
                filteredAOIOptions = [];
                //need to know if gr1 and st have values
                if (layerDefObj.AOIST) {
                    $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 == layerDefObj.AOI1 && s.ST == layerDefObj.AOIST; }); //ST and Grp1 have selected vals
                }
                else {
                    $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 == layerDefObj.AOI1 });
                }
                if (filteredAOIOptions.length == 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 options from the grp1 selection
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp2Options, '#grp2-select', 'AOI2', grp3Options, '#grp3-select', 'AOI3');

                //filter the grp2- and st-select options using the selected GRP1__________________________________________________________________________________________________________________________________________
                filteredAOIOptions = [];
                //need to know if ST and grp1 have values
                if (layerDefObj.AOI3) {
                    $('#grp2-select').empty(); $('#st-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.GP3 === layerDefObj.AOI3; }); //ST and grp3 have selected vals
                }
                else {
                    $('#grp2-select').empty(); $('#st-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 and group3 values
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');
                stOptions = getUniqueArray(filteredAOIOptions, 'ST');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp2Options, '#grp2-select', 'AOI2', stOptions, '#st-select', 'AOIST');
                break;

            //Group 2 SELECT CHANGED
            case 'grp2-select':
                //filter the grp1- and grp3-select options using the selected GRP2__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOIST) {
                    $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.ST === layerDefObj.AOIST; });
                }
                else {
                    $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', grp3Options, '#grp3-select', 'AOI3');

                filteredAOIOptions= [];
                //filter the st- and grp3-select options using the selected GRP2__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOI1) {
                    $('#st-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.GP1 === layerDefObj.AOI1; });
                }
                else {
                    $('#st-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2; });
                }
                if (filteredAOIOptions.length == 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                stOptions = getUniqueArray(filteredAOIOptions, 'ST');
                grp3Options = getUniqueArray(filteredAOIOptions, 'GP3');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(stOptions, '#st-select', 'AOIST', grp3Options, '#grp3-select', 'AOI3');

                //filter the grp1- and st-select options using the selected GRP2__________________________________________________________________________________________________________________________________________
                filteredAOIOptions = [];
                //need to know if ST and grp1 have values
                if (layerDefObj.AOI3) {
                    $('#st-select').empty(); $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.GP3 === layerDefObj.AOI3; }); //ST and grp3 have selected vals
                }
                else {
                    $('#st-select').empty(); $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 and group3 values
                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                stOptions = getUniqueArray(filteredAOIOptions, 'ST');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', stOptions, '#st-select', 'AOIST');
                break;
            // Group 3 SELECT CHANGED
            case 'grp3-select':
                //filter the grp1- and grp2-select options using the selected GRP3__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOIST) {
                    $('#grp1-select').empty();  $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.ST === layerDefObj.AOIST; });
                }
                else {
                    $('#grp1-select').empty();  $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');

                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', grp2Options, '#grp2-select', 'AOI2');

                filteredAOIOptions= [];
                //filter the st- and grp2-select options using the selected GRP3__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOI1) {
                    $('#st-select').empty();  $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.GP1 === layerDefObj.AOI1; });
                }
                else {
                    $('#st-select').empty();  $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3; });
                }
                if (filteredAOIOptions.length == 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                stOptions = getUniqueArray(filteredAOIOptions, 'ST');
                grp2Options = getUniqueArray(filteredAOIOptions, 'GP2');
                //set other two AOI options and reselect if previously selected
                appendSelectOptions(stOptions, '#st-select', 'AOIST', grp2Options, '#grp2-select', 'AOI2');


                filteredAOIOptions = [];
                //filter the st- and grp1-select options using the selected GRP3__________________________________________________________________________________________________________________________________________
                if (layerDefObj.AOI2) {
                    $('#st-select').empty();  $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.GP2 === layerDefObj.AOI2; }); //ST and grp3 have selected vals
                }
                else {
                    $('#st-select').empty();  $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3; });
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique group2 and group3 values
                grp1Options = getUniqueArray(filteredAOIOptions, 'GP1');
                stOptions = getUniqueArray(filteredAOIOptions, 'ST');
                //set other two AOI options and reselect if previously selected
                appendSelectOptions(grp1Options, '#grp1-select', 'AOI1', stOptions, '#st-select', 'AOIST');
                break;

        }
    }

    //function used several times in above switch case
    var appendSelectOptions = function(firstOptions, select1_ID, firstAOI, secondOptions, select2_ID, secondAOI){
        //set the filtered state options
        $.each(firstOptions, function(index, option){
            $(select1_ID).append(new Option(option));
        });
        $(select1_ID).selectpicker('refresh');
        //set the filtered grp3 options
        $.each(secondOptions, function(index, option){

            $(select2_ID).append(new Option(option));

        });
        $(select2_ID).selectpicker('refresh');

        //if something in grp2 (HUC8) AOI was selected previously, programatically select the previously correct option
        if(layerDefObj[firstAOI]){
            $(select1_ID).selectpicker('val', layerDefObj[firstAOI]);
        }

        if(layerDefObj[secondAOI]){
            $(select2_ID).selectpicker('val', layerDefObj[secondAOI]);
        }
    };

    app.initMapScale = function() {
        var scale = app.map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
        var initMapCenter = webMercatorUtils.webMercatorToGeographic(app.map.extent.getCenter());
        $('#latitude').html(initMapCenter.y.toFixed(3));
        $('#longitude').html(initMapCenter.x.toFixed(3));
    };

    app.updateMousePosition = function(cursorPosition) {
        $('#mapCenterLabel').css('display', 'none');
        if (cursorPosition.mapPoint !== null) {
            var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
            $('#latitude').html(geographicMapPt.y.toFixed(3));
            $('#longitude').html(geographicMapPt.x.toFixed(3));
        }
    };

    app.updateMapCenter = function(extent) {
        //displays latitude and longitude of map center
        $('#mapCenterLabel').css('display', 'inline');
        var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(extent.getCenter());
        $('#latitude').html(geographicMapCenter.y.toFixed(3));
        $('#longitude').html(geographicMapCenter.x.toFixed(3));
    };

    app.setupDraggableInfoWindow = function() {
        //code for adding draggability to infoWindow. http://www.gavinr.com/2015/04/13/arcgis-javascript-draggable-infowindow/
        if (app.dragInfoWindows === true) {
            var handle = query('.title',app.map.infoWindow.domNode)[0];
            var dnd = new Moveable(app.map.infoWindow.domNode, {
                handle: handle
            });

            // when the infoWindow is moved, hide the arrow:
            on(dnd, 'FirstMove', function() {
                // hide pointer and outerpointer (used depending on where the pointer is shown)
                var arrowNode =  query('.outerPointer',app.map.infoWindow.domNode)[0];
                domClass.add(arrowNode, 'hidden');

                var arrowNode1 =  query('.pointer',app.map.infoWindow.domNode)[0];
                domClass.add(arrowNode1, 'hidden');
            }.bind(this));
        }
    };

    app.executeIdentifyTask = function(evt){
        app.shiftKey = evt.shiftKey;
        console.log(evt);
        var sparrowLayer = app.map.getLayer('SparrowRanking').visibleLayers[0];

        app.identifyParams.layerIds = [sparrowLayer];

        var visLayers = app.map.getLayersVisibleAtScale();
        var i;
        var calibrationId;
        for (i in visLayers){
            if (visLayers[i].id === 'nitroCalibration' && app.map.getLayer('nitroCalibration').visible === true){
                calibrationId = app.map.getLayer('nitroCalibration').visibleLayers[0];
                app.identifyParams.layerIds.push(calibrationId);
            }
            if (visLayers[i].id === 'phosCalibration' && app.map.getLayer('phosCalibration').visible === true){
                calibrationId = app.map.getLayer('phosCalibration').visibleLayers[0];
                app.identifyParams.layerIds.push(calibrationId);
            }
        }

        app.identifyParams.geometry = evt.mapPoint;
        app.identifyParams.mapExtent = app.map.extent;

        //Deferred callback
        var deferred = app.identifyTask.execute(app.identifyParams).addCallback(function(response){
            //if in selection mode and not unselecting, highlight shape and add to array of chosen shapes
            if (app.clickSelectionActive) {
                $.each(response, function(i, respObj){
                    var feature = respObj.feature;
                    var respValue = respObj.displayFieldName == "MRB_ID" ? respObj.value : "'" + respObj.value + "'";

                    if (!app.shiftKey) {
                        //adding
                        var selectedSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]), 1);
                        selectedSymbol.id = respObj.value;
                        feature.setSymbol(selectedSymbol);
                        app.map.graphics.add(feature);

                        //add this to an array of responses to pass to the chart
                        app.userSelectedShapes.push(respValue);
                        //store which displayFieldName they are clicking on (only once)
                        if (app.userSelectedDispFieldName == "") {
                            app.userSelectedDispFieldName = respObj.displayFieldName;
                        }
                    } else {
                        //removing
                        var symbolToRemove = app.map.graphics.graphics.filter(function (g) { return g.symbol.id == respObj.value})[0];
                        app.map.graphics.remove(symbolToRemove);
                        //remove this from array of responses
                        app.userSelectedShapes.splice(app.userSelectedShapes.indexOf(respValue), 1);
                    }
                });
            } else {
                var calibrationInfoWindow = false;
                app.map.graphics.clear();
                //check response length to make sure a feature was clicked  (handles Layerdefs automatically)
                if (response.length >= 1) {

                    $.each(response, function(index, responseObj){
                        //UPDATE important! -- make sure that layerIds in 'if' statements below match calibration sites layers in the REST services.
                        //Phosphorus Calibration Site InfoWindow
                        if (responseObj.layerId === 18){
                            var model = 'Phosphorus';
                            var calibrationTemplate = new esri.InfoTemplate();
                            calibrationTemplate.setTitle('SPARROW ' + model + ' Calibration Site');
                            //UPDATE important! make sure the field names match what is in the REST layer
                            calibrationTemplate.setContent('<div><b>Station Name:</b> ' + responseObj.feature.attributes.NAME + '</div><br>' +
                                                            '<div><b>Station ID:</b> </b>' + responseObj.feature.attributes.STATION_ID + '</div><br>' +
                                                            '<div><b>SPARROW Reach ID: </b>' + responseObj.feature.attributes.MRB_ID + '</div><br>'+
                                                            '<div><b>Fluxmaster Load' + chartUnits +': </b>' + responseObj.feature.attributes.FLUXMASTER + '</div><br>' +
                                                            '<div><b>SPARROW Estimated Load ' + chartUnits +': </b>' + responseObj.feature.attributes.SPARROW_ES + '</div><br>');

                            var graphic = new Graphic();
                            var feature = graphic;
                            responseObj.feature.setInfoTemplate(calibrationTemplate);
                            app.map.infoWindow.setFeatures([responseObj.feature]);
                            app.map.infoWindow.show(evt.mapPoint);
                            calibrationInfoWindow = true;
                        }

                        //UPDATE important! -- make sure that layerIds in 'if' statements below match calibration sites layers in the REST services
                        //Nitrogen Calibration Site InfoWindow
                        if (responseObj.layerId === 19){
                            var modelN = 'Nitrogen';
                            var calibrationTemplateN = new esri.InfoTemplate();
                            calibrationTemplateN.setTitle('SPARROW ' + modelN + ' Calibration Site');
                            //UPDATE important! make sure the field names below match what is in the REST layer
                            calibrationTemplateN.setContent('<div><b>Station Name:</b> ' + responseObj.feature.attributes.NAME + '</div><br>' +
                                                            '<div><b>Station ID:</b> </b>' + responseObj.feature.attributes.STATION_ID + '</div><br>' +
                                                            '<div><b>SPARROW Reach ID: </b>' + responseObj.feature.attributes.MRB_ID + '</div><br>'+
                                                            '<div><b>Fluxmaster Load' + chartUnits +': </b>' + responseObj.feature.attributes.FLUXMASTER + '</div><br>' +
                                                            '<div><b>SPARROW Estimated Load ' + chartUnits +': </b>' + responseObj.feature.attributes.SPARROW_ES + '</div><br>');

                            var graphic = new Graphic();
                            var feature = graphic;
                            responseObj.feature.setInfoTemplate(calibrationTemplateN);
                            app.map.infoWindow.setFeatures([responseObj.feature]);
                            app.map.infoWindow.show(evt.mapPoint);
                            calibrationInfoWindow = true;
                        }
                    });

                    //handle map click for Sparrow Data layer
                    if (calibrationInfoWindow != true){

                        // highlight the first poly clicked
                        var selectedSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]), 1);
                        selectedSymbol.id = response[0].value;
                        response[0].feature.setSymbol(selectedSymbol);
                        app.map.graphics.add(response[0].feature);

                        var fields = getChartOutfields( app.map.getLayer('SparrowRanking').visibleLayers[0] );
                        var attributes = response[0].feature.attributes;
                        var valuePairs = {};

                        //need to wrap value in single quotes for ESRI REST Service query.  BUT ONLY IF THE DISPLAY FIELD IS A STRING!
                        if (response[0].displayFieldName == "MRB_ID"){
                            var chartQueryArg = response[0].displayFieldName + " = " + response[0].value;
                        } else{
                            var chartQueryArg = response[0].displayFieldName + " = " + "'" + response[0].value + "'";
                        }

                        $.each(fields, function(index, obj){
                            console.log(obj.attribute);
                        });
                        //No infoWindow, just call the chart query
                        app.createChartQuery(chartQueryArg);
                    }
                }
            }// end else
        }); //END deferred callback
    } //END executeIdentifyTask();


    app.clearFindGraphics = function clearFindGraphics() {
        app.map.infoWindow.hide();
        app.map.graphics.clear();
    }

    app.createTableQuery = function(){
         $("#resultsTable").empty();

        var tableQueryTask;
        var sparrowLayerId = app.map.getLayer('SparrowRanking').visibleLayers[0];
        if (app.map.getLayer('SparrowRanking').layerDefinitions){
            var whereClause = app.map.getLayer('SparrowRanking').layerDefinitions[sparrowLayerId];
        } else{
            var whereClause = '1=1';
        }

        //add map layer ID to query URL
        var SparrowRankingUrl = serviceBaseURL + sparrowLayerId;

        //setup QueryTask
        tableQueryTask = new esri.tasks.QueryTask(SparrowRankingUrl);

        //setup esri query
        var tableQuery = new esri.tasks.Query();
        tableQuery.returnGeometry = false;
        //tableQuery.outFields = outfieldsArr;
        tableQuery.outFields = ['*'];
        tableQuery.where = whereClause;

        //tableQueryTask.execute(tableQuery, buildTable);

    }//END createTableQuery()

    app.createChartQuery = function(optionalWhereClause){
        $('#chartContainer').empty();
        console.log('creating chart query');
        var chartQueryTask;
        var sparrowLayerId = app.map.getLayer('SparrowRanking').visibleLayers[0];

        if (optionalWhereClause == undefined){
            if (app.map.getLayer('SparrowRanking').layerDefinitions){
                var whereClause = app.map.getLayer('SparrowRanking').layerDefinitions[sparrowLayerId];
            } else{
                var whereClause = '1=1';
            }
        } else{
            var whereClause = optionalWhereClause;
        }

        //add map layer ID to query URL
        var SparrowRankingUrl = serviceBaseURL + sparrowLayerId;

        //setup QueryTask
        chartQueryTask = new esri.tasks.QueryTask(SparrowRankingUrl);

        //Returns chartOutfields Object form config --i.e. {attribute: "VALUE", label: "VALUE"}
        var chartFieldsObj = getChartOutfields(sparrowLayerId);

        //grab attributes from chartOutfields object
        var outfieldsArr = [];
        $.each(chartFieldsObj, function(index, obj){
            outfieldsArr.push( obj.attribute ); //get attribute value ONLY
        });

        //setup esri query
        var chartQuery = new esri.tasks.Query();
        chartQuery.returnGeometry = false;
        chartQuery.outFields = getExtraOutfields(outfieldsArr, sparrowLayerId);
        chartQuery.where = whereClause;

        chartQueryTask.execute(chartQuery, showChart);
    }//END app.createChartQuery


   // used several times to get the configuration object needed to perform operation
    app.getLayerConfigObject = function(sparrowLayerId) {
        var configObject = (function(tempLayerId) {
            switch(tempLayerId) {
                /////BEGIN PHOSPHORUS LAYERS___________________________________________________________
                case 0: return Catchments; // catchments
                case 1: return Group3; // HUC8
                case 2: return Group2; // Trib
                case 3: return Group1; // Main River Bains
                case 4: return ST; // State
                case 5: return Catchments_st; // cats w/ state divisions
                case 6: return Group3_st; // grp3 w/ state divisions
                case 7: return Group2_st; // grp2 w/ state divisions
                case 8: return Group1_st; // grp1 w/ state divisions
                /////END PHOSPHORUS LAYERS___________________________________________________________
                /////BEGIN NITROGEN LAYERS___________________________________________________________
                case 9: return Catchments_tn; // Nitro catchments
                case 10: return Group3_tn; // HUC8
                case 11: return Group2_tn; // Trib
                case 12: return Group1_tn; // Main River Bains
                case 13: return ST_tn; // State
                case 14: return Catchments_st_tn; // cats w/ state divisions
                case 15: return Group3_st_tn; // grp3 w/ state divisions
                case 16: return Group2_st_tn; // grp2 w/ state divisions
                case 17: return Group1_st_tn; // grp1 w/ state divisions
                /////END NITROGEN LAYERS___________________________________________________________
            }
        })(sparrowLayerId);

        return configObject;
    }


    function setupQueryTask(url, outFieldsArr, whereClause){
        var queryTask;
        queryTask = new esri.tasks.QueryTask(url);

        var query = new esri.tasks.Query();
        query.returnGeometry = false;
        query.outFields = outFieldsArr;
        query.where = whereClause;
        //used to add custom field descriptions to HUC8 select
        /*if(url == serviceBaseURL + "1"){
            queryTask.execute(query, populateGrp2Arr);
        }else{
            queryTask.execute(query, populateAOI);
        }*/

         queryTask.execute(query, populateAOI);

    }

    //WHEN UPDATING APP: check strings, especially ST
    //Populates AOI Selects on app INIT
    function populateGrp2Arr(response){

        $.each(response.features, function(index, feature){
            Grp2NamDescArr.push(feature.attributes);
        });
    }

    function populateAOI(response){

        $.each(response.features, function(index, feature){

            AllAOIOptions.push(feature.attributes);
        });

        defaultAOIOptions();
    }

    function defaultAOIOptions(){

        //IF options already exist, be sure to REMOVE OLD OPTIONS before calling this function

        // get UNIQUE options from AllAOIOptions global Object
        var grp3Options = getUniqueArray(AllAOIOptions, 'GP3');
        var grp2Options = getUniqueArray(AllAOIOptions, 'GP2');
        var grp1Options = getUniqueArray(AllAOIOptions, 'GP1');
        var STOptions = getUniqueArray(AllAOIOptions, 'ST');

        $.each(grp3Options, function(index, option){
            if (option != " "){
                $('#grp3-select').append(new Option(option));
            }
        });
        $.each(grp2Options, function(index, option){
            if (option != " "){
                $('#grp2-select').append(new Option(option));
            }
        });
        $.each(grp1Options, function(index, option){
            if (option != " "){
                $('#grp1-select').append(new Option(option));
            }
        });
        $.each(STOptions, function(index, option){
            $('#st-select').append(new Option(option));
        });

        $('#grp3-select').selectpicker('refresh');
        $('#grp2-select').selectpicker('refresh');
        $('#grp1-select').selectpicker('refresh');
        $('#st-select').selectpicker('refresh');

    }

    // Symbols
    var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24);

    var selectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
        new Color([255, 0, 0]), 2), new Color([255,255, 0, 0.5]));


    // Optionally confine search to map extent
    function setSearchExtent (){
        if (dom.byId('chkExtent').checked === 1) {
            geocoder.activeGeocoder.searchExtent = app.map.extent;
        } else {
            geocoder.activeGeocoder.searchExtent = null;
        }
    }
    function geosearch() {
        setSearchExtent();
        var def = geocoder.find();
        def.then(function (res){
            geocodeResults(res);
        });
        // Close modal
        $('#geosearchModal').modal('hide');
    }
    function geocodeSelect(item) {
        app.clearFindGraphics();
        var g = (item.graphic ? item.graphic : item.result.feature);
        g.setSymbol(sym);
    }
    function geocodeResults(places) {
        places = places.results;
        if (places.length > 0) {
            app.clearFindGraphics();
            var symbol = sym;
            // Create and add graphics with pop-ups
            for (var i = 0; i < places.length; i++) {
                //addPlaceGraphic(places[i], symbol);
            }
            //zoomToPlaces(places);
            var centerPoint = new Point(places[0].feature.geometry);
            app.map.centerAndZoom(centerPoint, 17);
            //map.setLevel(15);

        } else {
            //alert('Sorry, address or place not found.');  // TODO
        }
    }
    function stripTitle(title) {
        var i = title.indexOf(',');
        if (i > 0) {
            title = title.substring(0,i);
        }
        return title;
    }
    function addPlaceGraphic(item,symbol)  {
        var place = {};
        var attributes,infoTemplate,pt,graphic;
        pt = item.feature.geometry;
        place.address = item.name;
        place.score = item.feature.attributes.Score;
        // Graphic components
        attributes = { address:stripTitle(place.address), score:place.score, lat:pt.getLatitude().toFixed(2), lon:pt.getLongitude().toFixed(2) };
        infoTemplate = new PopupTemplate({title:'{address}', description: 'Latitude: {lat}<br/>Longitude: {lon}'});
        graphic = new Graphic(pt,symbol,attributes,infoTemplate);
        // Add to map
        app.map.graphics.add(graphic);
    }

    function zoomToPlaces(places) {
        var multiPoint = new Multipoint(app.map.spatialReference);
        for (var i = 0; i < places.length; i++) {
            multiPoint.addPoint(places[i].feature.geometry);
        }
        app.map.setExtent(multiPoint.getExtent().expand(2.0));
    }

    function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
        return new PictureMarkerSymbol(
            {
                'angle': 0,
                'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                'url': url,
                'contentType': 'image/png',
                'width':xWidth, 'height': yHeight
            });
    }
    function clone(obj) {
        var copy;
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                {
                    copy[attr] = clone(obj[attr]);
                }
            }
            return copy;
        }
    }


    // called 3 times from highcharts mouseover, selection, and click
    //UPDATE IMPORTANT!
    function switchWhereField(selectedIndex){
        switch (selectedIndex){
            case 0:
                if( $('#st-select')[0].selectedIndex > 0){
                    return 'ST_MRB_ID';
                }else{
                    return 'MRB_ID';
                }
            case 1:
                if( $('#st-select')[0].selectedIndex > 0){
                    return 'SG3';
                }else{
                    return 'GP3';
                }
            case 2:
                if( $('#st-select')[0].selectedIndex > 0){
                    return 'SG2';
                }else{
                    return 'GP2';
                }
            case 3:
                if( $('#st-select')[0].selectedIndex > 0){
                    return 'SG1';
                }else{
                    return 'GP1';
                }
            case 4:
                return 'ST';
        }
    }

    function showChart(response){

        var columnLabels = [];
        var chartTitle;
        var categories = [];
        var chartArr = [];
        var series = [];
        var featureSort = [];
        var tableFeatures = [];

        $.each(response.features, function(index, feature){
            // first push these into a separate array for table to use
            tableFeatures.push($.extend(true, {}, feature.attributes));
            /***this function removes any fields ending with "AREA" from the response.features Object. (i.e. DEMIAREA, DEMTAREA, GP1_AREA, etc.)
            The chart was not built to accommodate the extra area fields, but they're necessary for display in the table.***/
            $.map(Object.keys(feature.attributes), function(val, i){
                //find ANY INDEX that contains "AREA" in the key
                if (val.indexOf("AREA") > -1){
                    delete feature.attributes[val];
                }
            });

            //push the feature attributes AFTER removing all the "AREA" atributes.
            featureSort.push(feature.attributes);
        });
       /* var singleChart = false;
        var checkArr = ["ACCY", "INCY"];
        $.each(checkArr, function(index, val){
            if( featureSort[0].hasOwnProperty(val) ){
                singleChart = true;
            }
        });*/

        var sum = 0;
        $.each(featureSort, function(index, obj){
            $.each(obj, function(i, attribute){
                //don't try to sum up an strings or ID numbers
                //UPDATE important! -- if catchments ID field is returned make sure the correctly named field is in the catch below.
                if(jQuery.type(attribute) !== 'string' && i !== "MRB_ID") { // (dont need this because ST_MRB_ID is a string) || i !== "ST_MRB_ID") ){
                    sum += attribute;
                }
            });
            obj.total = sum;
            tableFeatures[index].total = sum;
            sum = 0;
        });
        featureSort.sort(function(a, b){
            return parseFloat(b.total) - parseFloat(a.total);
        });


       /* if (singleChart === true){
            $.each(featureSort, function(index, obj){
                delete obj.total;
            });
        }*/


        console.log('featureSort', featureSort);

        //create array of field names
        $.each(response.features[0].attributes, function(key, value){
            categories.push(key);
        });

        categories.pop();

        //create multidimensional array from query response
        $.each(categories, function(index, value){
            var data = [];
            $.each(featureSort, function(innerIndex, feature){
                if ($('#groupResultsSelect')[0].selectedIndex == 0) { //catchments only
                    data.push( {y: feature[value], id: feature["MRB_ID"] || feature["ST_MRB_ID"]}); // TMR ADDED
                } else {
                    data.push( feature[value] );
                }
            });
            chartArr.push(data);
        });

        if ($('#groupResultsSelect')[0].selectedIndex == 0) {
            chartArr.pop(); // remove the last array of MRB_IDs  // TMR ADDED
        }
        //remove 1st field ('group by') from charting arrays
        categories.shift();
        $.each(chartArr.shift(), function(key, value) {  // TMR ADDED
            // check to see if catchments, this will be an object otherwise it will be array
            value.y !== undefined ? columnLabels.push(value.y) : columnLabels.push(value);
        });  //removes AND returns column labels ( chartArr[0] )

       //get chartOutfields from config --i.e {attribute: "VALUE", label: "value"}
        var sparrowLayerId = app.map.getLayer('SparrowRanking').visibleLayers[0];
        var chartLabelsObj = getChartOutfields(sparrowLayerId);
        var chartLabelsArr = [];
        $.each(chartLabelsObj, function(index, obj){
            chartLabelsArr.push( obj.label ); //get labels ONLY as arr
        });

        // initial table for Table tab
         tableArr = tableFeatures; // featureSort;
         labelArr = [];
         $.each(chartLabelsArr, function(index, value){
            labelArr.push(value);
        });
     //   labelArr.push("Area"); // for all but catchments
        if (sparrowLayerId == 0 || sparrowLayerId == 8) {
            labelArr[0] = "Name";
        }
        buildTable(tableArr, labelArr);

        //removes 'group by' from labels  (MUST MATCH CATEGORIES)
        chartLabelsArr.shift();

        //push label array into series
        $.each(chartLabelsArr, function(index, value){

            series.push( {name: value, turboThreshold: 3000});
        });



        //chartArr is a multi-dimensional array.  Each item in chartArr is an array of series data.
        $.each(chartArr, function(index, value){
            series[index].data = chartArr[index];
        });

         /// SAMPLE DATA FORMAT
        /* var series = [{
            name: 'dl1_ST_sc1',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        },
        {
            name: 'dl1_ST_sc2',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        },
        {
            name: 'dl1_ST_sc3',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        },
        {
            name: 'dl1_ST_sc4',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        },
        {
            name: 'dl1_ST_sc5',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        },
        {
            name: 'dl1_ST_sc6',
            data: [5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3, 5, 3, 4, 7, 2, 5, 3]
        }
        ] */

        //TUPDATE IMPORTANT!  Match labels with #groupResultsSelect indicies
        function labelxSelect(){
            var dropdown = $('#groupResultsSelect')[0].selectedIndex;
            switch ( dropdown ){
                case 0:
                    return 'Catchment ID';
                case 1:
                    return 'HUC8';
                case 2:
                    return 'Tributary';
                case 3:
                    return 'Main River Basin';
                case 4:
                    return 'State';
            }
        }

        //UPDATE IMPORTANT! must match layers in service to Groups in sparrow-config.js
        function labelySelect(){
            var layerId = app.map.getLayer('SparrowRanking').visibleLayers[0];
            var label;

            var configObject = app.getLayerConfigObject(layerId);
            $.each(configObject, function(index, object){
                if (object.field == $('#displayedMetricSelect').val() ){
                    label = object.name;
                }
            });

            return label;
        }


        //START LOBIPANEL-------------------------------------------------------------------------------------------------------
        $('#chartWindowDiv').lobiPanel({
            unpin: false,
            reload: false,
            minimize: false,
            close: false,
            expand: false,
            editTitle: false,
            draggable: true,
            minWidth: 800,
            minHeight: 800,
            maxHeight: 1000

        });

        $('#chartWindowDiv').addClass( 'chartWindowMaximize' );
        $('#chartWindowDiv').removeClass( 'chartWindowMinimize' );
        $('#chartWindowDiv').css('visibility', 'visible');

        //Important! UPDATE if nutrient Models change names.
        if( $('.radio input[type="radio"]:checked')[0].id == 'radio1'){
            $('#chartWindowPanelTitle').text('Phosphorus ' + labelySelect() );
            console.log("Radio One");
        }   else{
            $('#chartWindowPanelTitle').text('Nitrogen ' + labelySelect() );
            console.log("Radio Two");
        }

        if (response.features.length <= 1 || app.customChartClicked){
            $('#chartWindowPanelTitle').append('<br/><div class=""><button type="button" class="btn-blue" id="popupChartButton"><span class="glyphicon glyphicon-signal"></span> Show Full Chart</button></div>');
            //if coming from custom chart button click
            if (app.customChartClicked) {
                app.customChartClicked = false;
            }
        }


        //only create close / minimize if they don't already exist
        if ($('#chartClose').length == 0){
            $('#chartWindowDiv .dropdown').prepend('<div id="chartClose" title="close"><b>X</b></div>');
        }

        //moved this out of exectureIdentifyTask()
        $('#popupChartButton').on('click', function(){
            app.formattedHighlightString = "";
            app.map.graphics.clear();
            app.createChartQuery();
        });
        var instance = $('#chartWindowDiv').data('lobiPanel');
        instance.unpin();
        //getPosition and setPosition will ensure the x is the same as it should be and the y is higher up (not cut off at bottom)
        var xPos =  instance.getPosition().x;
        instance.setPosition(xPos,50);

        $('#chartClose').on('click', function(){
            app.map.graphics.clear();
            app.formattedHighlightString = "";
            $('#chartWindowDiv').css('visibility', 'hidden');
            $('#chartWindowContainer').empty();
            $('#chartWindowPanelTitle').empty();
        });

        //need listener to resize chart
        $('#chartWindowDiv').resize(function() {
            var height = $('#chartWindowDiv').height()
            var width = $('#chartWindowDiv').width()
            $('#chartWindowContainer').highcharts().setSize(width-50, height-105, true);//$('#chartWindowContainer').highcharts().setSize(width-50, height-75, true);
        });


        //END LOBIPANEL-------------------------------------------------------------------------------------------------------
        var colorArr = ( $('.radio input[type="radio"]:checked')[0].id == 'radio1' ? phosColors  : nitroColors );

        var chart = $('#chartWindowContainer').highcharts();

        $(function () {
            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                },
                colors: colorArr
            });
            var buttons = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
            
            $('#chartWindowContainer').highcharts({
                chart: {
                    type: 'column',
                    zoomType: "x",
                    //resetZoomButton: {
                        //theme: {
                        //    display: 'none'
                        //}
                    //},
                    backgroundColor:'rgba(255, 255, 255, 0.45)',
                    events: {
                        selection: function (e) {

                            var categoryArr = []

                            if (e.xAxis){
                                var xAxis = e.xAxis[0]
                                var newArr = [];

                                if(xAxis) {
                                    $.each(this.series, function (i, series) {
                                        $.each(series.points, function (j, point) {
                                            //find data inside max/min selected axes
                                            if ( point.x >= xAxis.min && point.x <= xAxis.max ) {
                                                //check if point.category is already in the array, if not add it
                                                var thisCategory;
                                                thisCategory = $('#groupResultsSelect')[0].selectedIndex == 0 ? point.id : point.category;
                                                if (categoryArr.indexOf(thisCategory) == -1){
                                                    categoryArr.push(thisCategory);
                                                }
                                            }
                                        });
                                    });
                                    filterTable(categoryArr);
                                }
                                console.log(categoryArr);
                            }

                            app.map.graphics.clear();

                            var queryTask;
                            var visibleLayers = app.map.getLayer('SparrowRanking').visibleLayers[0];
                            var URL = app.map.getLayer('SparrowRanking').url;
                            var fieldName = switchWhereField( $('#groupResultsSelect')[0].selectedIndex );
                            queryTask = new esri.tasks.QueryTask(URL + visibleLayers.toString() );
                            var graphicsQuery = new esri.tasks.Query();
                            graphicsQuery.returnGeometry = true; //important!
                            graphicsQuery.outSpatialReference = app.map.spatialReference;  //important!
                            graphicsQuery.outFields = [fieldName];

                            if (e.resetSelection != true) {
                                var categoryStr = "";
                                $.each(categoryArr, function(i, category){

                                    // only MRB_ID is a number, ST_MRB_ID is a string
                                    categoryStr += fieldName == "MRB_ID" ?  + category + ", " : "'" + category + "', ";
                                });
                                var queryStr = categoryStr.slice(0, categoryStr.length - 2);

                                graphicsQuery.where = fieldName + " IN (" + queryStr + ")";
                                queryTask.execute(graphicsQuery, responseHandler);

                                function responseHandler(response){
                                    $.each(app.map.graphics.graphics, function(i, obj){
                                        if (obj.symbol.id == 'zoomhighlight'){
                                            app.map.graphics.remove(obj);
                                        }

                                    });

                                    $.each(response.features, function(i, feature){
                                        var feature = feature;
                                        var selectedSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]), 1);
                                        selectedSymbol.id = 'zoomHighlight'
                                        feature.setSymbol(selectedSymbol);
                                        app.map.graphics.add(feature);
                                    });

                                }
                            } else {
                                if (app.formattedHighlightString) {
                                    // this is a reset from a zoom in on a custom defined chart view
                                    graphicsQuery.where = app.formattedHighlightString;
                                    queryTask.execute(graphicsQuery, responseHandler);

                                    function responseHandler(response){
                                        $.each(app.map.graphics.graphics, function(i, obj){
                                            if (obj.symbol.id == 'zoomhighlight'){
                                                app.map.graphics.remove(obj);
                                            }
                                        });
                                        //var feature, selectedSymbol;
                                        $.each(response.features, function(i, feature){
                                            var feature = feature;
                                            var selectedSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]), 1);
                                            selectedSymbol.id = 'zoomHighlight'
                                            feature.setSymbol(selectedSymbol);
                                            app.map.graphics.add(feature);
                                        });
                                    }
                                }
                                filterTable();
                            }
                        }
                    }
                },
                title:{
                    text: null
                },
                subtitle:{
                    text: null
                },
                exporting:{
                    enabled: true,
                    chartOptions:{
                        chart:{
                            events:{
                                load:function(){
                                    this.chartBackground.attr({ fill: 'rgba(255, 255, 255, 1.0)' });
                                  // this.plotBackground.attr({ fill: 'rgba(255, 255, 255, 1.0)'  });
                                    this.renderer.image('http://wim.usgs.gov/visuals/usgs/usgslogo1.jpg', 2, 2, 50, 30).add();
                                }
                            }
                        }
                    },
                    buttons:{
                        contextButton:{
                            text: "Chart Options",
                            height: 40,
                            symbol: null,
                            align: 'right',
                            menuItems:[
                                {
                                    text: 'Download PNG',
                                    onclick: function() {
                                        this.exportChart({
                                            type: 'PNG'                                            
                                        });
                                    }
                                },                                
                                {
                                    text: 'Download CSV',
                                    onclick: function(){
                                        this.downloadCSV();
                                    }
                                },
                                {
                                    text: 'Download Excel',
                                    onclick: function(){
                                        this.downloadXLS();
                                    }
                                },
                                {
                                    text: 'Change Background Transparency',
                                    onclick: function(){
                                        if(this.chartBackground.element.attributes.fill.value != 'rgba(255, 255, 255, .9)'){
                                            this.chartBackground.attr({
                                                fill: 'rgba(255, 255, 255, .9)'
                                            });
                                        }else{
                                            this.chartBackground.attr({
                                                fill: 'rgba(255, 255, 255, .1)'
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                xAxis: {
                    categories: columnLabels,
                    title: {
                        text: 'Ranked by ' + labelxSelect()
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: labelySelect()
                    },
                    stackLabels: {
                        enabled: false,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'left',
                    x: 10,
                    verticalAlign: 'top',
                    y: 25,
                    floating: false,
                    padding: 5,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false,
                    labelFormatter: function () {
                        var yI = this.name.indexOf(")");
                        var shortName = "";
                        if (yI > -1) shortName = this.name.substring(yI+1);
                        else shortName = this.name;
                        return shortName;
                    }
                },
                tooltip: {
                    formatter: function(){
                        var rank = this.point.index + 1;
                        var percentOfTotal = (this.point.y / this.point.stackTotal) * 100;
                        return '<b>' + labelxSelect() + ': ' + '<b>' + this.point.category  + '</b></b><br/>'
                                + this.series.name + ': ' + '<b>' + this.point.y.toFixed(2) + ' (' + percentOfTotal.toFixed(2) + '%)' + '</b></b><br/>'
                                + labelySelect() + ' Total: ' + '<b>' + this.point.stackTotal.toFixed(2) + '</b></b><br/>'
                                + 'Rank: ' + '<b>' + rank + '</b>';
                    },
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    },
                    series:{
                        point:{
                             events:{
                                mouseOver: function(){


                                    //get everything needed for the query
                                    var category = $('#groupResultsSelect')[0].selectedIndex == 0 ? this.id : this.category;  //refers to the selected chart area
                                    var visibleLayers = app.map.getLayer('SparrowRanking').visibleLayers[0];
                                    var URL = app.map.getLayer('SparrowRanking').url;
                                    var fieldName = switchWhereField( $('#groupResultsSelect')[0].selectedIndex );

                                    var queryTask;
                                    queryTask = new esri.tasks.QueryTask(URL + visibleLayers.toString() );

                                    var graphicsQuery = new esri.tasks.Query();
                                    graphicsQuery.returnGeometry = true; //important!
                                    graphicsQuery.outSpatialReference = app.map.spatialReference;  //important!
                                    graphicsQuery.outFields = [fieldName];

                                    if (fieldName != "MRB_ID"){
                                        graphicsQuery.where = fieldName + "= '" + category + "'";
                                    }else {
                                        //MRB_ID (but ST_MRB_ID is) field is NOT a string!!!
                                        graphicsQuery.where = fieldName + " = " + category;
                                    }

                                    queryTask.execute(graphicsQuery, responseHandler);

                                    function responseHandler(response){
                                        //remove only the mouseover graphic
                                        $.each(app.map.graphics.graphics, function(i, graphic){
                                            if (graphic.symbol.id == undefined){// || graphic.symbol.id !== "zoomHighlight"){
                                                app.map.graphics.remove(graphic);
                                            }
                                        });

                                        var feature = response.features[0];
                                        var selectedSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150,49,37]), 2), new Color([150,49,37, 0.33]) );
                                        feature.setSymbol(selectedSymbol);
                                        app.map.graphics.add(feature);
                                    }
                                },
                                click: function(evt){

                                    var queryField = switchWhereField( $('#groupResultsSelect')[0].selectedIndex );
                                    var thisCategory;
                                    if ($('#groupResultsSelect')[0].selectedIndex == 0) {
                                        thisCategory = this.id;
                                    } else {
                                        thisCategory = this.category;
                                    }

                                    if (queryField != "MRB_ID"){
                                        var queryString = queryField + " = " + "'" + thisCategory + "'";
                                    } else {
                                        //MRB_ID field is NOT a string!!!
                                        var queryString = queryField + " = " + thisCategory ;
                                    }

                                    app.map.graphics.clear();
                                    app.createChartQuery(queryString);
                                }
                            }

                        }

                    }
                },
                credits: {
                    enabled: false
                },
                series: series
            });
            $(".highcharts-button-box").click(function(){
                $.each(app.map.graphics.graphics, function(i, obj){
                    if (obj.symbol.id == 'zoomhighlight'){
                        app.map.graphics.remove(obj);
                    }
                });
            });

            
        }); //END self-invoking highcharts function
        var height = $('#chartWindowDiv').height()
        var width = $('#chartWindowDiv').width()
        $('#chartWindowContainer').highcharts().setSize(width-50, height-105, true);

    } //END ShowChart()

    //function to filter table based on selection in chart
    function filterTable(categories){
        if (categories !== undefined){

            var whichName = switchWhereField($('#groupResultsSelect')[0].selectedIndex);

            var newResponse = [];
            $.each(categories, function(i,c){
                newResponse.push(tableArr.filter(function(t){return t[whichName] == c;})[0]);
            });
            buildTable(newResponse, labelArr);
        } else
            buildTable(tableArr, labelArr);
    }

    //table in lobipanel Table tab (updates everytime chart changes)
    function buildTable(response, headers){
        $("#resultsTable").empty();
        var headerKeyArr = [];
        $('#resultsTable').addClass('hover-highlight');
        $('#resultsTable').append('<thead></thead>');

        $.each(headers, function(h,head){
            var yI = head.indexOf(")");//yield");
            var shortHeader = "";
            if (yI > -1) shortHeader = head.substring(yI+1);//0,yI-1);
            else shortHeader = head;
            headerKeyArr.push(shortHeader);
        });

        // if not sparrowLayer 0 or 8, only add Area, else add other 2 DEM fields headers too
        var selectedLayerId = $('#groupResultsSelect')[0].selectedIndex;
        if (selectedLayerId == 0) {
            //add Basin Area, Upstream Area, and Total
            headerKeyArr.push("Basin Area");
            headerKeyArr.push("Upstream Area");
            headerKeyArr.push("Total");
        } else {
            headerKeyArr.push("Area");
            headerKeyArr.push("Total");
        }

        var htmlHeaderArr =  [];
        htmlHeaderArr.push("<tr>");
        $.each(headerKeyArr, function(index, key){
            console.log(key);
            htmlHeaderArr.push('<th>' + key + '</th>');

        });
        htmlHeaderArr.push("</tr>");

        $('#resultsTable').find( 'thead' ).html(htmlHeaderArr.join(''));

        var htmlArr =[];

        $('#resultsTable').append('<tbody id="tableBody"></tbody>');
        $.each(response, function(rowIndex, feature) {
            var rowI = selectedLayerId == 0 ? feature["MRB_ID"] || feature["ST_MRB_ID"] : rowIndex;

            htmlArr.push("<tr id='row"+rowI+"'>");
            $.each(feature, function(key, value){

                if (key !== "MRB_ID" && key !== "ST_MRB_ID") {
                    htmlArr.push('<td>'+ value +'</td>');
                }

            });

            htmlArr.push("</tr>");
        });
        $('#tableBody').html(htmlArr.join(''));
        $('.tablesorter').trigger("updateAll");
        $('.tablesorter').tablesorter({
            widthFixed: true,
            onRenderHeader: function(){
                var colorArr = ( $('.radio input[type="radio"]:checked')[0].id == 'radio1' ? phosColors : nitroColors );
                if (this.context.cellIndex > 0){
                    //dont want the label column
                    var index = this.context.cellIndex -1;
                    this.append('<div style="background:' + colorArr[index] + ';height: 3px;margin-bottom:2px;"></div>');
                }
            }
        });
    }//END buildTable

    //hover over table row, go highlight region on map
    $(document).on('mouseenter', '#tableBody tr', function(e) {
        var category = $('#groupResultsSelect')[0].selectedIndex == 0 ? e.currentTarget.id.substring(3) : e.currentTarget.cells[0].innerHTML; //this.category;  //refers to the selected chart area
        var visibleLayers = app.map.getLayer('SparrowRanking').visibleLayers[0];
        var URL = app.map.getLayer('SparrowRanking').url;

        var fieldName = switchWhereField($('#groupResultsSelect')[0].selectedIndex);

        var queryTask;
        queryTask = new esri.tasks.QueryTask(URL + visibleLayers.toString() );

        var graphicsQuery = new esri.tasks.Query();
        graphicsQuery.returnGeometry = true; //important!
        graphicsQuery.outSpatialReference = app.map.spatialReference;  //important!
        graphicsQuery.outFields = [fieldName];

        if (fieldName == "MRB_ID"){
            graphicsQuery.where = fieldName + " = " + category;
        } else{
            graphicsQuery.where = fieldName + "= '" + category + "'";
        }

        queryTask.execute(graphicsQuery, responseHandler);

        function responseHandler(response){
            //remove only the mouseover graphic
            $.each(app.map.graphics.graphics, function(i, graphic){
                if (graphic.symbol.id == undefined) {
                    app.map.graphics.remove(graphic);
                }
            });

            var feature = response.features[0];
            var selectedSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150,49,37]), 2), new Color([150,49,37, 0.33]) );
            feature.setSymbol(selectedSymbol);
            app.map.graphics.add(feature);
        }
    });

    function showModal() {
        $('#geosearchModal').modal('show');
    }
    // Geosearch nav menu is selected
    $('#geosearchNav').click(function(){
        showModal();
    });

    function showAboutModal () {
        $('#aboutModal').modal('show');
    }
    $('#aboutNav').click(function(){
        showAboutModal();
    });

    function showUserGuideModal () {
        $('#userGuideModal').modal('show');
    }
    $('#userGuideNav').click(function(){
        showUserGuideModal();
    });

    $('#html').niceScroll();
    $('#sidebar').niceScroll();
    $('#sidebar').scroll(function () {
        $('#sidebar').getNiceScroll().resize();
    });

    function showTableResizeable(){
        app.createTableQuery();
    }

    $('#legendDiv').niceScroll();

    app.maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
    $('#legendElement').css('max-height', app.maxLegendHeight);

    $('#legendCollapse').on('shown.bs.collapse', function () {
        app.maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
        $('#legendElement').css('max-height', app.maxLegendHeight);
        app.maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
        $('#legendDiv').css('max-height', app.maxLegendDivHeight);
    });

    $('#legendCollapse').on('hide.bs.collapse', function () {
        $('#legendElement').css('height', 'initial');
    });

    require([
        'dijit/form/CheckBox'
    ], function(
        CheckBox
    ) {

        $.each(allLayers, function (index,group) {
            //sub-loop over layers within this groupType
            $.each(group.layers, function (layerName,layerDetails) {
                if(layerDetails.wimOptions.layerType === 'agisImage'){
                   var layer = new ArcGISImageServiceLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                } else{
                    var layer = new ArcGISDynamicMapServiceLayer(layerDetails.url, layerDetails.options);
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, layerDetails.options, layerDetails.wimOptions);
                }


            });
        });

        function addLayer(groupHeading, showGroupHeading, layer, layerName, options, wimOptions) {
            //add layer to map
            app.map.addLayer(layer);

            //create layer toggle
            //var button = $('<div align="left" style="cursor: pointer;padding:5px;"><span class="glyphspan glyphicon glyphicon-check"></span>&nbsp;&nbsp;' + layerName + '</div>');
            if (layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.hasZoomto !== undefined && wimOptions.hasZoomto == true) {
                //opacity icon and zoomto icon; button selected
                var button = $('<div class="btn-group-vertical lyrTogDiv" style="cursor: pointer;" > <button id="' + layer.id + '"type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right opacity"></span><span class="glyphicon glyphicon-search pull-right zoomto"></span></button></div>');
            } else if (!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.hasZoomto !== undefined && wimOptions.hasZoomto == true){
                //opacity icon and zoomto icon; button not selected
                var button = $('<div class="btn-group-vertical lyrTogDiv" style="cursor: pointer;" > <button id="' + layer.id + '"type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right opacity"></span><span class="glyphicon glyphicon-search pull-right zoomto"></span></button></div>');
            } else if (layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.hasZoomto !== undefined && wimOptions.hasZoomto == false){
                //opacity icon, NO zoomTo icon
                var button = $('<div class="btn-group-vertical lyrTogDiv" style="cursor: pointer;" > <button id="' + layer.id + '"type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right opacity"></span></button></div>');
            }
            else if (!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.hasZoomto !== undefined && wimOptions.hasZoomto == false){
                //opacity icon, NO zoomTo icon
                var button = $('<div class="btn-group-vertical lyrTogDiv" style="cursor: pointer;" > <button id="' + layer.id + '"type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right opacity"></span></button></div>');
            }
            //click listener for regular
            button.click(function(e) {
                //toggle checkmark
                $(this).find('i.glyphspan').toggleClass('fa-check-square-o fa-square-o');
                $(this).find('button').button('toggle');

                e.preventDefault();
                e.stopPropagation();

                $('#' + camelize(layerName)).toggle();

                //layer toggle
                if (layer.visible) {
                    layer.setVisibility(false);
                    var ids = [];
                    $.each(app.legend.layerInfos, function(i, infos){
                        ids.push(infos.layer.id);
                    });
                    console.log(ids);
                    var index = ids.indexOf(layer.id);
                    
                    if (index > -1){
                        app.legend.layerInfos.splice(index, 1);
                    }
                    app.legend.refresh();
                } else {
                    layer.setVisibility(true);
                    app.legend.layerInfos.push({layer: layer, title: "Land Use"});
                    app.legend.refresh();

                }
            });

            //group heading logic
            if (showGroupHeading) {
                //camelize it for divID
                var groupDivID = camelize(groupHeading);

                //check to see if this group already exists
                if (!$('#' + groupDivID).length) {
                    //if it doesn't add the header
                    var groupDiv = $('<div id="' + groupDivID + '"><div class="alert alert-info" role="alert"><strong>' + groupHeading + '</strong></div></div>');
                    $('#toggle').append(groupDiv);
                }

                //if it does already exist, append to it
                $('#' + groupDivID).append(button);
                //begin opacity slider logic
                if ($('#opacity'+camelize(layerName)).length > 0) {
                    $('#opacity'+camelize(layerName)).hover(function () {
                        $(".opacitySlider").remove();
                        var currOpacity = app.map.getLayer(options.id).opacity;
                        var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                        $('body').append(slider);[0]

                        $('#slider')[0].value = currOpacity*100;
                        $('.opacitySlider').css('left', event.clientX-180);
                        $('.opacitySlider').css('top', event.clientY-50);

                        $('.opacitySlider').mouseleave(function() {
                            $('.opacitySlider').remove();
                        });

                        $('.opacityClose').click(function() {
                            $('.opacitySlider').remove();
                        });

                        $('#slider').change(function(event) {
                            //get the value of the slider with this call
                            var o = ($('#slider')[0].value)/100;
                            console.log("o: " + o);
                            $("#opacityValue").html("Opacity: " + o)
                            app.map.getLayer(options.id).setOpacity(o);
                            //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                            //var e = '#' + $(this).attr('data-wjs-element');
                            //$(e).css('opacity', o)
                        });
                    });
                }
                //end opacity slider logic

                //begin zoomto logic (in progress)
                $(".zoomto").hover(function (event) {

                    $(".zoomDialog").remove();
                    //var layerToChange = this.id.replace("zoom", "");
                    var zoomDialogMarkup = $('<div class="zoomDialog"><label class="zoomClose pull-right">X</label><br><div class="list-group"><a href="#" id="zoomscale" class="list-group-item lgi-zoom zoomscale">Zoom to scale</a> <a id="zoomcenter" href="#" class="list-group-item lgi-zoom zoomcenter">Zoom to center</a><a id="zoomextent" href="#" class="list-group-item lgi-zoom zoomextent">Zoom to extent</a></div></div>');
                    $("body").append(zoomDialogMarkup);

                    $(".zoomDialog").css('left', event.clientX - 80);
                    $(".zoomDialog").css('top', event.clientY - 5);

                    $(".zoomDialog").mouseleave(function () {
                        $(".zoomDialog").remove();
                    });

                    $(".zoomClose").click(function () {
                        $(".zoomDialog").remove();
                    });

                    $('#zoomscale').click(function (e, layerToChange) {
                        //logic to zoom to layer scale
                        var layerMinScale = app.map.getLayer("SparrowRanking").minScale;
                        if (layerMinScale > 0 ){app.map.setScale(layerMinScale);} else {console.log("No minimum scale for layer.")};
                    });

                    $("#zoomcenter").click(function (e, layerToChange) {
                        //logic to zoom to layer center
                        var layerCenter = app.map.getLayer("SparrowRanking").fullExtent.getCenter();
                        //app.map.centerAt(layerCenter);
                        //var dataCenter = new Point(layerCenter, new SpatialReference({wkid: 4326}));
                        var dataCenter = new Point(layerCenter.x, layerCenter.y, new SpatialReference({wkid: 4326}));
                        app.map.centerAt(dataCenter);
                    });

                    if ( $("#zoomextent") ){
                        $("#zoomextent").click(function (e, layerToChange) {
                            //logic to zoom to layer extent
                            var layerExtent = app.map.getLayer("SparrowRanking").fullExtent;
                            var extentProjectParams = new ProjectParameters();
                            extentProjectParams.outSR = new SpatialReference(102100);
                            extentProjectParams.geometries = [layerExtent];
                            geomService.project(extentProjectParams, function (projectedExtentObj) {
                                var projectedExtent = projectedExtentObj[0];
                                map.setExtent(projectedExtent, new SpatialReference({wkid: 102100}));
                            });
                        });

                    }
                });//end zoomto logic
            }
        } //get visible and non visible layer lists
    });//end of require statement containing legend building code
});
