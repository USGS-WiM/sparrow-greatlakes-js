    function showChart(response){

        var columnLabels = [];
        var chartTitle;
        var categories = [];
        var chartArr = [];
        var series = [];
        var featureSort = [];

        $.each(response.features, function(index, feature){
            featureSort.push(feature.attributes);
        });

        var sum = 0;
        $.each(featureSort, function(index, obj){
            $.each(obj, function(i, attribute){
                if(jQuery.type(attribute) !== "string"){
                    sum += attribute;
                }
            });
            obj.total = sum;
            sum = 0;
        });
        featureSort.sort(function(a, b){
            return parseFloat(b.total) - parseFloat(a.total);
        });
        
        console.log("featureSort", featureSort);

        //create array of field names
        $.each(response.features[0].attributes, function(key, value){
            categories.push(key);
        });

        categories.pop();


        //create multidimensional array from query response
        $.each(categories, function(index, value){  
            var data = [];
            $.each(featureSort, function(innerIndex, feature){
                data.push( feature[value] );
            });
            chartArr.push(data);
        });

        //remove 1st field ('group by') from charting arrays
        categories.shift();
        columnLabels = chartArr.shift(); //removes AND returns column labels ( chartArr[0] )
        //chartArr.pop();


       //get chartOutfields from config --i.e {attribute: "VALUE", label: "value"}
        var sparrowLayerId = map.getLayer('SparrowRanking').visibleLayers[0];
        var chartLabelsObj = getChartOutfields(sparrowLayerId);
        var chartLabelsArr = [];
        $.each(chartLabelsObj, function(index, obj){
            chartLabelsArr.push( obj.label ); //get labels ONLY as arr
        });
        
        //removes 'group by' from labels  (MUST MATCH CATEGORIES)
        chartLabelsArr.shift();

        //push label array into series
        $.each(chartLabelsArr, function(index, value){
            series.push( {name: value});
        });  


        //chartArr is a multi-dimensional array.  Each item in chartArr is an array of series data.
        $.each(chartArr, function(index, value){
            series[index].data = chartArr[index];
        });


         ///SAMPLE DATA FORMAT
        /*var series = [{
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
        ]*/

        //TODO: DYNAMICALLY LABEL BASED ON DROPDOWN VALUES????
        function labelxSelect(){
            var dropdown = $("#groupResultsSelect")[0].selectedIndex;
            switch ( dropdown ){
                case 0:
                    return "HUC10";
                    break;
                case 1:
                    return "HUC8";
                    break;
                case 2: 
                    return "Independent Watershed";
                    break;
                case 3:
                    return "State";
                    break;
            }
        }

        function labelySelect(){
            var layerId = map.getLayer('SparrowRanking').visibleLayers[0];
            var label;
            switch( layerId ){
                case 0:
                   $.each(Group3, function(index, object){
                        if (object.field == $("#displayedMetricSelect").val() ){
                            label = object.name;
                        }
                   });
                    break;
                case 1:
                    $.each(Group2, function(index, object){
                        if (object.field == $("#displayedMetricSelect").val() ){
                            label = object.name;
                        }
                   });
                    break;
                case 2: 
                    $.each(Group1, function(index, object){
                        if (object.field == $("#displayedMetricSelect").val() ){
                            label = object.name;
                        }
                   });
                    break;
                case 3:
                    $.each(ST, function(index, object){
                        if (object.field == $("#displayedMetricSelect").val() ){
                            label = object.name;
                        }
                   });
                    break;
            }
            return label + chartUnits;
        }


         function highlightMapFeature(category){
            var layerDefinitions = "GRP_3_NAM = '" + category + "'";



            var selectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, 
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                new Color([255, 0, 0]), 2), new Color([255,255, 0, 0.5]));

            map.getLayer("SparrowGraphics").setDefinitionExpression(layerDefinitions);

            map.getLayer("SparrowGraphics").setSelectionSymbol(selectionSymbol);
        }


        /*function highlightMapFeature(attributeString){
            console.log('in highlightMapFeature()');

            //TODO: need to query for geometry??? using attribute string?

            var highlightGraphic = new Graphic(attributeString)
        }*/

        //START LOBIPANEL-------------------------------------------------------------------------------------------------------
        $("#chartWindowDiv").lobiPanel({
            unpin: false,
            reload: false,
            minimize: false,
            close: false,
            expand: false,
            editTitle: false,
            reload: false,
            editTitle: false,
            minWidth: 800,
            minHeight: 800,
            maxHeight: 1000
            

        });
        $("#chartWindowDiv").css("visibility", "visible");   


        $("#chartWindowDiv .dropdown").prepend("<div id='chartClose' title='close'><b>X</b></div>");
        $("#chartWindowDiv .dropdown").prepend("<div id='chartMinimize' title='collapse'><b>_</b></div>");

        var instance = $('#chartWindowDiv').data('lobiPanel');
        instance.unpin();

        //END LOBIPANEL-------------------------------------------------------------------------------------------------------
        
        
        //CHART WINDOW MODAL ____________________________________________________________________________________________________________________________

        //Show the Chart Modal
        //$('#chartModal').modal('show');
        //var chart = $('#chartContainer').highcharts(); //element id must match in highcharts function below

        //END CHART WINDOW MODAL ____________________________________________________________________________________________________________________________

        var chart = $('#chartWindowContainer').highcharts(); 

        $(function () {
            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                }
            });
            
            $('#chartWindowContainer').highcharts({
                chart: {
                    type: 'column',
                    width: 770,
                    height: 700,
                    zoomType: "x",
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                        }
                    },
                    events: {
                        selection: function (e) {
                            var xAxis = e.xAxis[0],
                            flag = false; // first selected point should deselect old ones
                            
                            if(xAxis) {
                                $.each(this.series, function (i, series) {
                                    $.each(series.points, function (j, point) {
                                        console.log(j, point);
                                       /* if ( point.x >= xAxis.min && point.x <= xAxis.max ) {
                                            point.select(true, flag);
                                            if (!flag) {
                                                flag = !flag; // all other points should include previous points
                                            }
                                        }*/
                                    });
                                });
                            }
                            $("#resetButton").prop("disabled", false);
                            return true; // Zoom to selected bars
                            
                        }
                        
                    }
                },
                title:{
                    text: null
                },
                subtitle:{
                    text: null
                },
                xAxis: {
                    categories: columnLabels,
                    title: {
                        text: "Ranked by " + labelxSelect()
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
                    align: 'center',
                    x: 10,
                    verticalAlign: 'top',
                    y: 0,
                    floating: false,
                    padding: 5,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function(){
                        var rank = this.point.index + 1; 
                        return '<b>'+ labelxSelect() + ': ' + this.point.category + '</b><br/>' 
                                + this.series.name + ': ' + this.point.y.toFixed(2)  + '<br/> Total (lb./yr.) ' + this.point.stackTotal.toFixed(2) + '<br/> Rank: ' + rank;
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

                                     require([
                                        'esri/Color',
                                        'esri/map',
                                        'esri/tasks/QueryTask',
                                        'esri/tasks/query',
                                        'esri/graphic',
                                        'esri/symbols/SimpleFillSymbol',
                                        'esri/SpatialReference',
                                        'dojo/dom',
                                        'dojo/dom-class',
                                        'dojo/on',
                                        'dojo/domReady!'
                                    ], function (
                                        Map,
                                        QueryTask,
                                        Query,
                                        Graphic,
                                        SimpleFillSymbol,
                                        SpatialReference,
                                        dom,
                                        domClass,
                                        on
                                    ) { 
                                        function switchWhereField(selectedIndex){
                                            switch (selectedIndex){
                                                case 0:
                                                    if( $("#st-select")[0].selectedIndex > 0){
                                                        return "ST_GP3_NAM";
                                                    }else{
                                                        return "GRP_3_NAM";
                                                    }
                                                    break;
                                                case 1:
                                                    if( $("#st-select")[0].selectedIndex > 0){
                                                        return "ST_GP2_NAM";
                                                    }else{
                                                        return "GRP_2_NAM";
                                                    }
                                                    break;
                                                case 2: 
                                                    if( $("#st-select")[0].selectedIndex > 0){
                                                        return "ST_GP1_NAM";
                                                    }else{
                                                        return "GRP_1_NAM";
                                                    }
                                                    break;
                                                    
                                                case 3:
                                                    return "ST";
                                                    break;
                                            }
                                        }

                                        //get everything needed for the query
                                        var category = this.category;  //refers to the selected chart area
                                        var visibleLayers = map.getLayer('SparrowRanking').visibleLayers[0];
                                        var URL = map.getLayer('SparrowRanking').url;
                                        var fieldName = switchWhereField( $("#groupResultsSelect")[0].selectedIndex );

                                        var queryTask;
                                        queryTask = new esri.tasks.QueryTask(URL + visibleLayers.toString() );

                                        var graphicsQuery = new esri.tasks.Query();
                                        graphicsQuery.returnGeometry = true; //important!
                                        graphicsQuery.outSpatialReference = map.spatialReference;  //important!
                                        graphicsQuery.outFields = ["*"];
                                        graphicsQuery.where = fieldName + "= '" + category + "'";

                                                                    
                                        queryTask.execute(graphicsQuery, responseHandler);

                                        function responseHandler(response){
                                            map.graphics.clear();
                                            var symbol = new SimpleFillSymbol()
                                                .setColor(new Color([209,23,23,0.25]))
                                                .setOutline(null);
                                            var feature = response.features[0]; 
                                            feature.setSymbol(symbol);
                                            map.graphics.add(feature);
                                        }

                                    });

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
        });

        /*  _________________________________________CHART EVENTS________________________________________________________________ */

        //LOBIPANEL______________________________________________

         $("#chartMinimize").on('click', function(){
            $("#chartWindowDiv").css("visibility", "hidden");
            //map.getLayer("fimExtents").setVisibility(false);
            //$("#flood-tools-alert").slideDown(250);
        });

        $("#chartClose").on('click', function(){
            map.graphics.clear();
            $("#chartWindowDiv").css("visibility", "hidden");
            $("#chartWindowContainer").empty();
        });

        //END LOBIPANEL______________________________________________

        

        //CHART WINDOW MODAL ______________________________________________

        //initial showing
        /*$("#chartModal").on('show.bs.modal', function(){
            $("#chartModalTitle").empty();
            $("#chartModalTitle").text("Phosphorus " + labelySelect() );
        });

        //after initial showing
        $("#chartModal").on('shown.bs.modal', function(){
            $("#chartModalTitle").empty();
            $("#chartModalTitle").text("Phosphorus " + labelySelect() );
        });*/

         //END CHART WINDOW MODAL ____________________________________________


        //Custom Reset button
        $('#resetButton').click(function() {
            var chart = $('#chartContainer').highcharts();
            chart.xAxis[0].setExtremes(null,null);
            $("#resetButton").prop("disabled", true);
            //chart.resetZoomButton.hide();
        });

        $("#downloadXLS").click(function(){
            var chart = $('#chartContainer').highcharts();
            alert(chart.getCSV());
            //window.open('data:application/vnd.ms-excel,' + chart.getTable() );
        });


        
        /*$('#chartModal').on('show.bs.modal', function(){
            $('#chartContainer').css('visibility', 'hidden');
        })

        $("chartModal").on('shown.bs.modal', function(event){
            $("#chartContainer").css('visibility', 'initial');
            chart.reflow();
        });*/

      
    } //END ShowChart()