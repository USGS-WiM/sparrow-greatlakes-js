/*
_________________Created by emyers 10/2016_____________
*/


$('.selectpicker').selectpicker();

//Change Displayed Metric select options
function populateMetricOptions(selectedIndex){
    var metricOptions;
    if($(".radio input[type='radio']:checked")[0].id == 'radio1'){
        switch (selectedIndex){
            case 0:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Catchments_st; //UPDATE TODO if catchments are split, update to the appropriate object.
                }else{
                    metricOptions = Catchments;
                }
                break;
            case 1:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group3_st;
                }else{
                    metricOptions = Group3;
                }
                break;
            case 2:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group2_st;
                }else{
                    metricOptions = Group2;
                }
                break;
            case 3: 
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group1_st;
                }else{
                    metricOptions = Group1;
                }
                break;
                
            case 4:
                metricOptions = ST;
                break;
        }
    } else if($(".radio input[type='radio']:checked")[0].id == 'radio2'){
        switch (selectedIndex){
            case 0:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Catchments_st_tn;  //UPDATE TODO if catchments are split, update to the appropriate object.
                }else{
                    metricOptions = Catchments_tn;
                }
                break;
            case 1:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group3_st_tn;
                }else{
                    metricOptions = Group3_tn;
                }
                break;
            case 2:
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group2_st_tn;
                }else{
                    metricOptions = Group2_tn;
                }
                break;
            case 3: 
                if( $("#st-select")[0].selectedIndex > 0){
                    metricOptions = Group1_st_tn;
                }else{
                    metricOptions = Group1_tn;
                }
                break;
            case 4:
                metricOptions = ST_tn;
                break;
        }
    }
    
    $("#displayedMetricSelect").find('option').remove();
    $.each(metricOptions, function(index, value){
        $("#displayedMetricSelect").append(new Option(value.name, value.field));
        $('#displayedMetricSelect').selectpicker('refresh');
    });

} // END populateMetricOptions


//used when clearing the AOI
function returnDefaultLayer(sparrowId){
    switch (sparrowId){
        case 5:
            return 0;        
        case 6:
            return 1;
        case 7:     
            return 2;
        case 8:
            return 3;
        case 14:
            return 9;
        case 15:
            return 10;
        case 16:     
            return 11;
        case 17:     
            return 12;
    }
}


//uses the #groupResultsSelect selected value and Selected radio to define the SparrowRanking display layer.
function setAggregateGroup(groupBySelectedIndex, selectedRadio){

    if (selectedRadio == 'radio1'){
        var layerArrayValue;
        switch (groupBySelectedIndex){
            case 0:
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 5; //TODO UPDATE AddCatchments with splits if they become available?
                } else{
                    layerArrayValue = 0;
                }
                break;
            case 1:
            
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 6; //grp3 w/ state splits
                } else{
                    layerArrayValue = 1;
                }
                
                break;
            case 2: 
                 if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 7;    //grp2 w/state splits
                } else{
                    layerArrayValue = 2;
                }
                break;
            case 3:
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 8;    //grp1 w/state splits
                } else{
                    layerArrayValue = 3;
                }
                break;
            case 4:
                layerArrayValue = 4;
                break;
        }
    } else if (selectedRadio == 'radio2'){
        //UPDATE TODO impoartant! verify layerIDs here when Nitrogen Layers become available!!!!!
        var layerArrayValue;
        switch (groupBySelectedIndex){
            case 0:
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 14; //TODO UPDATE AddCatchments with splits if they become available?
                } else{
                    layerArrayValue = 9;
                }
                break;
            case 1:
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 15; //grp3 w/ state splits
                } else{
                    layerArrayValue = 10;
                }
                break;
            case 2: 
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 16; //grp2 w/ state splits
                } else{
                    layerArrayValue = 11;
                }
                break;
            case 3: 
                if( $("#st-select")[0].selectedIndex > 0){
                    layerArrayValue = 17; //grp1 w/ state splits
                } else{
                    layerArrayValue = 12;
                }
                break;
            case 4:
                layerArrayValue = 13;
                break;
        }
    }
    var visibleLayerIds = [layerArrayValue];
    var sparrowRanking = app.map.getLayer('SparrowRanking');
    sparrowRanking.setVisibleLayers(visibleLayerIds);


    //generateRenderer();
        
    
} //END setAggregateGroup()

