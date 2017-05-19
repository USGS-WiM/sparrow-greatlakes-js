function loadEventHandlers() {

     /*RADIO EVENTS*/
    $('.radio').on('change', function(e){
        var groupBySelectedIndex = $("#groupResultsSelect")[0].selectedIndex;
        var selectedRadio = this.firstElementChild.id;
        
        populateMetricOptions($("#groupResultsSelect")[0].selectedIndex);
        setAggregateGroup(groupBySelectedIndex, selectedRadio);   
        generateRenderer();

        //reflow the chart if it's open
        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            app.createChartQuery();
        }
        
    });
    /*END RADIO EVENTS*/
    
    //UPDATE: important! make sure the file name is updated_____________________________________________________
    $("#phosphorusDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://wim.usgs.gov/sparrowtennessee/downloads/tenn_shapefiles_phosphorus.zip';
    });
    //UPDATE: important! make sure the file name is updated_____________________________________________________
    $("#nitrogenDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://wim.usgs.gov/sparrowtennessee/downloads/tenn_shapefiles_nitrogen.zip';
    });
    
    //moved this out of exectureIdentifyTask()
    $("#popupChartButton").on('click', function(){
        app.createChartQuery();
    });
    /* AOI EVENTS */
    $('.aoiSelect').on('change', AOIChange);

    /* GROUP RESULTS (AGGREGATE LAYER) EVENTS */
    //set initial Displayed Metric options
    $('#groupResultsSelect').on('loaded.bs.select', function(){  
        populateMetricOptions($("#groupResultsSelect")[0].selectedIndex);
        generateRenderer();
    });

    // selector for click individual polygons button and draw square around to select multiple polygons     
    var selectPolygons = $('#clickPolyButton');
    selectPolygons.click(function(){        
        if (app.clickSelectionActive) {
            selectPolygons.removeClass("active");
            $('#shiftNote').remove();
            selectPolygons.html('<span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Select');
            app.map.setMapCursor("auto");
            app.clickSelectionActive = false;
            $("#chartButton").prop("disabled",false);
        } else if (!app.clickSelectionActive) {
            $('#customSelect').append('<div id="shiftNote" style="padding-left: 1em;color: orangered;">Shift+Click to Deselect</div>');
            selectPolygons.addClass("active");
            selectPolygons.html('<i class="glyphicon glyphicon-stop"></i>&nbsp;&nbsp;Stop selecting');
            app.map.setMapCursor("crosshair");
            $("#chartButton").prop("disabled",true);
            app.clickSelectionActive = true;
        }
    });
   
