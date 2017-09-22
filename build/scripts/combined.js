/**
 * Created by bdraper on 4/17/2015.
 */
//utility function for formatting numbers with commas every 3 digits
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}
/*
Created By Erik Myers 6/19/2017
CONFIG FILE FOR USE WITH SPARROW-GREAT LAKES

THIS CONFIG REMOVES CATCHMENT AND AGGREGATE LABELS FROM THE CHARTOUTFIELS OBJECTS TO SHORTEN CHART AND DISPLAYED METRIC LABELS.
Also removes PNAME and replaces it with MRB_ID and ST_MRB_ID
*/

var appTitle = "Great Lakes Nutrient Loading";
var appVersion = "v0.9.0";

var serviceBaseURL = "https://gis.wim.usgs.gov/arcgis/rest/services/SparrowGreatLakesV2/SparrowGreatLakes/MapServer/"; //important! UPDATE rest service URL
var chartUnits = " (kg/yr.)"

var groupResultsInitIndex = 1; //sets the default layer for the application.  In this case service layer 1 == HUC8.

var splitLayers = [5,6,7,13,14,15]; //important! UPDATE layer Ids of all state split layers

var mapCenter = [-85.2, 44.4];
//app.defaultMapCenter = [-87, 42];
defaultZoomLevel = 6


var tableOutFields = [
    { field: "FID", name: "Unique Feature Id"},
    { field: "GRP1", name: "Main River Basin"},
    { field: "GRP2", name: "Tributary"},
    { field: "GRP_3_NA_1", name: "Join Field"},
    { field: "Area_g3", name: "HUC10 area (mi2)"}   
]

var stateTableOutFields = [
    { field: "FID", name: "Unique Feature Id"},
    { field: "ST_GP3_NAM", name: "HUC10/State (combination) ID"},
    { field: "Area_S3", name: "HUC10 area within the state and the  model area (mi2)"},   
    { field: "ST", name: "State"},
    { field: "GRP_1_NAM", name: "Independent Watershed name (in which HUC10 is nested)"},
    { field: "GP2", name: "HUC8 (in which HUC10 is nested)"},
    { field: "GRP_3_NAM", name: "HUC10"},
    { field: "ST_GP1_NAM", name: "State and Independent Watershed"},
    { field: "ST_GP2_NAM", name: "State amd HUC8"},
    { field: "ST_gp3_n_1", name: "Join Field"}

]

var aggregateDefinitions = {
    st : "State",
    gp1 : "Main River Basin",
    gp2 : "Tributary",
    gp3 : "HUC8",
    sg1 : "State_Main River Basin",
    sg2 : "State_Tributary",
    sg3 : "State_HUC8"
}

// key, value pairs come from PHOSPHORUS attribute definitions Excel file
var catchmentDefinitions = {
    mrb_id : "Catchment ID",
    st_mrb_id: "Catchment ID by State",
    pname : "Catchment Name",
    accl : "Accumulated load (kg)",
    incl : "Incremental load (kg)",
    accy : "Accumulated yield (kg/km2)",
    incy : "Incremental yield (kg/km2)",
    daccl : "Delivered accumulated load (kg)",
    daccy : "Delivered accumulated yield (kg/km2)",
    dincl : "Delivered incremental load  (kg)",
    dincy : "Delivered incremental yield (kg/km2)"
}

//Nitrogen same as Phosphorus in this model
var catchmentDefinitions_tn = {
    mrb_id : "Catchment ID",
    st_mrb_id: "Catchment ID by State",
    pname : "Catchment Name",
    accl : "Accumulated load (kg)",
    incl : "Incremental load (kg)",
    accy : "Accumulated yield (kg/km2)",
    incy : "Incremental yield (kg/km2)",
    daccl : "Delivered accumulated load (kg)",
    daccy : "Delivered accumulated yield (kg/km2)",
    dincl : "Delivered incremental load  (kg)",
    dincy : "Delivered incremental yield (kg/km2)"
}

var mappedDefinitions = {
    area : "Aggregated area (km2)",
    al : "Aggregated load (kg)",
    ay : "Aggregated yield (kg/km2)" ,
    dal : "Delivered aggregated load (kg)",
    day : "Delivered aggregated yield (kg/km2)",
    ap : "Percent of aggregated load",
    dap: "Percent of delivered aggregated load"
}

var phosphorusSourceDefinitons = {
    s1 : "Point Sources",
    s2 : "Urban Land",
    s3 : "Manure (Confined)",
    s4 : "Manure (Unconfined)",
    s5 : "Farm Fertilizer",
    s6 : "Forest/Wetland"
}

/***UPDATE IMPORTANT! complete with source data Excel key***/
var nitrogenSourceDefinitions = {
    s1 : "Point Sources",
    s2 : "Manure (Confined)",
    s3 : "Farm Fertilizer",
    s4 : "Additional Agricultural Sources",
    s5 : "Atmospheric Depositon"
}



/***TODO -- 
    WE DON"T HAVE ALL THE CORRECT COLORS FOR Great Lakes AT THIS TIME -- double check before release. 
***/
//get these HEX values from project Google Doc and make sure they correspond with the order of SourceDefinitions objects above
var phosColors = [ '#FFCCFF', '#BF0000', '#663100', '#FFEC99', '#97DA7C', '#0070C0' ];     
var nitroColors = ['#BF0000', '#663100', '#FFEC99', '#97DA7C', '#0070C0' ];  


/***-----BEGIN PHOSPHORUS LAYER GROUPS --------***/
/* PHOSPHORUS CATCHMENTS */
    