function AOIChange(e){
    
    var selectId = e.currentTarget.id;
    var selectValue = e.currentTarget.value;
    var groupResultsIndex = $("#groupResultsSelect")[0].selectedIndex;
    

    var newObj = {
        selectedId: selectId,
        selectedValue: selectValue
    }
    
    if (selectId == "st-select" && groupResultsIndex != 4) {
        //if not already on a state split layer, set one now.
        //TODO: figure out how you can access the current layers to see if you're on a split layer.  
        //if(app.map.getLayer('SparrowRanking').visibleLayers[0]){
            populateMetricOptions($("#groupResultsSelect")[0].selectedIndex);
            setAggregateGroup( groupResultsIndex, $(".radio input[type='radio']:checked")[0].id );
    }

    //only update if there's a value to update to (clearing selected values depending on Group Results by selections)
    if (newObj.selectedValue != ""){
        app.setLayerDefObj(newObj);
    }

    setLayerDefs();    

    generateRenderer();

    if( $("#chartWindowDiv").css("visibility") == "visible" ) {
        app.map.graphics.clear();
        app.createChartQuery();
    }

    //rebuild the table if open
        if ($('#tableResizable').is(":visible")){
            app.createTableQuery();
        }

} //END AOIChange()


function setLayerDefs(){
        var definitionString = "";
        var layerDefObj = app.getLayerDefObj();
        
        if (layerDefObj.AOIST){
            if(definitionString != ""){
                definitionString += " AND ST = "+ "'" + layerDefObj.AOIST + "'";
            } else{
               definitionString += "ST = "+ "'" + layerDefObj.AOIST + "'"; 
            }
        }
        if (layerDefObj.AOI1){
            if(definitionString != ""){
                definitionString += " AND GP1 = "+ "'" + layerDefObj.AOI1 + "'";
            }else{
                definitionString += "GP1 = "+ "'" + layerDefObj.AOI1 + "'";
            }
            
        }
        if (layerDefObj.AOI2){
            if(definitionString != ""){
               definitionString += " AND GP2 = "+ "'" + layerDefObj.AOI2 + "'";
            }else{
                definitionString += "GP2 = "+ "'" + layerDefObj.AOI2 + "'";
            }
        }
        /***TODO UPDATE IMPORTANT -- ADDED BUT NOT ***/
        if (layerDefObj.AOI3){
            if(definitionString != ""){
               definitionString += " AND GP3 = "+ "'" + layerDefObj.AOI3 + "'";
            }else{
                definitionString += "GP3 = "+ "'" + layerDefObj.AOI3 + "'";
            }
        }
        
        var layerDefs = [];

        //LayerDefs on ALL Layers
        /***TODO UPDATE IMPORTANT -- note that not all of these layer combinations are going to work with the attributes we have currently.  Some layer defs will not set because the fields don't exist***/
        layerDefs[0] = definitionString; 
        layerDefs[1] = definitionString; 
        layerDefs[2] = definitionString; 
        layerDefs[3] = definitionString; 
        layerDefs[4] = definitionString; 
        layerDefs[5] = definitionString; 
        layerDefs[6] = definitionString; 
        layerDefs[7] = definitionString; 
        layerDefs[8] = definitionString;
        
        layerDefs[9] = definitionString;
        layerDefs[10] = definitionString;
        layerDefs[11] = definitionString;
        layerDefs[12] = definitionString;
        layerDefs[13] = definitionString;
        layerDefs[14] = definitionString;
        layerDefs[15] = definitionString;
        layerDefs[16] = definitionString;
        layerDefs[17] = definitionString;


        app.map.getLayer("SparrowRanking").setLayerDefinitions(layerDefs);

} // END setLayerDefs()