/*  Cant find reference to this in html
    var showCustomChart = $('#customChartButton');
    showCustomChart.click(function() {
        app.formattedHighlightString = app.userSelectedDispFieldName + " IN (" + app.userSelectedShapes.join(",") + ")";
        app.customChartClicked = true;
        console.log("Custom Click: " + app.formattedHighlightString);
        app.createChartQuery(app.formattedHighlightString);
        app.userSelectedDispFieldName = "";
        app.userSelectedShapes = [];
    }); */

   //keep Displayed Metric options in sync 
    $("#groupResultsSelect").on('changed.bs.select', function(e){ 
        app.clearFindGraphics(); 
       
        populateMetricOptions(e.currentTarget.selectedIndex);
        setAggregateGroup( e.currentTarget.selectedIndex, $(".radio input[type='radio']:checked")[0].id );
        generateRenderer();

        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            app.map.graphics.clear();
            app.createChartQuery();
        }        
    });
    /*END GROUP RESULTS (AGGREGATE LAYER) EVENTS */
    
    /*METRIC EVENTS*/
    $("#displayedMetricSelect").on('changed.bs.select', function(e){
        generateRenderer();

        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            app.createChartQuery();
        }
    });
    /*END METRIC EVENTS*/

    /* CLEAR AOI BUTTON EVENT */
    $("#clearAOIButton").on('click', function(){
        var sparrowId = app.map.getLayer('SparrowRanking').visibleLayers[0];
        
        //revert to default layer from split layer
        if( $.inArray(sparrowId, splitLayers) > -1 ){
            sparrowId = returnDefaultLayer( sparrowId, $(".radio input[type='radio']:checked")[0].id );
            var layerArr = [];
            layerArr.push(sparrowId);
            app.map.getLayer('SparrowRanking').setVisibleLayers(layerArr);
            app.map.getLayer('SparrowRanking').setDefaultLayerDefinitions(true); //don't refresh yet.            
        } else {
            app.map.getLayer('SparrowRanking').setDefaultLayerDefinitions(true); //don't refresh yet.          
        }

        //reset the selects
        $('.aoiSelect').selectpicker('val', '');  // 'hack' because selectpicker('deselectAll') method only works when bootstrap-select is open.
        populateMetricOptions($("#groupResultsSelect")[0].selectedIndex);
        //redraw the symbols

        //return to Default AOI options for ALL AOI selects 
        app.clearLayerDefObj();
        generateRenderer();

        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            app.createChartQuery();
        }
        if ($('#tableResizable').is(":visible")){
            app.createTableQuery();
        }
    });
    /*END CLEAR AOI BUTTON EVENT */

    // called from within $('.nonAOISelect').on('change' function several times to append warning and clear contents of AOI when getting set to disabled
    function clearAOIandAppendWarning(warningId, cantShow, fromHere, thisSelect, anAOI){
        // 'grp2-warning', 'Tributary', 'HUC8', '#grp2-select option', 'AOI2');
        $("#clear_btn").append("<a class='" + warningId + "' data-toggle='tooltip' data-placement='top' title='Cannot show " + cantShow + " Area of Interest while grouping by " + fromHere + ".'>"+
                "<span class='glyphicon glyphicon-warning-sign'></span></a>");   
        //has value, so unselect it, clear the app's LayerDefObj of this property & trigger AOIChange event
        $(thisSelect + ' option').attr("selected",false);
        app.clearOneLayerDefObj(anAOI); //clear out this one 
        var newE2 = { currentTarget: {id: thisSelect, value: ""} }; //making an 'e' to pass along
        AOIChange(newE2); //go through the aoichange event to do the rest
    }
    /***TODO UPDATE IMPORTANT! -- THE CASES IN MRB3 ARE CORRECT, BUT THE LOGIC NEEDS TO BE REVISITED TO DETERMINE WHICH AOI COMBINATIONS NEED TO BE DISABLED****/
    $('.nonAOISelect').on('change', function(){
        //first clear all disabled's and warnings                
        $("#grp1-select").removeClass('disabled'); //Main River Basin            
        $("#grp1-select").removeAttr('disabled'); 
        $(".grp1-warning").remove();
        $("#grp2-select").removeClass('disabled'); //Tributary
        $("#grp2-select").removeAttr('disabled'); 
        $(".grp2-warning").remove();
        $("#grp3-select").removeClass('disabled'); //huc8
        $("#grp3-select").removeAttr('disabled'); 
        $(".grp3-warning").remove();
        
        switch($('#groupResultsSelect')[0].selectedIndex) {
            case 0: //Catchment
                // all AOIs enabled
                $('#grp1-select').selectpicker('refresh');
                $('#grp2-select').selectpicker('refresh');
                $('#grp3-select').selectpicker('refresh');
                break;
            case 1: //HUC8
                 /***AOI Logic (Disable Tributary(GP2) & clear value if any) ***/
                 //Tributary
                if (app.getLayerDefObj().AOI2) {
                    clearAOIandAppendWarning('grp2-warning', 'Tributary', 'HUC8', '#grp2-select', 'AOI2');                   
                }
                $("#grp2-select").attr('disabled', 'disabled'); //trib       
                $("#grp2-select").addClass('disabled');
                $('#grp2-select').selectpicker('refresh');
                
                //AOI HUC8(GP3) AND Main River basin(GP1) enabled   
                $('#grp1-select').selectpicker('refresh');
                $('#grp3-select').selectpicker('refresh');
                break;
            case 2: //Tributary
                /***AOI logic (disable HUC8(GP3) & clear value if any) ***/
                //huc8
                if (app.getLayerDefObj().AOI3) {
                    clearAOIandAppendWarning('grp3-warning', 'HUC8', 'Tributary', '#grp3-select', 'AOI3');
                }
                //disable the HUC8 dropdown
                $("#grp3-select").attr('disabled', 'disabled');//huc8
                $("#grp3-select").addClass('disabled');
                $('#grp3-select').selectpicker('refresh');
                
                //AOI Tributary(GP2) AND Main River basin(GP1) enabled 
                $('#grp2-select').selectpicker('refresh');                
                $('#grp1-select').selectpicker('refresh');
                break;
            case 3: //Main River Basin
                /*** AOI logic (disable Tributary(GP2)  AND HUC8(GP3) & clear values if any) ***/
                //Tributary
                if (app.getLayerDefObj().AOI2) {
                    clearAOIandAppendWarning('grp2-warning', 'Tributary', 'Main River Basin', '#grp2-select', 'AOI2');
                }
                $("#grp2-select").attr('disabled', 'disabled'); //Tributary    
                $("#grp2-select").addClass('disabled');
                $('#grp2-select').selectpicker('refresh');

                // AIO Main River Basin (GP1) enabled
                $('#grp1-select').selectpicker('refresh');
                //huc8
                if (app.getLayerDefObj().AOI3) {
                    clearAOIandAppendWarning('grp3-warning', 'HUC8', 'Main River Basin', '#grp3-select', 'AOI3');
                }
                $("#grp3-select").attr('disabled', 'disabled'); //huc8       
                $("#grp3-select").addClass('disabled');
                $('#grp3-select').selectpicker('refresh');
                break;
            case 4: //STATE
                /***AOI logic (disable GP1(Main Riv. Basin) AND GP2(Trib.) AND GP3(HUC8) & clear values if any) ***/
                //Main Riv Basin
                if (app.getLayerDefObj().AOI1) {
                    clearAOIandAppendWarning('grp1-warning', 'Main River Basin', 'State', '#grp1-select', 'AOI1');
                }
                $("#grp1-select").attr('disabled', 'disabled'); //independent watersheds     
                $("#grp1-select").addClass('disabled');
                $('#grp1-select').selectpicker('refresh');
                
                //Tributary
                if (app.getLayerDefObj().AOI2) {
                    clearAOIandAppendWarning('grp2-warning', 'Tributary', 'State', '#grp2-select', 'AOI2');
                }
                $("#grp2-select").attr('disabled', 'disabled'); //huc8       
                $("#grp2-select").addClass('disabled');
                $('#grp2-select').selectpicker('refresh');

                if (app.getLayerDefObj().AOI3) {                    
                    clearAOIandAppendWarning('grp3-warning', 'HUC8', 'State', '#grp3-select', 'AOI3');
                }
                $("#grp3-select").attr('disabled', 'disabled'); //huc8       
                $("#grp3-select").addClass('disabled');
                $('#grp3-select').selectpicker('refresh');
                break;
        }//end switch
    });

    /* SHOW CHART BUTTON CLICK */
   $("#chartButton").on("click", function(){
        //set up the Chart chain of events
        //check to see if custom click was performed
        if (app.userSelectedDispFieldName != "") { 
            app.formattedHighlightString = app.userSelectedDispFieldName + " IN (" + app.userSelectedShapes.join(",") + ")";
            app.customChartClicked = true;
            console.log("Custom Click: " + app.formattedHighlightString);
            app.createChartQuery(app.formattedHighlightString);
            app.userSelectedDispFieldName = "";
            app.userSelectedShapes = [];
        } else {
            app.createChartQuery();  
        }
    });

    //following block forces map size to override problems with default behavior
    $(window).resize(function () {
        if ($("#legendCollapse").hasClass('in')) {
            maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('height', maxLegendHeight);
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);
        }
        else {
            $('#legendElement').css('height', 'initial');
        }
    });

    //displays map scale on map load
    app.map.on('load', function (){
        
        app.initMapScale();
        app.map.infoWindow.set('highlight', false);
        app.map.infoWindow.set('titleInBody', false);

        app.setupDraggableInfoWindow();
        app.map.disableClickRecenter();
    });

    //displays map scale on scale change (i.e. zoom level)
    app.map.on('zoom-end', function (){
        var scale = app.map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
    });

    //updates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes "map center" label
    app.map.on('mouse-move', function (cursorPosition) {
        app.updateMousePosition(cursorPosition);
    });

    //updates lat/lng indicator to map center after pan and shows "map center" label.
    app.map.on("pan-end", function () {
        app.updateMapCenter(app.map.extent);
    });

    //end code for adding draggability to infoWindow
    
    //map click w/ identifyParams  -- more params set in executeIdentifyTask();
    app.map.on("click", function(evt) {
        app.identifyParams = new esri.tasks.IdentifyParameters();
        app.identifyParams.tolerance = 8;
        app.identifyParams.returnGeometry = true;
        app.identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
        app.identifyParams.width  = app.map.width;
        app.identifyParams.height = app.map.height;
        app.identifyTask = new esri.tasks.IdentifyTask(serviceBaseURL); 
        if (app.map.getLayer("SparrowRanking").layerDefinitions){
            app.identifyParams.layerDefinitions = app.map.getLayer("SparrowRanking").layerDefinitions;
        }
        app.executeIdentifyTask(evt);        
    });    

    //on clicks to swap basemap.app.map.removeLayer is required for nat'l map b/c it is not technically a basemap, but a tiled layer.
    $("#btnStreets").on('click', function () {
        app.map.setBasemap('streets');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnSatellite').on('click', function () {
        app.map.setBasemap('satellite');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnHybrid').on('click', function () {
        app.map.setBasemap('hybrid');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnTerrain').on('click', function () {
        app.map.setBasemap('terrain');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnGray').on('click', function () {
        app.map.setBasemap('gray');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnNatGeo').on('click', function () {
        app.map.setBasemap('national-geographic');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnOSM').on('click', function () {
        app.map.setBasemap('osm');
        app.map.removeLayer(nationalMapBasemap);
    });
    $('#btnTopo').on('click', function () {
        app.map.setBasemap('topo');
        app.map.removeLayer(nationalMapBasemap);
    });
}