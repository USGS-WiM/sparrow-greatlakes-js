/**
 * Created by bdraper on 4/27/2015.
 */
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

    //var imageParameters = new ImageParameters();

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
                    "visibleLayers": [16],
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
                    "visibleLayers": [17],
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
            "groupHeading": "Auxilliary Layers",
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "Tennessee Mainstems" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [18],
                    "options": {
                        "id": "mainstems",
                        "opacity": 0.75,
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
                "Tennessee Streams" : {
                    "url": serviceBaseURL,
                    "visibleLayers": [19],
                    "options": {
                        "id": "streams",
                        "visible": false,
                        "opacity": 0.6
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
        }
    ]

});