function getTableFields(headerKeysArr, sparrowLayerId){
    var label = "";
    var flatArr = [];
    var htmlHeaderArr = [];
    var configArr = [];
    var removeField = "";
    switch(sparrowLayerId){
        case 0:
            configArr = Group3;
            removeField = "GP3";
            $.each(tableOutFields, function(i,object){
                flatArr.push(object);
            });
            break;
        case 4:
            configArr = Group3_st;
            removeField = "SG3";
            $.each(stateTableOutFields, function(i,object){
                flatArr.push(object);
            });
            break;
        case 7:
            configArr = Group3_tn;
             removeField = "GP3"
             $.each(tableOutFields, function(i,object){
                flatArr.push(object);
            });
            break;
        case 11:
            configArr = Group3_st_tn;
            removeField = "SG3";
            $.each(stateTableOutFields, function(i,object){
                flatArr.push(object);
            });
            break;
    }

    
    $.each(configArr, function(index, item){
        flatArr.push({field: item.field, name: item.name});
        $.each(item.chartOutfields, function(i, fields){
            if (fields.attribute == removeField && (flatArr.map(function (f) { return f.field }).indexOf(removeField) < 0)) {// $.inArray(fields.attribute, flatArr) < 0) {
                flatArr.push({field: fields.attribute, name: fields.label});
            } else if (fields.attribute != removeField) {
                flatArr.push({field:fields.attribute, name:fields.label});
            }
        });  
    });

    htmlHeaderArr.push("<tr>");
    $.each(headerKeysArr, function(index, key){
        console.log(key);
        $.each(flatArr, function(index, obj){
            if(key == obj.field){
                console.log(obj.field);
                htmlHeaderArr.push('<th>' + obj.name + '</th>');
                return false; //escape the each loop?
            }
        });
    });
    htmlHeaderArr.push("</tr>");
    return htmlHeaderArr.join('');
}

