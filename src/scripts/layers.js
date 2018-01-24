/**
 * Created by bdraper on 4/27/2015.
 */

 /**UPDATE impoartant! -- when updating to a new application, make sure that all visiblelayer Ids match the corresponding REST service layer.
    Also make sure that titles are appropriate
 **/
var allLayers;

require([
    "esri/geometry/Extent",
    "esri/layers/WMSLayerInfo",
    "esri/layers/FeatureLayer",
    "esri/layers/ImageParameters",
    'dojo/domReady!'
], function(
    Extent,
    WMSLayerInfo,
    FeatureLayer,
    ImageParameters
) {

    var sparrowOverlay;
    if ($("#radio1")[0].checked == true){
        sparrowOverlay = 0;
    } else{
        sparrowOverlay = 1;
    }



    allLayers = [
        {
            "groupHeading": "Nutrient Model",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Nutrient Model Results Overlay":{
                    "url" : serviceBaseURL,
                    "visibleLayers": [sparrowOverlay],
                    "options":{
                        "id": "SparrowRanking",

                        "opacity": 0.75,
                        "visible": true
                    },
                    "wimOptions":{
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto" : false,
                        "includeLegend" : false
                    }
                }
            }    
        },
        {
            "groupHeading": "Model Calibration Sites",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Phosphorus Calibration Sites" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [18],
                    "options": {
                        "id": "phosCalibration",
                        "opacity": 0.85,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "zoomScale": 144448,
                        "hasOpacitySlider": true,
                        "hasZoomto" : false,
                        "includeLegend" : true
                    }
                },
                "Nitrogen Calibration Sites" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [19],
                    "options": {
                        "id": "nitroCalibration",
                        "visible": false,
                        "opacity": 0.85
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": false,
                        "includeLegend" : false
                    }
                }
            }
        },
        {
            "groupHeading": "Auxiliary Layers",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Great Lakes Streams" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [20],
                    "options": {
                        "id": "streams",
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": false,
                        "includeLegend" : false
                    }
                },
                "Great Lakes SPARROW Model Area" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [21],
                    "options": {
                        "id": "modelArea",
                        "visible": true,
                        "opacity": 0.35
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": false,
                        "includeLegend" : false
                    }
                },
                "Land Use 2002": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu2002_100515_test/ImageServer",
                    "options": {
                        "id": "lu2002",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "hasZoomto": false,
                        "includeLegend": false
                    }
                }
            }
        }
    ]

});