/*DOCUMENTATION NOTES: each 'field below should correspond to a "Mapped Attribute" in the cats_tp_attribute_definitons.xlsx file.  These are the attributes that will be displayed on the map. */
var Catchments = [    
    {
        field: "ACCL", 
        name: catchmentDefinitions.accl, 
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id },
            { attribute: "ACCL_S1", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCL_S6", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions.incl, 
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "INCL_S1", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCL_S6", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions.accy,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "ACCY_S1", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCY_S2", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCY_S3", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCY_S4", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCY_S5", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCY_S6", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions.incy,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "INCY_S1", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCY_S2", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCY_S3", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCY_S4", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCY_S5", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCY_S6", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions.daccl,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "DACCL_S1", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DACCL_S2", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DACCL_S3", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DACCL_S4", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DACCL_S5", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DACCL_S6", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions.daccy,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "DACCY_S1", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DACCY_S2", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DACCY_S3", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DACCY_S4", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DACCY_S5", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DACCY_S6", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions.dincl, 
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id },
            { attribute: "DINCL_S1", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCL_S6", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions.dincy,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id },
            { attribute: "DINCY_S1", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCY_S2", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCY_S3", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCY_S4", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCY_S5", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCY_S6", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }

]

//HUC8 Metric choices, service Id 1
var Group3 = [    
    {
        field: "GP3_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP3_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

//HUC8 Metric choices, Service Id 1
var Group2 = [
    {
        field: "GP2_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP2_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP2_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP2_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group1 = [
    {
        field: "GP1_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP1_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP1_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP1_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var ST = [
    {
        field: "ST_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "ST_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ST_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "ST_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Catchments_st = [
    {
        field: "ACCL", 
        name: catchmentDefinitions.accl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id },
            { attribute: "ACCL_S1", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCL_S6", label: catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions.incl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "INCL_S1", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCL_S6", label: catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions.accy,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "ACCY_S1", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCY_S2", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCY_S3", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCY_S4", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCY_S5", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCY_S6", label: catchmentDefinitions.accy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions.incy,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "INCY_S1", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCY_S2", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCY_S3", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCY_S4", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCY_S5", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCY_S6", label: catchmentDefinitions.incy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions.daccl,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "DACCL_S1", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DACCL_S2", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DACCL_S3", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DACCL_S4", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DACCL_S5", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DACCL_S6", label: catchmentDefinitions.daccl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions.daccy,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "DACCY_S1", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DACCY_S2", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DACCY_S3", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DACCY_S4", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DACCY_S5", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DACCY_S6", label: catchmentDefinitions.daccy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions.dincl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id },
            { attribute: "DINCL_S1", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCL_S6", label: catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions.dincy,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id },
            { attribute: "DINCY_S1", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCY_S2", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCY_S3", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCY_S4", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCY_S5", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCY_S6", label: catchmentDefinitions.dincy + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }

]

//HUC8 Metric choices, service Id 1
var Group3 = [    
    {
        field: "GP3_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP3_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group3_st = [
    {
        field: "SG3_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG3_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG3_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG3_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group2_st = [
    {
        field: "SG2_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG2_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG2_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG2_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group1_st = [
    {
        field: "SG1_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AL_S1", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_AL_S2", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_AL_S3", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_AL_S4", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_AL_S5", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_AL_S6", label: mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG1_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAL_S1", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_DAL_S2", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_DAL_S3", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_DAL_S4", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_DAL_S5", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_DAL_S6", label: mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG1_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AY_S1", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_AY_S2", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_AY_S3", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_AY_S4", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_AY_S5", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_AY_S6", label: mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG1_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAY_S1", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_DAY_S2", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_DAY_S3", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_DAY_S4", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_DAY_S5", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_DAY_S6", label: mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]
////END PHOSPHORUS LAYER GROUPS______________________________________________________________________________________________________________________________

////BEGIN NITROGEN LAYER GROUPS______________________________________________________________________________________________________________________________
//Catchments NITRO
var Catchments_tn = [
    {
        field: "ACCL", 
        name: catchmentDefinitions_tn.accl, 
        chartOutfields: [
            { attribute: "MRB_ID",  label: catchmentDefinitions.mrb_id },
            { attribute: "ACCL_S1", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions_tn.incl, 
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id }, 
            { attribute: "INCL_S1", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions_tn.accy,
        chartOutfields: [
            { attribute: "MRB_ID",  label: catchmentDefinitions.mrb_id },
            { attribute: "ACCY_S1", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCY_S2", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCY_S3", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCY_S4", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCY_S5", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions_tn.incy,
        chartOutfields: [
            { attribute: "MRB_ID",  label: catchmentDefinitions.mrb_id },
            { attribute: "INCY_S1", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCY_S2", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCY_S3", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCY_S4", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCY_S5", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions_tn.daccl,
        chartOutfields: [
            { attribute: "MRB_ID",  label: catchmentDefinitions.mrb_id },
            { attribute: "DACCL_S1", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DACCL_S2", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DACCL_S3", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DACCL_S4", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DACCL_S5", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions_tn.daccy,
        chartOutfields: [
            { attribute: "MRB_ID",  label: catchmentDefinitions.mrb_id },
            { attribute: "DACCY_S1", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DACCY_S2", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DACCY_S3", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DACCY_S4", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DACCY_S5", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions_tn.dincl, 
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id },
            { attribute: "DINCL_S1", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions_tn.dincy,
        chartOutfields: [
            { attribute: "MRB_ID", label: catchmentDefinitions.mrb_id },
            { attribute: "DINCY_S1", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCY_S2", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCY_S3", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCY_S4", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCY_S5", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var Group3_tn = [
    {
        field: "GP3_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP3_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "GP3_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP3_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

//HUC8 Metric choices, Service Id 1
var Group2_tn = [
    {
        field: "GP2_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP2_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "GP2_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP2_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

//independent watershed Metric choices, Service ID 2
var Group1_tn = [
    {
        field: "GP1_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "GP1_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "GP1_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP1_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var ST_tn = [
    {
        field: "ST_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "ST_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "ST_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "ST_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
    }
]

var Catchments_st_tn = [
    {
        field: "ACCL", 
        name: catchmentDefinitions_tn.accl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID",  label: catchmentDefinitions.st_mrb_id },
            { attribute: "ACCL_S1", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions_tn.incl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id }, 
            { attribute: "INCL_S1", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions_tn.accy,
        chartOutfields: [
            { attribute: "ST_MRB_ID",  label: catchmentDefinitions.st_mrb_id },
            { attribute: "ACCY_S1", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCY_S2", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCY_S3", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCY_S4", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCY_S5", label: catchmentDefinitions_tn.accy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions_tn.incy,
        chartOutfields: [
            { attribute: "ST_MRB_ID",  label: catchmentDefinitions.st_mrb_id },
            { attribute: "INCY_S1", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCY_S2", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCY_S3", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCY_S4", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCY_S5", label: catchmentDefinitions_tn.incy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions_tn.daccl,
        chartOutfields: [
            { attribute: "ST_MRB_ID",  label: catchmentDefinitions.st_mrb_id },
            { attribute: "DACCL_S1", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DACCL_S2", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DACCL_S3", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DACCL_S4", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DACCL_S5", label: catchmentDefinitions_tn.daccl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions_tn.daccy,
        chartOutfields: [
            { attribute: "ST_MRB_ID",  label: catchmentDefinitions.st_mrb_id },
            { attribute: "DACCY_S1", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DACCY_S2", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DACCY_S3", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DACCY_S4", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DACCY_S5", label: catchmentDefinitions_tn.daccy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions_tn.dincl, 
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id },
            { attribute: "DINCL_S1", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions_tn.dincy,
        chartOutfields: [
            { attribute: "ST_MRB_ID", label: catchmentDefinitions.st_mrb_id },
            { attribute: "DINCY_S1", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCY_S2", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCY_S3", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCY_S4", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCY_S5", label: catchmentDefinitions_tn.dincy + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var Group3_st_tn = [
    {
        field: "SG3_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG3_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "SG3_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG3_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var Group2_st_tn = [
   {
        field: "SG2_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG2_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "SG2_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5},        ]
    },
    {
        field: "SG2_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
    }
]

var Group1_st_tn = [
    {
        field: "SG1_AL", 
        name: mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AL_S1", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_AL_S2", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_AL_S3", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_AL_S4", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_AL_S5", label: mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "SG1_DAL", 
        name: mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAL_S1", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_DAL_S2", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_DAL_S3", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_DAL_S4", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_DAL_S5", label: mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "SG1_AY", 
        name: mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AY_S1", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_AY_S2", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_AY_S3", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_AY_S4", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_AY_S5", label: mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "SG1_DAY", 
        name: mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAY_S1", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_DAY_S2", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_DAY_S3", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_DAY_S4", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_DAY_S5", label: mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
    }
]
////END NITROGEN LAYER GROUPS______________________________________________________________________________________________________________________________


var queryParameters = {
    grp3: {idField: "GRP_3_NUM",
        nameField: ["GRP_3_NAM", "GRP_2_NAM", "GRP_1_NAM", "ST"], //actually set in core.js for loop currently
        alias: "HUC10",
        serviceId: 4,
        AOISelect: false
    },
    grp2: {idField: "GRP_2_NUM",
        nameField: ["GRP_2_NAM"],
        alias: "HUC8",
        serviceId: 1,
        AOISelect: true

    },
    grp1: {idField: "GRP_1_NUM",
        nameField: ["GRP_1_NAM"],
        alias: "Independent Watershed",
        serviceId: 2,
        AOISelect: true
    },
    st: {idField: "ST",
        nameField: ["ST"],
        alias: "State",
        serviceId: 3,
        AOISelect: true
    }
} 

//
 
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
                        "visible": false,
                        "opacity": 0.50
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
                "Land Use 2012": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu2012_100515_test/ImageServer",
                    "options": {
                        "id": "lu2012",
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





/**
 * A Highcharts plugin for exporting data from a rendered chart as CSV, XLS or HTML table
 *
 * Author:   Torstein Honsi
 * Licence:  MIT
 * Version:  1.4.7
 */
/*global Highcharts, window, document, Blob */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
})(function (Highcharts) {

    'use strict';

    var each = Highcharts.each,
        pick = Highcharts.pick,
        seriesTypes = Highcharts.seriesTypes,
        downloadAttrSupported = document.createElement('a').download !== undefined;

    Highcharts.setOptions({
        lang: {
            downloadCSV: 'Download CSV',
            downloadXLS: 'Download XLS',
            viewData: 'View data table'
        }
    });


    /**
     * Get the data rows as a two dimensional array
     */
    Highcharts.Chart.prototype.getDataRows = function () {
        var options = (this.options.exporting || {}).csv || {},
            xAxis,
            xAxes = this.xAxis,
            rows = {},
            rowArr = [],
            dataRows,
            names = [],
            i,
            x,
            xTitle,
            // Options
            dateFormat = options.dateFormat || '%Y-%m-%d %H:%M:%S',
            columnHeaderFormatter = options.columnHeaderFormatter || function (item, key, keyLength) {
                if (item instanceof Highcharts.Axis) {
                    return (item.options.title && item.options.title.text) ||
                        (item.isDatetimeAxis ? 'DateTime' : 'Category');
                }
                return item ? 
                    item.name + (keyLength > 1 ? ' ('+ key + ')' : '') :
                    'Category';
            },
            xAxisIndices = [];

        // Loop the series and index values
        i = 0;
        each(this.series, function (series) {
            var keys = series.options.keys,
                pointArrayMap = keys || series.pointArrayMap || ['y'],
                valueCount = pointArrayMap.length,
                requireSorting = series.requireSorting,
                categoryMap = {},
                xAxisIndex = Highcharts.inArray(series.xAxis, xAxes),
                j;

            // Map the categories for value axes
            each(pointArrayMap, function (prop) {
                categoryMap[prop] = (series[prop + 'Axis'] && series[prop + 'Axis'].categories) || [];
            });

            if (series.options.includeInCSVExport !== false && series.visible !== false) { // #55

                // Build a lookup for X axis index and the position of the first
                // series that belongs to that X axis. Includes -1 for non-axis
                // series types like pies.
                if (!Highcharts.find(xAxisIndices, function (index) {
                    return index[0] === xAxisIndex;
                })) {
                    xAxisIndices.push([xAxisIndex, i]);
                }

                // Add the column headers, usually the same as series names
                j = 0;
                while (j < valueCount) {
                    names.push(columnHeaderFormatter(series, pointArrayMap[j], pointArrayMap.length));
                    j = j + 1;
                }

                each(series.points, function (point, pIdx) {
                    var key = requireSorting ? point.x : pIdx,
                        prop,
                        val;

                    j = 0;

                    if (!rows[key]) {
                        // Generate the row
                        rows[key] = [];
                        // Contain the X values from one or more X axes
                        rows[key].xValues = [];
                    }
                    rows[key].x = point.x;
                    rows[key].xValues[xAxisIndex] = point.x;
                    
                    // Pies, funnels, geo maps etc. use point name in X row
                    if (!series.xAxis || series.exportKey === 'name') {
                        rows[key].name = point.name;
                    }

                    while (j < valueCount) {
                        prop = pointArrayMap[j]; // y, z etc
                        val = point[prop];
                        rows[key][i + j] = pick(categoryMap[prop][val], val); // Pick a Y axis category if present
                        j = j + 1;
                    }

                });
                i = i + j;
            }
        });

        // Make a sortable array
        for (x in rows) {
            if (rows.hasOwnProperty(x)) {
                rowArr.push(rows[x]);
            }
        }

        var binding, xAxisIndex, column;
        dataRows = [names];

        i = xAxisIndices.length;
        while (i--) { // Start from end to splice in
            xAxisIndex = xAxisIndices[i][0];
            column = xAxisIndices[i][1];
            xAxis = xAxes[xAxisIndex];

            // Sort it by X values
            rowArr.sort(function (a, b) {
                return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
            });

            // Add header row
            xTitle = columnHeaderFormatter(xAxis);
            //dataRows = [[xTitle].concat(names)];
            dataRows[0].splice(column, 0, xTitle);

            // Add the category column
            each(rowArr, function (row) {

                var category = row.name;
                if (!category) {
                    if (xAxis.isDatetimeAxis) {
                        if (row.x instanceof Date) {
                            row.x = row.x.getTime();
                        }
                        category = Highcharts.dateFormat(dateFormat, row.x);
                    } else if (xAxis.categories) {
                        category = pick(
                            xAxis.names[row.x],
                            xAxis.categories[row.x],
                            row.x
                        )
                    } else {
                        category = row.x;
                    }
                }

                // Add the X/date/category
                row.splice(column, 0, category);
            });
        }
        dataRows = dataRows.concat(rowArr);

        return dataRows;
    };

    /**
     * Get a CSV string
     */
    Highcharts.Chart.prototype.getCSV = function (useLocalDecimalPoint) {
        var csv = '',
            rows = this.getDataRows(),
            options = (this.options.exporting || {}).csv || {},
            itemDelimiter = options.itemDelimiter || ',', // use ';' for direct import to Excel
            lineDelimiter = options.lineDelimiter || '\n'; // '\n' isn't working with the js csv data extraction

        // Transform the rows to CSV
        each(rows, function (row, i) {
            var val = '',
                j = row.length,
                n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';
            while (j--) {
                val = row[j];
                if (typeof val === "string") {
                    val = '"' + val + '"';
                }
                if (typeof val === 'number') {
                    if (n === ',') {
                        val = val.toString().replace(".", ",");
                    }
                }
                row[j] = val;
            }
            // Add the values
            csv += row.join(itemDelimiter);

            // Add the line delimiter
            if (i < rows.length - 1) {
                csv += lineDelimiter;
            }
        });
        return csv;
    };

    /**
     * Build a HTML table with the data
     */
    Highcharts.Chart.prototype.getTable = function (useLocalDecimalPoint) {
        var html = '<table><thead>',
            rows = this.getDataRows();

        // Transform the rows to HTML
        each(rows, function (row, i) {
            var tag = i ? 'td' : 'th',
                val,
                j,
                n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';

            html += '<tr>';
            for (j = 0; j < row.length; j = j + 1) {
                val = row[j];
                // Add the cell
                if (typeof val === 'number') {
                    val = val.toString();
                    if (n === ',') {
                        val = val.replace('.', n);
                    }
                    html += '<' + tag + ' class="number">' + val + '</' + tag + '>';

                } else {
                    html += '<' + tag + '>' + (val === undefined ? '' : val) + '</' + tag + '>';
                }
            }

            html += '</tr>';

            // After the first row, end head and start body
            if (!i) {
                html += '</thead><tbody>';
            }
            
        });
        html += '</tbody></table>';

        return html;
    };

    function getContent(chart, href, extension, content, MIME) {
        var a,
            blobObject,
            name,
            options = (chart.options.exporting || {}).csv || {},
            url = options.url || 'http://www.highcharts.com/studies/csv-export/download.php';

        if (chart.options.exporting.filename) {
            name = chart.options.exporting.filename;
        } else if (chart.title) {
            name = chart.title.textStr.replace(/ /g, '-').toLowerCase();
        } else {
            name = 'chart';
        }

        // MS specific. Check this first because of bug with Edge (#76)
        if (window.Blob && window.navigator.msSaveOrOpenBlob) {
            // Falls to msSaveOrOpenBlob if download attribute is not supported
            blobObject = new Blob([content]);
            window.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

        // Download attribute supported
        } else if (downloadAttrSupported) {
            a = document.createElement('a');
            a.href = href;
            a.target = '_blank';
            a.download = name + '.' + extension;
            chart.container.append(a); // #111
            a.click();
            a.remove();

        } else {
            // Fall back to server side handling
            Highcharts.post(url, {
                data: content,
                type: MIME,
                extension: extension
            });
        }
    }

    /**
     * Call this on click of 'Download CSV' button
     */
    Highcharts.Chart.prototype.downloadCSV = function () {
        var csv = this.getCSV(true);
        getContent(
            this,
            'data:text/csv,\uFEFF' + encodeURIComponent(csv),
            'csv',
            csv,
            'text/csv'
        );
    };

    /**
     * Call this on click of 'Download XLS' button
     */
    Highcharts.Chart.prototype.downloadXLS = function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
                '<x:Name>Ark1</x:Name>' +
                '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                '<style>td{border:none;font-family: Calibri, sans-serif;} .number{mso-number-format:"0.00";}</style>' +
                '<meta name=ProgId content=Excel.Sheet>' +
                '<meta charset=UTF-8>' +
                '</head><body>' +
                this.getTable(true) +
                '</body></html>',
            base64 = function (s) { 
                return window.btoa(unescape(encodeURIComponent(s))); // #50
            };
        getContent(
            this,
            uri + base64(template),
            'xls',
            template,
            'application/vnd.ms-excel'
        );
    };

    /**
     * View the data in a table below the chart
     */
    Highcharts.Chart.prototype.viewData = function () {
        if (!this.dataTableDiv) {
            this.dataTableDiv = document.createElement('div');
            this.dataTableDiv.className = 'highcharts-data-table';
            
            // Insert after the chart container
            this.renderTo.parentNode.insertBefore(
                this.dataTableDiv,
                this.renderTo.nextSibling
            );
        }

        this.dataTableDiv.innerHTML = this.getTable();
    };


    // Add "Download CSV" to the exporting menu. Use download attribute if supported, else
    // run a simple PHP script that returns a file. The source code for the PHP script can be viewed at
    // https://raw.github.com/highslide-software/highcharts.com/master/studies/csv-export/csv.php
    if (Highcharts.getOptions().exporting) {
        Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push({
            textKey: 'downloadCSV',
            onclick: function () { this.downloadCSV(); }
        }, {
            textKey: 'downloadXLS',
            onclick: function () { this.downloadXLS(); }
        }, {
            textKey: 'viewData',
            onclick: function () { this.viewData(); }
        });
    }

    // Series specific
    if (seriesTypes.map) {
        seriesTypes.map.prototype.exportKey = 'name';
    }
    if (seriesTypes.mapbubble) {
        seriesTypes.mapbubble.prototype.exportKey = 'name';
    }

});
/*
 Highcharts JS v5.0.12 (2017-05-24)
 Exporting module

 (c) 2010-2017 Torstein Honsi

 License: www.highcharts.com/license

original file location: https://code.highcharts.com/modules/exporting.js

*/
(function(k){"object"===typeof module&&module.exports?module.exports=k:k(Highcharts)})(function(k){(function(f){var k=f.defaultOptions,p=f.doc,A=f.Chart,w=f.addEvent,I=f.removeEvent,E=f.fireEvent,t=f.createElement,B=f.discardElement,v=f.css,n=f.merge,C=f.pick,h=f.each,F=f.objectEach,u=f.extend,J=f.isTouchDevice,D=f.win,G=D.navigator.userAgent,K=f.Renderer.prototype.symbols;/Edge\/|Trident\/|MSIE /.test(G);/firefox/i.test(G);u(k.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",
downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});k.navigation={buttonOptions:{theme:{},symbolSize:14,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,verticalAlign:"top",width:24}};n(!0,k.navigation,{menuStyle:{border:"1px solid #999999",background:"#ffffff",padding:"5px 0"},menuItemStyle:{padding:"0.5em 1em",background:"none",color:"#333333",fontSize:J?"14px":"11px",transition:"background 250ms, color 250ms"},menuItemHoverStyle:{background:"#335cad",
color:"#ffffff"},buttonOptions:{symbolFill:"#666666",symbolStroke:"#666666",symbolStrokeWidth:3,theme:{fill:"#ffffff",stroke:"none",padding:5}}});k.exporting={type:"image/png",url:"https://export.highcharts.com/",printMaxWidth:780,scale:2,buttons:{contextButton:{className:"highcharts-contextbutton",menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},
{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};f.post=function(a,b,e){var c=t("form",n({method:"post",action:a,enctype:"multipart/form-data"},e),{display:"none"},p.body);F(b,function(a,b){t("input",{type:"hidden",name:b,value:a},null,c)});c.submit();B(c)};u(A.prototype,{sanitizeSVG:function(a,
b){if(b&&b.exporting&&b.exporting.allowHTML){var e=a.match(/<\/svg>(.*?$)/);e&&e[1]&&(e='\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"'+b.chart.width+'" height\x3d"'+b.chart.height+'"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e'+e[1]+"\x3c/body\x3e\x3c/foreignObject\x3e",a=a.replace("\x3c/svg\x3e",e+"\x3c/svg\x3e"))}a=a.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g,
"url($2)").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g," xlink:href\x3d").replace(/\n/," ").replace(/<\/svg>.*?$/,"\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad");return a=a.replace(/<IMG /g,"\x3cimage ").replace(/<(\/?)TITLE>/g,"\x3c$1title\x3e").replace(/height=([^" ]+)/g,
'height\x3d"$1"').replace(/width=([^" ]+)/g,'width\x3d"$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href\x3d"$1"/\x3e').replace(/ id=([^" >]+)/g,' id\x3d"$1"').replace(/class=([^" >]+)/g,'class\x3d"$1"').replace(/ transform /g," ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(a){return a.toLowerCase()})},getChartHTML:function(){return this.container.innerHTML},getSVG:function(a){var b,e,c,r,m,g=n(this.options,a);p.createElementNS||(p.createElementNS=function(a,b){return p.createElement(b)});
e=t("div",null,{position:"absolute",top:"-9999em",width:this.chartWidth+"px",height:this.chartHeight+"px"},p.body);c=this.renderTo.style.width;m=this.renderTo.style.height;c=g.exporting.sourceWidth||g.chart.width||/px$/.test(c)&&parseInt(c,10)||600;m=g.exporting.sourceHeight||g.chart.height||/px$/.test(m)&&parseInt(m,10)||400;u(g.chart,{animation:!1,renderTo:e,forExport:!0,renderer:"SVGRenderer",width:c,height:m});g.exporting.enabled=!1;delete g.data;g.series=[];h(this.series,function(a){r=n(a.userOptions,
{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:a.visible});r.isInternal||g.series.push(r)});h(this.axes,function(a){a.userOptions.internalKey||(a.userOptions.internalKey=f.uniqueKey())});b=new f.Chart(g,this.callback);a&&h(["xAxis","yAxis","series"],function(c){var d={};a[c]&&(d[c]=a[c],b.update(d))});h(this.axes,function(a){var c=f.find(b.axes,function(b){return b.options.internalKey===a.userOptions.internalKey}),d=a.getExtremes(),e=d.userMin,d=d.userMax;!c||void 0===e&&void 0===d||
c.setExtremes(e,d,!0,!1)});c=b.getChartHTML();c=this.sanitizeSVG(c,g);g=null;b.destroy();B(e);return c},getSVGForExport:function(a,b){var e=this.options.exporting;return this.getSVG(n({chart:{borderRadius:0}},e.chartOptions,b,{exporting:{sourceWidth:a&&a.sourceWidth||e.sourceWidth,sourceHeight:a&&a.sourceHeight||e.sourceHeight}}))},exportChart:function(a,b){b=this.getSVGForExport(a,b);a=n(this.options.exporting,a);f.post(a.url,{filename:a.filename||"chart",type:a.type,width:a.width||0,scale:a.scale,
svg:b},a.formAttributes)},print:function(){var a=this,b=a.container,e=[],c=b.parentNode,f=p.body,m=f.childNodes,g=a.options.exporting.printMaxWidth,d,H;if(!a.isPrinting){a.isPrinting=!0;a.pointer.reset(null,0);E(a,"beforePrint");if(H=g&&a.chartWidth>g)d=[a.options.chart.width,void 0,!1],a.setSize(g,void 0,!1);h(m,function(a,b){1===a.nodeType&&(e[b]=a.style.display,a.style.display="none")});f.appendChild(b);D.focus();D.print();setTimeout(function(){c.appendChild(b);h(m,function(a,b){1===a.nodeType&&
(a.style.display=e[b])});a.isPrinting=!1;H&&a.setSize.apply(a,d);E(a,"afterPrint")},1E3)}},contextMenu:function(a,b,e,c,f,m,g){var d=this,r=d.options.navigation,k=d.chartWidth,q=d.chartHeight,n="cache-"+a,l=d[n],x=Math.max(f,m),y,z;l||(d[n]=l=t("div",{className:a},{position:"absolute",zIndex:1E3,padding:x+"px"},d.container),y=t("div",{className:"highcharts-menu"},null,l),v(y,u({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},r.menuStyle)),z=function(){v(l,
{display:"none"});g&&g.setState(0);d.openMenu=!1},d.exportEvents.push(w(l,"mouseleave",function(){l.hideTimer=setTimeout(z,500)}),w(l,"mouseenter",function(){clearTimeout(l.hideTimer)}),w(p,"mouseup",function(b){d.pointer.inClass(b.target,a)||z()})),h(b,function(a){if(a){var b;a.separator?b=t("hr",null,null,y):(b=t("div",{className:"highcharts-menu-item",onclick:function(b){b&&b.stopPropagation();z();a.onclick&&a.onclick.apply(d,arguments)},innerHTML:a.text||d.options.lang[a.textKey]},null,y),b.onmouseover=
function(){v(this,r.menuItemHoverStyle)},b.onmouseout=function(){v(this,r.menuItemStyle)},v(b,u({cursor:"pointer"},r.menuItemStyle)));d.exportDivElements.push(b)}}),d.exportDivElements.push(y,l),d.exportMenuWidth=l.offsetWidth,d.exportMenuHeight=l.offsetHeight);b={display:"block"};e+d.exportMenuWidth>k?b.right=k-e-f-x+"px":b.left=e-x+"px";c+m+d.exportMenuHeight>q&&"top"!==g.alignOptions.verticalAlign?b.bottom=q-c-x+"px":b.top=c+m-x+"px";v(l,b);d.openMenu=!0},addButton:function(a){var b=this,e=b.renderer,
c=n(b.options.navigation.buttonOptions,a),f=c.onclick,m=c.menuItems,g,d,k=c.symbolSize||12;b.btnCount||(b.btnCount=0);b.exportDivElements||(b.exportDivElements=[],b.exportSVGElements=[]);if(!1!==c.enabled){var h=c.theme,q=h.states,p=q&&q.hover,q=q&&q.select,l;delete h.states;f?l=function(a){a.stopPropagation();f.call(b,a)}:m&&(l=function(){b.contextMenu(d.menuClassName,m,d.translateX,d.translateY,d.width,d.height,d);d.setState(2)});c.text&&c.symbol?h.paddingLeft=C(h.paddingLeft,25):c.text||u(h,{width:c.width,
height:c.height,padding:0});d=e.button(c.text,0,0,l,h,p,q).addClass(a.className).attr({"stroke-linecap":"round",title:b.options.lang[c._titleKey],zIndex:3});d.menuClassName=a.menuClassName||"highcharts-menu-"+b.btnCount++;c.symbol&&(g=e.symbol(c.symbol,c.symbolX-k/2,c.symbolY-k/2,k,k).addClass("highcharts-button-symbol").attr({zIndex:1}).add(d),g.attr({stroke:c.symbolStroke,fill:c.symbolFill,"stroke-width":c.symbolStrokeWidth||1}));d.add().align(u(c,{width:d.width,x:C(c.x,b.buttonOffset)}),!0,"spacingBox");
b.buttonOffset+=(d.width+c.buttonSpacing)*("right"===c.align?-1:1);b.exportSVGElements.push(d,g)}},destroyExport:function(a){var b=a?a.target:this;a=b.exportSVGElements;var e=b.exportDivElements,c=b.exportEvents,f;a&&(h(a,function(a,c){a&&(a.onclick=a.ontouchstart=null,f="cache-"+a.menuClassName,b[f]&&delete b[f],b.exportSVGElements[c]=a.destroy())}),a.length=0);e&&(h(e,function(a,c){clearTimeout(a.hideTimer);I(a,"mouseleave");b.exportDivElements[c]=a.onmouseout=a.onmouseover=a.ontouchstart=a.onclick=
null;B(a)}),e.length=0);c&&(h(c,function(a){a()}),c.length=0)}});K.menu=function(a,b,e,c){return["M",a,b+2.5,"L",a+e,b+2.5,"M",a,b+c/2+.5,"L",a+e,b+c/2+.5,"M",a,b+c-1.5,"L",a+e,b+c-1.5]};A.prototype.renderExporting=function(){var a=this,b=a.options.exporting,e=b.buttons,c=a.isDirtyExporting||!a.exportSVGElements;a.buttonOffset=0;a.isDirtyExporting&&a.destroyExport();c&&!1!==b.enabled&&(a.exportEvents=[],F(e,function(b){a.addButton(b)}),a.isDirtyExporting=!1);w(a,"destroy",a.destroyExport)};A.prototype.callbacks.push(function(a){a.renderExporting();
w(a,"redraw",a.renderExporting);h(["exporting","navigation"],function(b){a[b]={update:function(e,c){a.isDirtyExporting=!0;n(!0,a.options[b],e);C(c,!0)&&a.redraw()}}})})})(k)});
//for jshint
'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

var app = {};


// Get toast and page loader ready
$( document ).ready(function() {
  //$("#page-loader").fadeOut();
  $("#toast-fixed").fadeOut();
  $(".nav-title").html(appTitle);
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
        // disable available options in the Group By dropdown based on choses in layerDefObj
        // first enable all options and refresh, then disable only those needed and refresh
        $('#groupResultsSelect option').each(function() {
            (this).disabled = false;
        });
        if (layerDefObj.AOI3) {
            // if HUC8 has values NO: [2] Tributary,[3] Main River Basin, [4] State Group By
            var disForHUC = document.getElementById("groupResultsSelect").getElementsByTagName("option");
            disForHUC[2].disabled = true; // trib
            disForHUC[3].disabled = true; // main river basin
            disForHUC[4].disabled = true; // state
            $('#groupResultsSelect').selectpicker('render');
        } 
        if (layerDefObj.AOI2) {
            // if Trib has value NO: [1] HUC8, [3] Main River Basin, [4] State Group By
            var disForTrib = document.getElementById("groupResultsSelect").getElementsByTagName("option");
            disForTrib[1].disabled = true; // trib
            disForTrib[3].disabled = true; // main river basin
            disForTrib[4].disabled = true; // state
            $('#groupResultsSelect').selectpicker('render');
        }
        if (layerDefObj.AOI1) {
            // if Main River Basin has value NO: [4] State Group By
            var disForMRB = document.getElementById("groupResultsSelect").getElementsByTagName("option");
            disForMRB[4].disabled = true; // main river basin
            $('#groupResultsSelect').selectpicker('render');
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

    // called from app.updateAOIs when all for aois are selected. the one just updated is passed in and returns array of info needed several times
    var fourAOIsSelected = function(selectedId){
        var arrayForOther3AOIs = [];
        var prop1 = ""; var select1 = ""; var whichAoi1 = ""; var filteredAOI1 = "";
        var prop2 = ""; var select2 = ""; var whichAoi2 = ""; var filteredAOI2 = "";
        var prop3 = ""; var select3 = ""; var whichAoi3 = ""; var filteredAOI3 = "";
        switch(selectedId){
            case "st-select":
                $('#grp1-select').empty(); //filter by st, aoi2 & aoi3
                filteredAOI1 = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP2 == layerDefObj.AOI2 && s.GP3 === layerDefObj.AOI3; });
                prop1 = "GP1"; select1 = "#grp1-select"; whichAoi1 = "AOI1";
                $('#grp2-select').empty();  //filter by st, aoi1 & aoi3
                filteredAOI2 = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP1 == layerDefObj.AOI1 && s.GP3 === layerDefObj.AOI3; });
                prop2 = "GP2"; select2 = "#grp2-select"; whichAoi2 = "AOI2";
                $('#grp3-select').empty();  //filter by st, aoi1 & aoi2
                filteredAOI3 = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP1 == layerDefObj.AOI1 && s.GP2 === layerDefObj.AOI2; });
                prop3 = "GP3"; select3 = "#grp3-select"; whichAoi3 = "AOI3";                
                break;
            case 'grp1-select':
                // update st, aoi2, aoi3
                $('#st-select').empty(); //filter by aoi1, aoi2, aoi3
                filteredAOI1 = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.GP2 == layerDefObj.AOI2 && s.GP3 === layerDefObj.AOI3; });
                prop1 = "ST"; select1 = "#st-select"; whichAoi1 = "AOIST";
                $('#grp2-select').empty(); //filter by aoi1, st, aoi3
                filteredAOI2 = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.ST == layerDefObj.AOIST && s.GP3 === layerDefObj.AOI3; });
                prop2 = "GP2"; select2 = "#grp2-select"; whichAoi2 = "AOI2";
                $('#grp3-select').empty(); //filter by aoi1, st, aoi2
                filteredAOI3 = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.ST == layerDefObj.AOIST && s.GP2 === layerDefObj.AOI2; });
                prop3 = "GP3"; select3 = "#grp3-select"; whichAoi3 = "AOI3";                
                break;
            case 'grp2-select':
                // update st, aoi1, aoi3
                $('#st-select').empty(); //filter by aoi2, aoi1, aoi3
                filteredAOI1 = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.GP1 == layerDefObj.AOI1 && s.GP3 === layerDefObj.AOI3; });
                prop1 = "ST"; select1 = "#st-select"; whichAoi1 = "AOIST";
                $('#grp1-select').empty(); //filter by aoi2, st, aoi3
                filteredAOI2 = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.ST == layerDefObj.AOIST && s.GP3 === layerDefObj.AOI3; });
                prop2 = "GP1"; select2 = "#grp1-select"; whichAoi2 = "AOI1";
                $('#grp3-select').empty(); //filter by aoi2, st, aoi1
                filteredAOI3 = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.ST == layerDefObj.AOIST && s.GP1 === layerDefObj.AOI1; });
                prop3 = "GP3"; select3 = "#grp3-select"; whichAoi3 = "AOI3";
                break;
            case 'grp3-select':
                //grp3-select was just updated  // update st, aoi1, aoi2
                $('#st-select').empty();  // filter by aoi3, aoi1, aoi2
                filteredAOI1 = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.GP1 == layerDefObj.AOI1 && s.GP2 === layerDefObj.AOI2; });
                prop1 = "ST"; select1 = "#st-select"; whichAoi1 = "AOIST";
                $('#grp1-select').empty();  // filter by aoi3, st, aoi2
                filteredAOI2 = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.ST == layerDefObj.AOIST && s.GP2 === layerDefObj.AOI2; });
                prop2 = "GP1"; select2 = "#grp1-select"; whichAoi2 = "AOI1";
                $('#grp2-select').empty();  // filter by aoi3, st, aoi1
                filteredAOI3 = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3 && s.ST == layerDefObj.AOIST && s.GP1 === layerDefObj.AOI1; });
                prop3 = "GP2"; select3 = "#grp2-select"; whichAoi3 = "AOI2";
                break;
        }
        arrayForOther3AOIs = [ 
            { filterAOIs: filteredAOI1, prop: prop1, select: select1, whichAOI: whichAoi1},
            { filterAOIs: filteredAOI2, prop: prop2, select: select2, whichAOI: whichAoi2},
            { filterAOIs: filteredAOI3, prop: prop3, select: select3, whichAOI: whichAoi3}
        ];
        return arrayForOther3AOIs;        
    }

    // called from app.updateAOIs when 3 are selected. returns object containing info needed many times
    var threeAOIchosenUpdate = function(clearSelect, allAOIprop1, layerDef1, allAOIprop2, layerDef2, setSelect, setAOI){
        var returnArray = {};
        $(clearSelect).empty(); // filter by st && aoi2
        var options = AllAOIOptions.filter(function(s){ return s[allAOIprop1] == layerDefObj[layerDef1] && s[allAOIprop2] == layerDefObj[layerDef2]; });         
        returnArray = {filteredAOIOptions: options, prop: clearSelect, select: setSelect, AOI: setAOI };
        return returnArray;
    }

    // called from app.updateAOIs when 2 are selected. returns object containing info needed many times
    var twoAOIchosenUpdate = function (clearSelect, allAOIprop1, layerDef1, setSelect, setAOI){
        var returnArray = {};
        $(clearSelect).empty();
        var Options = AllAOIOptions.filter(function(s){ return s[allAOIprop1] == layerDefObj[layerDef1];});
        returnArray = {filteredAOIOptions: Options, prop: clearSelect, select: setSelect, AOI: setAOI };
        return returnArray;
        //extraProp = "GP3"; extraSelect = "#grp3-select"; extraLayerDef = "AOI3";
    }
    
    app.updateAOIs = function(selectedId){
        // for four AOI options
        var filteredAOIOptions = [];

        switch(Object.keys(app.getLayerDefObj()).length) {
            case 4: 
                var responseArray = fourAOIsSelected(selectedId); // returns array containing objects {filteredAOIs, prop, select, whichAOI}

                var theseOptions1 = getUniqueArray(responseArray[0].filterAOIs, responseArray[0].prop);
                var theseOptions2 = getUniqueArray(responseArray[1].filterAOIs, responseArray[1].prop);
                var theseOptions3 = getUniqueArray(responseArray[2].filterAOIs, responseArray[2].prop);

                appendSelectOptions(theseOptions1, responseArray[0].select, responseArray[0].whichAOI);
                appendSelectOptions(theseOptions2, responseArray[1].select, responseArray[1].whichAOI);
                appendSelectOptions(theseOptions3, responseArray[2].select, responseArray[2].whichAOI);
                break;
            case 3:
                //3 dropdowns are chosen, just update the one that's not ( and the other 2 that are, that are not this one that just got changed )
                var whichProp = ""; var whichSelect = ""; var whichAOI = "";
                var response1 = {};
                var response2 = {};
                //which one isn't chosen
                if (!layerDefObj.AOI3) {
                    // aoi3 needs to be updated using st, aoi1, aoi2
                    $('#grp3-select').empty(); 
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST == layerDefObj.AOIST && s.GP1 == layerDefObj.AOI1 && s.GP2 === layerDefObj.AOI2; });
                    whichProp = "GP3"; whichSelect = "#grp3-select"; whichAOI = "AOI3";
                    // which one was just upodated? Update the other 2 that are selected too
                    if (selectedId == "st-select") {
                        //use aoi1 & aoi2                        
                        var response1 = threeAOIchosenUpdate('#grp1-select', 'ST', 'AOIST', 'GP2', 'AOI2', 'GP1', 'AOI1');// filter by st && aoi2
                        var response2 = threeAOIchosenUpdate('#grp2-select', 'ST', 'AOIST', 'GP1', 'AOI1', 'GP2', 'AOI2');// filter by st && aoi1                       
                    } else if (selectedId == "grp1-select"){
                        //use st & aoi2
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP1', 'AOI1', 'GP2', 'AOI2', 'ST', 'AOIST');// filter by aoi1 && aoi2
                        var response2 = threeAOIchosenUpdate('#grp2-select', 'GP1', 'AOI1', 'ST', 'AOIST', 'GP2', 'AOI2');// filter by aoi1 && st
                    } else {
                        //twas grp2-select   use st & aoi1
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP2', 'AOI2', 'GP1', 'AOI1', 'ST', 'AOIST');//filter by aio2 && aoi1
                        var response2 = threeAOIchosenUpdate('#grp1-select', 'GP2', 'AOI2', 'ST', 'AOIST', 'GP1', 'AOI1'); //filter by aoi2 && st
                    }
                }
                else if (!layerDefObj.AOI2) {
                    // aoi2 needs to be updated using the st, aoi1, aoi3
                    $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP1 == layerDefObj.AOI1 && s.GP3 === layerDefObj.AOI3; });
                    whichProp = "GP2"; whichSelect = "#grp2-select"; whichAOI = "AOI2";
                    // which one was just upodated? Update the other 2 that are selected too
                    if (selectedId == "st-select"){
                        // use aoi1 and aoi3
                        var response1 = threeAOIchosenUpdate('#grp1-select', 'ST', 'AOIST', 'GP3', 'AOI3', 'GP1', 'AOI1'); //filter by st && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'ST', 'AOIST', 'GP1', 'AOI1', 'GP3', 'AOI3'); //filter by st && aoi1                        
                    } else if (selectedId == "grp1-select"){
                        // use st and aoi3
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP1', 'AOI1', 'GP3', 'AOI3', 'ST', 'AOIST');//filter by aoi1 && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'GP1', 'AOI1', 'ST', 'AOIST', 'GP3', 'AOI3'); //filter by aoi1 && st
                    } else {
                        // twas grp3-select  use st and aoi1
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP3', 'AOI3', 'GP1', 'AOI1', 'ST', 'AOIST');// filter by aoi3 && aoi1
                        var response2 = threeAOIchosenUpdate('#grp1-select', 'GP3', 'AOI3', 'ST', 'AOIST', 'GP1', 'AOI1');// filter by aoi3 && st
                    }
                } else  if (!layerDefObj.AOI1) {
                    // aoi1 needs to be updated using st, aoi2, aoi3
                    $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP2 == layerDefObj.AOI2 && s.GP3 === layerDefObj.AOI3; });
                    whichProp = "GP1"; whichSelect = "#grp1-select"; whichAOI = "AOI1";
                    // which one was just upodated? Update the other 2 that are selected too
                    if (selectedId == "st-select"){
                        // use aoi2 and aoi3
                        var response1 = threeAOIchosenUpdate('#grp2-select', 'ST', 'AOIST', 'GP3', 'AOI3', 'GP2', 'AOI2');//filter by st && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'ST', 'AOIST', 'GP2', 'AOI2', 'GP3', 'AOI3');//filter by st && aoi2
                  
                    } else if (selectedId == "grp2-select") {
                        //use st and aoi3
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP2', 'AOI2', 'GP3', 'AOI3', 'ST', 'AOIST');//filter by st && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'GP2', 'AOI2', 'ST', 'AOIST', 'GP3', 'AOI3');//filter by st && aoi2                   
                    } else {
                        // twas grp3-select
                        var response1 = threeAOIchosenUpdate('#st-select', 'GP3', 'AOI3', 'GP2', 'AOI2', 'ST', 'AOIST');//filter by aoi3 && aoi2
                        var response2 = threeAOIchosenUpdate('#grp2-select', 'GP3', 'AOI3', 'ST', 'AOIST', 'GP2', 'AOI2');//filter by aoi3 && st
                    }
                } else {
                    // st needs to be updated using the aoi1, aoi2, aoi3
                    $('#st-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.GP2 == layerDefObj.AOI2 && s.GP3 === layerDefObj.AOI3; });
                    whichProp = "ST"; whichSelect = "#st-select"; whichAOI = "AOIST";
                    // which one was just upodated? Update the other 2 that are selected too
                    if (selectedId == "grp1-select"){
                        var response1 = threeAOIchosenUpdate('#grp2-select', 'GP1', 'AOI1', 'GP3', 'AOI3', 'GP1', 'AOI1'); // filter by aoi1 && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'GP1', 'AOI1', 'GP2', 'AOI2', 'GP3', 'AOI3'); //filter by aoi1 && aoi2
                    } else if (selectedId == "grp2-select"){
                        var response1 = threeAOIchosenUpdate('#grp1-select', 'GP2', 'AOI2', 'GP3', 'AOI3', 'GP1', 'AOI1');//filter by aoi2 && aoi3
                        var response2 = threeAOIchosenUpdate('#grp3-select', 'GP2', 'AOI2', 'GP1', 'AOI1', 'GP3', 'AOI3'); //filter by aoi2 && aoi1
                    } else {
                        //twas grp3-select
                        var response1 = threeAOIchosenUpdate('#grp1-select', 'GP3', 'AOI3', 'GP2', 'AOI2', 'GP1', 'AOI1');//filter by aoi3 && aoi2
                        var response2 = threeAOIchosenUpdate('#grp2-select', 'GP3', 'AOI3', 'GP1', 'AOI1', 'GP2', 'AOI2'); //filter by aoi3 && aoi1
                    }
                }
                //nothing was filtered out of AllAOIOptions, bring them all along
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                /*______________________________________________________
                    filteredAOIOptions Array of Objects Example         ]
                [{                                                      ]
                    GP1: "Conasauga River",                             ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010101",                                   ]
                    ST:"GA"   <--- Selected State                       ]
                },                                                      ]
                {                                                       ]
                    GP1: "Conasauga River",                             ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010102",  <-- Obj for every HUC10          ]
                    ST:"GA"                                             ]
                }]                                                      ]
                ________________________________________________________]
                */

                //get unique group values                
                var theseOptions = getUniqueArray(filteredAOIOptions, whichProp);
                var extra1Options = getUniqueArray(response1.filteredAOIOptions, response1.select);
                var extra2Options = getUniqueArray(response2.filteredAOIOptions, response2.select);
                //set other two AOI options and reselect if previously selected
                appendSelectOptions(theseOptions, whichSelect, whichAOI);
                appendSelectOptions(extra1Options, response1.prop, response1.AOI);
                appendSelectOptions(extra2Options, response2.prop, response2.AOI);
                break;
            case 2:
                var response1 = {};
                var firstProp = ""; var firstOptions = ""; var firstSelect = ""; var firstLayerDef = "";
                var secondProp = ""; var secondOptions = ""; var secondSelect = ""; var secondLayerDef = "";                
                //2 dropdowns are chosen, just update the other 2 that's not
                //which 2 are not chosen
                if (!layerDefObj.AOIST && !layerDefObj.AOI1) {
                    //st and aoi1 need to be updated using aoi2 and aoi3
                    $('#st-select').empty(); $('#grp1-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2 && s.GP3 == layerDefObj.AOI3; });
                    //also reupdate the one that is not selectedId ('grp2-select' or 'grp3-select' )
                    if (selectedId == "grp2-select"){
                        response1 = twoAOIchosenUpdate('#grp3-select', 'GP2', 'AOI2', 'GP3', 'AOI3'); 
                    } else {
                        response1 = twoAOIchosenUpdate('#grp2-select', 'GP3', 'AOI3', 'GP2', 'AOI2'); 
                    }
                    firstProp = "ST"; firstSelect = "#st-select"; firstLayerDef = "AOIST";
                    secondProp = "GP1"; secondSelect = "#grp1-select"; secondLayerDef = "AOI1";
                } else if (!layerDefObj.AOIST && !layerDefObj.AOI2) {
                    //st and aoi2 need to be updated using aoi1 and aoi3
                    $('#st-select').empty(); $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.GP3 == layerDefObj.AOI3; });
                    //also reupdate the one that is not selectedId ('grp1-select' or 'grp3-select' )
                    if (selectedId == "grp1-select"){
                        response1 = twoAOIchosenUpdate('#grp3-select', 'GP1', 'AOI1', 'GP3', 'AOI3');
                    } else {
                        response1 = twoAOIchosenUpdate('#grp1-select', 'GP3', 'AOI3', 'GP1', 'AOI1');
                    }
                    firstProp = "ST"; firstSelect = "#st-select"; firstLayerDef = "AOIST";
                    secondProp = "GP2"; secondSelect = "#grp2-select"; secondLayerDef = "AOI2";
                } else if (!layerDefObj.AOIST && !layerDefObj.AOI3) {
                    //st and aoi3 need to be updated using aoi1 and aoi2
                    $('#st-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1 && s.GP2 == layerDefObj.AOI2; });
                    //also reupdate the one that is not selectedId ('grp1-select' or 'grp2-select' )
                    if (selectedId == "grp1-select"){
                        response1 = twoAOIchosenUpdate('#grp2-select', 'GP1', 'AOI1', 'GP2', 'AOI2');
                    } else {
                        response1 = twoAOIchosenUpdate('#grp1-select', 'GP2', 'AOI2', 'GP1', 'AOI1');
                    }
                    firstProp = "ST"; firstSelect = "#st-select"; firstLayerDef = "AOIST";
                    secondProp = "GP3"; secondSelect = "#grp3-select"; secondLayerDef = "AOI3";
                } else if (!layerDefObj.AOI1 && !layerDefObj.AOI2) {                     
                    //aoi1 and aoi2 need to be updated using st and aoi3
                    $('#grp1-select').empty(); $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP3 == layerDefObj.AOI3; });
                    //also reupdate the one that is not selectedId ('st-select' or 'grp3-select' )
                    if (selectedId == "st-select"){
                        response1 = twoAOIchosenUpdate('#grp3-select', 'ST', 'AOIST', 'GP3', 'AOI3');
                    } else {
                        response1 = twoAOIchosenUpdate('#st-select', 'GP3', 'AOI3', 'ST', 'AOIST');
                    }
                    firstProp = "GP1"; firstSelect = "#grp1-select"; firstLayerDef = "AOI1";
                    secondProp = "GP2"; secondSelect = "#grp2-select"; secondLayerDef = "AOI2";
                } else if (!layerDefObj.AOI1 && !layerDefObj.AOI3) {
                    //aoi1 and aoi3 need to be updated using st and aoi2
                    $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP2 == layerDefObj.AOI2; });
                    //also reupdate the one that is not selectedId ('st-select' or 'grp2-select' )
                    if (selectedId == "st-select"){
                        response1 = twoAOIchosenUpdate('#grp2-select', 'ST', 'AOIST', 'GP2', 'AOI2');                     
                    } else {
                        response1 = twoAOIchosenUpdate('#st-select', 'GP2', 'AOI2', 'ST', 'AOIST');
                    }
                    firstProp = "GP1"; firstSelect = "#grp1-select"; firstLayerDef = "AOI1";
                    secondProp = "GP3"; secondSelect = "#grp3-select"; secondLayerDef = "AOI3";
                } else if (!layerDefObj.AOI2 && !layerDefObj.AOI3) {
                    //aoi2 and aoi3 need to be updated using st and aoi1
                    $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST && s.GP1 == layerDefObj.AOI1; });
                    //also reupdate the one that is not selectedId ('st-select' or 'grp1-select' )
                    if (selectedId == "st-select"){
                        response1 = twoAOIchosenUpdate('#grp1-select', 'ST', 'AOIST', 'GP1', 'AOI1');
                    } else {
                        response1 = twoAOIchosenUpdate('#st-select', 'GP1', 'AOI1', 'ST', 'AOIST');
                    }
                    firstProp = "GP2"; firstSelect = "#grp2-select"; firstLayerDef = "AOI2";
                    secondProp = "GP3"; secondSelect = "#grp3-select"; secondLayerDef = "AOI3";
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }

                //get unique arrays
                var arrayOptions = getUniqueArray(filteredAOIOptions, firstProp);
                var theseOptions = getUniqueArray(filteredAOIOptions, secondProp);
                var extraOptions = getUniqueArray(response1.filteredAOIOptions, response1.select);
                //set other two AOI options and reselect if previously selected
                appendSelectOptions(arrayOptions, firstSelect, firstLayerDef);
                appendSelectOptions(theseOptions, secondSelect, secondLayerDef);
                appendSelectOptions(extraOptions, response1.prop, response1.AOI);
                     
                break;            
            case 1:
                var otherThree = []; var threeSelects = []; var threeAOIs = [];
                //1 dropdown is chosen, update the other 3 that's not
                //which 1 is chosen
                if (layerDefObj.AOIST) {
                    // state is chosen, update aoi1, aoi2, aoi3
                    $('#grp1-select').empty(); $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.ST === layerDefObj.AOIST });
                    otherThree = ["GP1", "GP2", "GP3"]; threeSelects = ["#grp1-select", "#grp2-select", "#grp3-select"]; threeAOIs = ["AOI1", "AOI2", "AOI3"];
                }
                else if (layerDefObj.AOI1) {
                    // aoi1 is chosen, update st, aoi2, aoi3
                    $('#st-select').empty(); $('#grp2-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP1 === layerDefObj.AOI1; });
                    otherThree = ["ST", "GP2", "GP3"]; threeSelects = ["#st-select", "#grp2-select", "#grp3-select"]; threeAOIs = ["AOIST", "AOI2", "AOI3"];
                } else if (layerDefObj.AOI2) {
                    // aoi2 is chosen, update st, aoi1, aoi3
                    $('#st-select').empty(); $('#grp1-select').empty(); $('#grp3-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP2 === layerDefObj.AOI2; });
                    otherThree = ["ST", "GP1", "GP3"]; threeSelects = ["#st-select", "#grp1-select", "#grp3-select"]; threeAOIs = ["AOIST", "AOI1", "AOI3"];
                }else if (layerDefObj.AOI3) {
                    // aoi3 is chosen, update st, aoi1, aoi2
                    $('#st-select').empty(); $('#grp1-select').empty(); $('#grp2-select').empty();
                    filteredAOIOptions = AllAOIOptions.filter(function(s){ return s.GP3 === layerDefObj.AOI3; });
                    otherThree = ["ST", "GP1", "GP2"]; threeSelects = ["#st-select", "#grp1-select", "#grp2-select"]; threeAOIs = ["AOIST", "AOI1", "AOI2"];
                }
                if (filteredAOIOptions.length === 0) {
                    filteredAOIOptions = AllAOIOptions;
                }
                for (var i = 0; i < 4; i++){
                    var options = getUniqueArray(filteredAOIOptions, otherThree[i]);
                    appendSelectOptions(options, threeSelects[i], threeAOIs[i]);
                }
                break;            
            case 0:
                //none are chosen, get everything
                //reset the selects
                $('.aoiSelect').selectpicker('val', '');  
                app.clearLayerDefObj();
                break;

        }
    }

    /*app.updateAOIs = function(selectedId){
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
                    GP1: "Conasauga River",                             ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010101",                                   ]
                    ST:"GA"   <--- Selected State                       ]
                },                                                      ]
                {                                                       ]
                    GP1: "Conasauga River",                             ]
                    GRP_2_NAM: "03150101",                              ]
                    GP3:"0315010102",  <-- Obj for every HUC10          ]
                    ST:"GA"                                             ]
                }]                                                      ]
                ________________________________________________________]
                

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
    }*/

    //function used several times in above switch case
    var appendSelectOptions = function(firstOptions, select1_ID, firstAOI){
        //set the filtered state options
        $.each(firstOptions, function(index, option){
            $(select1_ID).append(new Option(option));
        });
        $(select1_ID).selectpicker('refresh');
        //if something in there was selected previously, programatically select the previously correct option
        if(layerDefObj[firstAOI]){
            $(select1_ID).selectpicker('val', layerDefObj[firstAOI]);
        };        
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
        //console.log(evt);
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
                        // make sure 'Show Chart for All' button now says 'Show Chart for selected'
                        $('#chartButton').html("Show Chart for selected");
                    } else {
                        //removing
                        var symbolToRemove = app.map.graphics.graphics.filter(function (g) { return g.symbol.id == respObj.value})[0];
                        app.map.graphics.remove(symbolToRemove);
                        //remove this from array of responses
                        app.userSelectedShapes.splice(app.userSelectedShapes.indexOf(respValue), 1);
                        // if all selected have been removed, change Show Chart button back to say All
                        if (app.userSelectedShapes.length == 0) $('#chartButton').html("Show Chart for All");
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
                            //console.log(obj.attribute);
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
        
        if( $("#chartWindowDiv").css("visibility") != "visible" ) {
           $('#chartWindowDiv').css({
                'visibility': 'visible',
                'height': '800px',
                'width': '800px',
                'top': '50px',
                'left': '510px'
            });
            $("#chartWindowContent").addClass("content-loading");
        }  else {
            $("#chartWindowContent").addClass("content-loading");
        }

        
 
        $('#chartContainer').empty();
        //console.log('creating chart query');
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

        //$('#chartWindowDiv').addClass("content-loading");
        $('#chartTabContent').addClass("content-loading");
    }//END app.createChartQuery

    app.downloadChartPNG = function(){
    /*    Highcharts.exportChart({
            filename: 'ChartImage'
        });*/
    }
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

        //console.log('featureSort', featureSort);

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
        //appears to be stripping the last source value array off instead
        /***if ($('#groupResultsSelect')[0].selectedIndex == 0) {
            chartArr.pop(); // remove the last array of MRB_IDs  // TMR ADDED
        }***/
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
        /*if (sparrowLayerId == 0 || sparrowLayerId == 8) {
            labelArr[0] = "Name";
        }*/
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
        $("#toast-fixed").fadeOut();        
        $("#toast-fixed").css('opacity', '0');

        //Important! UPDATE if nutrient Models change names.
        if( $('.radio input[type="radio"]:checked')[0].id == 'radio1'){
            $('#chartWindowPanelTitle').text('Total Phosphorus ' + labelySelect() );
            //console.log("Radio One");
        }   else{
            $('#chartWindowPanelTitle').text('Total Nitrogen ' + labelySelect() );
            //console.log("Radio Two");
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
            $("#chartButton").html("Show Chart for All");
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
                                    this.renderer.image('https://wim.usgs.gov/visuals/usgs/usgslogo1.jpg', 2, 2, 50, 30).add();
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
                                /*{
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
                                },*/
                                {
                                    text: 'Change Background Transparency',
                                    onclick: function(){
                                        //check for rgba vs. rgb
                                        if(this.chartBackground.element.attributes.fill.value.substring(0,4) != 'rgba'){
                                            //this value should match the default value set above in Chart.BackgroundColor 
                                            this.chartBackground.attr({
                                                fill: 'rgba(255, 255, 255, .45)'
                                            });
                                        }else{
                                            this.chartBackground.attr({
                                                fill: 'rgb(255, 255, 255)'
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
        var height = $('#chartWindowDiv').height() - 65;
        var width = $('#chartWindowDiv').width();
        $('#chartWindowContainer').highcharts().setSize(width-50, height-105, true);
        $('#chartTabContent').removeClass("content-loading");
        //$('#chartWindowDiv').removeClass("content-loading");
        //$('#loadingDiv').removeClass("content-loading");

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
            headerKeyArr.push("Catchment Area");
            headerKeyArr.push("Upstream Area");
            headerKeyArr.push("Total");
        } else {
            headerKeyArr.push("Area");
            headerKeyArr.push("Total");
            
        }

        var htmlHeaderArr =  [];
        htmlHeaderArr.push("<tr>");
        $.each(headerKeyArr, function(index, key){
            //console.log(key);
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
                //comment in if changing back to PNAME
                //if (key !== "MRB_ID" && key !== "ST_MRB_ID") {
                    htmlArr.push('<td>'+ value +'</td>');
                //}
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
    // need data download chart in case they want to export png or csv
    app.createMiniChartQuery = function(optWhere){
        $('#miniChartContainer').empty();
        var chartQueryTask;
        var sparrowLayerId = app.map.getLayer('SparrowRanking').visibleLayers[0];

        if (optWhere == undefined){
            if (app.map.getLayer('SparrowRanking').layerDefinitions) var whereClause = app.map.getLayer('SparrowRanking').layerDefinitions[sparrowLayerId];
            else var whereClause = '1=1';
        } else {
            var whereClause = optWhere;
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

        chartQueryTask.execute(chartQuery, getDDChart);
    }
    // results of chartQueryTask for miniChart in data download modal so that user can print csv or png
    function getDDChart(response){
        var columnLabels = [];
        var chartTitle;
        var categories = [];
        var chartArr = [];
        var series = [];
        var featureSort = [];       

        $.each(response.features, function(index, feature){
            /***this function removes any fields ending with "AREA" from the response.features Object. (i.e. DEMIAREA, DEMTAREA, GP1_AREA, etc.)
            The chart was not built to accommodate the extra area fields, but they're necessary for display in the table.***/
            $.map(Object.keys(feature.attributes), function(val, i){
                //find ANY INDEX that contains "AREA" in the key
                if (val.indexOf("AREA") > -1) delete feature.attributes[val];
            });
            //push the feature attributes AFTER removing all the "AREA" atributes.
            featureSort.push(feature.attributes);
        });
        var sum = 0;
        $.each(featureSort, function(index, obj){
            $.each(obj, function(i, attribute){
                //don't try to sum up an strings or ID numbers
                //UPDATE important! -- if catchments ID field is returned make sure the correctly named field is in the catch below.
                if(jQuery.type(attribute) !== 'string' && i !== "MRB_ID") sum += attribute;
            });
            obj.total = sum;
            sum = 0;
        });
        featureSort.sort(function(a, b){
            return parseFloat(b.total) - parseFloat(a.total);
        });

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

        //UPDATE IMPORTANT!  Match labels with #groupResultsSelect indicies
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
            var label;
            var configObject = app.getLayerConfigObject(app.map.getLayer('SparrowRanking').visibleLayers[0]);
            $.each(configObject, function(index, object){
                if (object.field == $('#displayedMetricSelect').val()) label = object.name;                
            });
            return label;
        }
        var colorArr = ( $('.radio input[type="radio"]:checked')[0].id == 'radio1' ? phosColors  : nitroColors );
        var miniChart = $('#miniChartContainer').highcharts();

        $(function () {
            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                },
                colors: colorArr
            });
            var buttons = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
            
            $('#miniChartContainer').highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:'rgba(255, 255, 255, 0.45)',
                },
                title:{
                    text: $('.radio input[type="radio"]:checked')[0].id == 'radio1' ? 'Total Phosphorus' + labelySelect() : 'Total Nitrogen' + labelySelect()
                },
                subtitle:{
                    text: null
                },
                exporting:{
                    enabled: false,
                    chartOptions:{
                        chart:{
                            events:{
                                load:function(){
                                    this.chartBackground.attr({ fill: 'rgba(255, 255, 255, 1.0)' });
                                    this.renderer.image('https://wim.usgs.gov/visuals/usgs/usgslogo1.jpg', 2, 2, 50, 30).add();
                                }
                            }
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
                    }
                },
                credits: {
                    enabled: false
                },
                series: series
            });
                     
        }); //END self-invoking highcharts function
    } //END getDDChart()

    app.downloadPNGofChart = function() {
        $('#miniChartContainer').highcharts().exportChart({ type: 'PNG' });
    }
    app.downloadCSVofChart = function() {
        $('#miniChartContainer').highcharts().downloadCSV();
    }
    //get the chart that would show for the map as it is now, so that if user wants to download png of chart, it will be available
    function getMiniHighChart(){
        //check to see if custom click was performed
        if (app.userSelectedDispFieldName != "") {
            app.formattedHighlightString = app.userSelectedDispFieldName + " IN (" + app.userSelectedShapes.join(",") + ")";
            app.customChartClicked = true;
            //console.log("Custom Click: " + app.formattedHighlightString);
            app.createMiniChartQuery(app.formattedHighlightString);
            app.userSelectedDispFieldName = "";
            app.userSelectedShapes = [];
        } else {
            app.createMiniChartQuery();
        }
    }
    function showDataDownloadModal () {
        getMiniHighChart();
        $('#downloadDatamodal').modal('show');
    }
    $('#dataDownloadNav').click(function(){
        showDataDownloadModal();
    });

    function showAboutModal () {
        $("#aboutModalHeader").html('About ' + appTitle + ' ' + appVersion);
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
        /*** CAUSING SOME NASTY MESS WITH THE LEGEND DIV
        //app.maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
        //$('#legendDiv').css('max-height', app.maxLegendDivHeight);
        ***/
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
                    //find id, remove from legend
                    var ids = [];
                    $.each(app.legend.layerInfos, function(i, infos){
                        ids.push(infos.layer.id);
                    });

                    var index = ids.indexOf(layer.id);
                    if (index > -1){
                        app.legend.layerInfos.splice(index, 1);
                    }
                    app.legend.refresh();
                } else {
                    layer.setVisibility(true);
                    //add to legend.
                    app.legend.layerInfos.push({layer: layer, title: e.currentTarget.innerText});
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
                            //console.log("o: " + o);
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

function loadEventHandlers() {

     /*RADIO EVENTS*/
    $('.radio').on('change', function(e){
        $("#page-loader").fadeIn();

        var groupBySelectedIndex = $("#groupResultsSelect")[0].selectedIndex;
        var selectedRadio = this.firstElementChild.id;

        populateMetricOptions($("#groupResultsSelect")[0].selectedIndex);
        setAggregateGroup(groupBySelectedIndex, selectedRadio);
        generateRenderer();

        //reflow the chart if it's open
        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            //$("#toast_body").html("Chart updating");  
            //$("#toast-fixed").fadeIn();  
 
            app.createChartQuery();
        }

    });
    /*END RADIO EVENTS*/

    //UPDATE: important! make sure the file name is updated_____________________________________________________
    $("#phosphorusDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://test.wim.usgs.gov/SparrowGreatLakesV2/downloads/greatlakes_shapefiles_phosphorus.zip';
    });
    //UPDATE: important! make sure the file name is updated_____________________________________________________
    $("#nitrogenDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://test.wim.usgs.gov/SparrowGreatLakesV2/downloads/greatlakes_shapefiles_nitrogen.zip';
    });
    $("#phosphorusCalibrationDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://test.wim.usgs.gov/SparrowGreatLakesV2/downloads/greatlakes_phosphorus_calibration_sites.zip';
    });
    $("#nitrogenCalibrationDownload").click(function() {
        // hope the server sets Content-Disposition: attachment!
        window.location = 'https://test.wim.usgs.gov/SparrowGreatLakesV2/downloads/greatlakes_nitrogen_calibration_sites.zip';
    });
    $("#PNGChartDownload").click(function(){
        app.downloadPNGofChart();
    });
    $("#CSVChartDownload").click(function(){
        app.downloadCSVofChart();
    })
    $('#showMiniChart').click(function() {
        if ($("#miniChartContainer")[0].hidden == true){
            $("#miniChartContainer")[0].hidden = false;
            $('#showMiniChart').text('(Hide Chart)');
        } else {
            $("#miniChartContainer")[0].hidden = true;
            $('#showMiniChart').text('(Show Chart Example)');
        }
    })
    $("#showMiniChart").click(function(){
        $("#miniChartContainer").attr("hidden", )
    })
    $("#chartDownload").on('click', function() {
        app.downloadChartPNG();
    })
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
        $("#page-loader").fadeIn();
        generateRenderer();

        if( $("#chartWindowDiv").css("visibility") == "visible" ) {
            /*$("#toast_body").html("Chart updating");  
            $("#toast-fixed").fadeIn();*/
            app.createChartQuery();
        }
    });
    /*END METRIC EVENTS*/

    /* CLEAR AOI BUTTON EVENT */
    $("#clearAOIButton").on('click', function(){
        $("#page-loader").fadeIn();
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
           /* $("#toast_body").html("Chart updating");  
            $("#toast-fixed").fadeIn();*/
            app.createChartQuery();
        }        
        // remove all warnings if any
        $(".grp1-warning").remove();
        $(".grp2-warning").remove();
        $(".grp3-warning").remove();
        //loop through all options from group results by and enable all
        $('#groupResultsSelect option').each(function() {
            (this).disabled = false;
        });
        $('#groupResultsSelect').selectpicker('render');
    });
    /*END CLEAR AOI BUTTON EVENT */

    // called from within $('.nonAOISelect').on('change' function several times to append warning and clear contents of AOI when getting set to disabled
    function clearAOIandAppendWarning(warningId, cantShow, fromHere, thisSelect, anAOI){
        // 'grp2-warning', 'Tributary', 'HUC8', '#grp2-select option', 'AOI2');
        $("#clearAOIButton").append("<a class='" + warningId + "' data-toggle='tooltip' data-placement='top' title='Cannot show " + cantShow + " Area of Interest while grouping by " + fromHere + ".'>"+
                "<span class='glyphicon glyphicon-warning-sign'></span></a>");
        //has value, so unselect it, clear the app's LayerDefObj of this property & trigger AOIChange event
        $(thisSelect + ' option').attr("selected",false);
        app.clearOneLayerDefObj(anAOI); //clear out this one
        var newE2 = { currentTarget: {id: thisSelect, value: ""} }; //making an 'e' to pass along
        AOIChange(newE2); //go through the aoichange event to do the rest
    }
    /***TODO UPDATE IMPORTANT! -- THE CASES IN MRB3 ARE CORRECT, BUT THE LOGIC NEEDS TO BE REVISITED TO DETERMINE WHICH AOI COMBINATIONS NEED TO BE DISABLED****/
    $('.nonAOISelect').on('change', function(){
        $("#page-loader").fadeIn();
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

     app.map.on('update-end', function(){
       $("#page-loader").fadeOut(); 
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
} //END setAggregateGroup()

function AOIChange(e){
    $("#page-loader").fadeIn();
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
        $("#toast_body").html("Chart updating");  
        $("#toast-fixed").fadeIn();
        
        app.map.graphics.clear();
        app.createChartQuery();
    }   
} //END AOIChange()


function setLayerDefs(){
        var definitionString = "";
        var layerDefObj = app.getLayerDefObj();
        
        if (layerDefObj.AOIST){
            if(definitionString != "") {
                definitionString += " AND ST = "+ "'" + layerDefObj.AOIST + "'";
            } else {
               definitionString += "ST = "+ "'" + layerDefObj.AOIST + "'"; 
            }
        }
        if (layerDefObj.AOI1){
            if(definitionString != "") {
                definitionString += " AND GP1 = "+ "'" + layerDefObj.AOI1 + "'";
            } else {
                definitionString += "GP1 = "+ "'" + layerDefObj.AOI1 + "'";
            }
            
        }
        if (layerDefObj.AOI2){
            if(definitionString != "") {
               definitionString += " AND GP2 = "+ "'" + layerDefObj.AOI2 + "'";
            } else {
                definitionString += "GP2 = "+ "'" + layerDefObj.AOI2 + "'";
            }
        }
        /***TODO UPDATE IMPORTANT -- ADDED BUT NOT ***/
        if (layerDefObj.AOI3){
            if(definitionString != "") {
               definitionString += " AND GP3 = "+ "'" + layerDefObj.AOI3 + "'";
            } else {
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
            if (fields.attribute == removeField && (flatArr.map(function (f) { return f.field }).indexOf(removeField) < 0)) {
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


function getLegendLabels(sparrowLayerId){
    var label = "";
    var configObject = app.getLayerConfigObject(sparrowLayerId);
    var nutrientModel = sparrowLayerId < 8 ? 'Total Phosphorus' : 'Total Nitrogen';  //if layer id is less than 8 prefix with Phosphorus, else Nitrogen
    $.each(configObject, function(index, item){
        if( $("#displayedMetricSelect").val() == item.field ) {
            label = item.name;
        }
    });
    return nutrientModel + ', ' + label;

} //END getLegendLabels()

function getChartOutfields(sparrowLayerId){
    var chartFieldsArr = [];
    console.log("in GetChartOutfields()")
    var configObject = app.getLayerConfigObject(sparrowLayerId);
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
            finalChartArr.push("MRB_ID");             
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
            finalChartArr.push("ST_MRB_ID");
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

        //symbol WITHOUT borders
        //classDef.baseSymbol = new SimpleFillSymbol("solid", null, null);
        
        //symbol WITH borders
        classDef.baseSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([168,168,168]), 0.1)
                );
        
          
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
        generateRenderer.execute(params, processValues, errorHandler);

        function processValues(renderer){

            //calculate to 3 significant figures
            function sigFigures(n){
                if (n > 0 ){
                    var mult = Math.pow(10, 3 - Math.floor(Math.log(n) / Math.LN10) -1);
                    return Math.round(n * mult) / mult;
                } else{
                    return n;
                }
            }

            $.each(renderer.infos, function(index, info){
                //calculate sig figures
                var minVal = sigFigures(info.minValue);
                var maxVal = sigFigures(info.maxValue);

                //set new label
                if (index == 4){
                    //less than sign on the last label maxValue
                    var newLabel = minVal.toString() + " <";
                } else{
                    var newLabel = minVal.toString() + " - " + maxVal.toString();
                }
                renderer.infos[index].label = newLabel;
            });

            applyRenderer(renderer);
        }

        function applyRenderer(renderer){
            var sparrowId = app.map.getLayer('SparrowRanking').visibleLayers[0];
            var layer = app.map.getLayer('SparrowRanking');

            

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
            } else {
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
            $("#page-loader").fadeOut(); 
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
        //$("#page-loader").fadeOut(); 
    }); // END Dojo
} //END generateRenderer()