// used several times to get the configuration object needed to perform operation
function getLayerConfigObject(sparrowLayerId) {
    var iterateThruThis = (function(tempSparrowLayerId) {
        switch(tempSparrowLayerId) {
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

    return iterateThruThis;
}

function getLegendLabels(sparrowLayerId){
    var label = "";
    var configObject = getLayerConfigObject(sparrowLayerId);

    $.each(configObject, function(index, item){
        if( $("#displayedMetricSelect").val() == item.field ) {
            label = item.name;
        }
    });
    return label;

} //END getLegendLabels()

function getChartOutfields(sparrowLayerId){
    var chartFieldsArr = [];
    console.log("in GetChartOutfields()")
    var configObject = getLayerConfigObject(sparrowLayerId);
    $.each(configObject, function(index, item){
        if( $("#displayedMetricSelect").val() == item.field ) {
                $.each(item.chartOutfields, function(i, fields) {
                chartFieldsArr.push( fields );

            });
        }
    });
    return chartFieldsArr;
} //END getLegendLabels()

function getExtraOutfields(outfieldsArr, sparrowLayerId){
    var finalChartArr = outfieldsArr;

    switch(sparrowLayerId){
        /////BEGIN PHOSPHORUS LAYERS___________________________________________________________
        case 0: case 9: 
            //CATCHMENTS
            //finalChartArr.push("PNAME");
            finalChartArr.push("DEMIAREA");
            finalChartArr.push("DEMTAREA");
            finalChartArr.push("MRB_ID"); // ADDED TMR
            
            break;
        case 1: case 10:
            //HUC8 
            finalChartArr.push("GP3_AREA");
            
            break;
        case 2: case 11:
            //Tributarys
            finalChartArr.push("GP2_AREA");
            
            break;
        case 3: case 12:
            //Independent Watershed
             finalChartArr.push("GP1_AREA");

            break;
        case 4: case 13:
            //State
            finalChartArr.push("ST_AREA");

            break;
        case 5: case 14:
            //Catchments w/ state divisions
            finalChartArr.push("STDEMIAREA");
            finalChartArr.push("STDEMTAREA");
            finalChartArr.push("ST_MRB_ID"); // ADDED TMR
            break;
        case 6: case 15:
            //grp3 w/ state divisions
            finalChartArr.push("SG3_AREA");

            break;
        case 7: case 16:
            //grp 2 w/ state divisions
            finalChartArr.push("SG2_AREA");

            break;
        case 8: case 17:
            //grp1 w/ state divisions
            finalChartArr.push("SG1_AREA");

            break;
    }

    return finalChartArr;
}


function generateRenderer(){
        require([
        'esri/map',
        'esri/Color',
        "esri/dijit/Legend",
        "esri/layers/LayerDrawingOptions",
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/tasks/ClassBreaksDefinition',
        'esri/tasks/AlgorithmicColorRamp',
        'esri/tasks/GenerateRendererParameters',
        'esri/tasks/GenerateRendererTask',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/on',
        'dojo/domReady!'
    ], function (
        Map,
        Color,
        Legend,
        LayerDrawingOptions,
        SimpleLineSymbol,
        SimpleFillSymbol,        
        ClassBreaksDefinition,
        AlgorithmicColorRamp,
        GenerateRendererParameters,
        GenerateRendererTask,
        dom,
        domClass,
        on
    ) {

        var sparrowId = app.map.getLayer('SparrowRanking').visibleLayers[0];
        //apply layer defs to renderer if they exist
        if(app.map.getLayer('SparrowRanking').layerDefinitions){
            var dynamicLayerDefs = app.map.getLayer('SparrowRanking').layerDefinitions[sparrowId];
            app.layerDef = dynamicLayerDefs;
        }
        else{
            app.map.getLayer('SparrowRanking').setDefaultLayerDefinitions(); //is this necessary?
            app.layerDef = "1=1";
        }
        
        //UPDATE important!  url must match service url ---- note maybe move to config file?
        app.Url = "https://gis.wim.usgs.gov/arcgis/rest/services/SparrowGreatLakesV2/SparrowGreatLakes/MapServer/" + sparrowId;
        
        var selectedMetric = $('#displayedMetricSelect')[0].value;
        //var selectedMetric = "ST_AL";
        app.outFields = [selectedMetric];
        app.currentAttribute = selectedMetric; 
        var classDef = new ClassBreaksDefinition();
        classDef.classificationField = app.currentAttribute;
        classDef.classificationMethod = "quantile";
        classDef.breakCount = 5;


        classDef.baseSymbol = new SimpleFillSymbol("solid", null, null);
        //not sure about this one, needs a little work to get the borders right.
        /*classDef.baseSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([168,168,168, 0.1]))
                );
        */
          
        var colorRamp = new AlgorithmicColorRamp();
        //different ramps for phos/nitro
        if( $(".radio input[type='radio']:checked")[0].id == "radio1" ){
            //phos = brown
            colorRamp.fromColor = new Color.fromHex("#FFF1DC");
            colorRamp.toColor = new Color.fromHex("#632E0E");
        } else{
            //nitro = green
            colorRamp.fromColor = new Color.fromHex("#F5EBB8");
            colorRamp.toColor = new Color.fromHex("#004120");
        }
          
        colorRamp.algorithm = "hsv"; // options are:  "cie-lab", "hsv", "lab-lch"
        classDef.colorRamp = colorRamp;

        var params = new GenerateRendererParameters();
        params.classificationDefinition = classDef;
        // limit the renderer to data being shown by the current layer
        params.formatLabel = false; //formatLabel = false otherwise expect some bad behavior from the renderer!
        params.where = app.layerDef; 
        var generateRenderer = new GenerateRendererTask(app.Url);
        generateRenderer.execute(params, applyRenderer, errorHandler);


        function applyRenderer(renderer){
            var sparrowId = app.map.getLayer('SparrowRanking').visibleLayers[0];
            var layer = app.map.getLayer('SparrowRanking');
            //layer.hide();


            // dynamic layer stuff
              var optionsArray = [];
              var drawingOptions = new LayerDrawingOptions();
              drawingOptions.renderer = renderer;
              // set the drawing options for the relevant layer
              // optionsArray index corresponds to layer index in the map service
              optionsArray[sparrowId] = drawingOptions;

              layer.setLayerDrawingOptions(optionsArray);

              if (! app.hasOwnProperty("legend")){
                createLegend();
              } else{
                app.legend.refresh([{
                    layer: app.map.getLayer("SparrowRanking"),
                    title : getLegendLabels( app.map.getLayer('SparrowRanking').visibleLayers[0] )
                }]);
              }
              if(layer.visible == false){
               layer.show();
              }
              

        }

        function errorHandler(err){
            console.log('generateRenderer Err ', err);
        }

        function createLegend(){
            app.legend = new Legend({
                map : app.map, 
                layerInfos : [{
                    layer: app.map.getLayer("SparrowRanking"),
                    title: getLegendLabels( app.map.getLayer('SparrowRanking').visibleLayers[0] )
                }]
            }, dom.byId("legendDiv"));
            app.legend.startup();
            
        }

    }); // END Dojo

} //END generateRenderer()