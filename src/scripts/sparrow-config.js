/*
CONFIG FILE FOR USE WITH mrb3_tp_new_mapper_files2
currently no Nitrogen files.
Use this with MRB3v2 map services http://gis.wim.usgs.gov/arcgis/rest/services/SparrowMRB3V2/SparrowMRB3/MapServer
prior to data update on 3/17/2017
*/

var serviceBaseURL = "https://gis.wim.usgs.gov/arcgis/rest/services/SparrowGreatLakesV2/SparrowGreatLakes/MapServer/"; //important! UPDATE rest service URL
var chartUnits = " (kg/yr.)"

var groupResultsInitIndex = 1; //sets the default layer for the application.  In this case service layer 1 == HUC8.

var splitLayers = [5,6,7,13,14,15]; //important! UPDATE layer Ids of all state split layers

var mapCenter = [-87, 42];
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
    mrb_id : "SPARROW Reach ID",
    st_mrb_id: "SPARROW Reach ID by State",
    pname : "Reach Name",
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
    mrb_id : "SPARROW Reach ID",
    st_mrb_id: "SPARROW Reach ID by State",
    pname : "Reach Name",
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
    area : "aggregated area (km2)",
    al : "aggregated load (kg)",
    ay : "aggregated yield (kg/km2)" ,
    dal : "delivered aggregated load (kg)",
    day : "delivered aggregated yield (kg/km2)",
    ap : "percent of aggregated load",
    dap: "percent of delivered aggregated load"
}

var phosphorusSourceDefinitons = {
    s1 : "Urban Land",
    s2 : "Sewerage Point Sources",
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
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.accl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCL_S1", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCL_S6", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.incl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname }, 
            { attribute: "INCL_S1", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCL_S6", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.accy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accy + ' all sources'}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.incy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "INCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incy + ' all sources'}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.daccl,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCL", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccl + ' all sources'}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.daccy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccy + ' all sources'}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.dincl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCL_S1", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCL_S6", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions.mrb_id + " " + catchmentDefinitions.dincy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincy + ' all sources'}
        ]
    }

]

//HUC8 Metric choices, service Id 1
var Group3 = [    
    {
        field: "GP3_AL", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AL_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AL_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AL_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AL_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AL_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AL_S6", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAL", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAL_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAL_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAL_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAL_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAL_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAL_S6", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP3_AY", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AY_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_AY_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_AY_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_AY_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_AY_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_AY_S6", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP3_DAY", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAY_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP3_DAY_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP3_DAY_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP3_DAY_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP3_DAY_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP3_DAY_S6", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

//HUC8 Metric choices, Service Id 1
var Group2 = [
    {
        field: "GP2_AL", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AL_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_AL_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_AL_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_AL_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_AL_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_AL_S6", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP2_DAL", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAL_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_DAL_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_DAL_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_DAL_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_DAL_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_DAL_S6", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP2_AY", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AY_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_AY_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_AY_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_AY_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_AY_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_AY_S6", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP2_DAY", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAY_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP2_DAY_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP2_DAY_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP2_DAY_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP2_DAY_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP2_DAY_S6", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group1 = [
    {
        field: "GP1_AL", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AL_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_AL_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_AL_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_AL_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_AL_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_AL_S6", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP1_DAL", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAL_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_DAL_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_DAL_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_DAL_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_DAL_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_DAL_S6", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "GP1_AY", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AY_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_AY_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_AY_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_AY_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_AY_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_AY_S6", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "GP1_DAY", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAY_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "GP1_DAY_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "GP1_DAY_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "GP1_DAY_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "GP1_DAY_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "GP1_DAY_S6", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var ST = [
    {
        field: "ST_AL", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AL_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_AL_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_AL_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_AL_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_AL_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_AL_S6", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "ST_DAL", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAL_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_DAL_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_DAL_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_DAL_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_DAL_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_DAL_S6", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ST_AY", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AY_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_AY_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_AY_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_AY_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_AY_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_AY_S6", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "ST_DAY", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAY_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ST_DAY_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ST_DAY_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ST_DAY_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ST_DAY_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ST_DAY_S6", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Catchments_st = [
    {
        field: "ACCL", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.accl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCL_S1", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "ACCL_S6", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.accl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.incl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname }, 
            { attribute: "INCL_S1", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "INCL_S6", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.incl + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.accy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accy + ' all sources'}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.incy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "INCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incy + ' all sources'}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.daccl,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCL", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccl + ' all sources'}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.daccy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccy + ' all sources'}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.dincl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCL_S1", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "DINCL_S6", label: catchmentDefinitions.st_mrb_id + ' ' + catchmentDefinitions.dincl + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions.st_mrb_id + " " + catchmentDefinitions.dincy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincy + ' all sources'}
        ]
    }
]

var Group3_st = [
    {
        field: "SG3_AL", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AL_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_AL_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_AL_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_AL_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_AL_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_AL_S6", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG3_DAL", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAL_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_DAL_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_DAL_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_DAL_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_DAL_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_DAL_S6", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG3_AY", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AY_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_AY_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_AY_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_AY_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_AY_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_AY_S6", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG3_DAY", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAY_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG3_DAY_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG3_DAY_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG3_DAY_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG3_DAY_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG3_DAY_S6", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group2_st = [
    {
        field: "SG2_AL", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AL_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_AL_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_AL_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_AL_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_AL_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_AL_S6", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG2_DAL", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAL_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_DAL_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_DAL_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_DAL_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_DAL_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_DAL_S6", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG2_AY", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AY_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_AY_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_AY_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_AY_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_AY_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_AY_S6", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG2_DAY", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAY_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG2_DAY_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG2_DAY_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG2_DAY_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG2_DAY_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG2_DAY_S6", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]

var Group1_st = [
    {
        field: "SG1_AL", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AL_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_AL_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_AL_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_AL_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_AL_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_AL_S6", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG1_DAL", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAL_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_DAL_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_DAL_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_DAL_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_DAL_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_DAL_S6", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + phosphorusSourceDefinitons.s6}
        ] 
    },
    {
        field: "SG1_AY", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AY_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_AY_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_AY_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_AY_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_AY_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_AY_S6", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + phosphorusSourceDefinitons.s6}
        ]
    },
    {
        field: "SG1_DAY", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAY_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s1},
            { attribute: "SG1_DAY_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s2},
            { attribute: "SG1_DAY_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s3},
            { attribute: "SG1_DAY_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s4},
            { attribute: "SG1_DAY_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s5},
            { attribute: "SG1_DAY_S6", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + phosphorusSourceDefinitons.s6}
        ]
    }
]
////END PHOSPHORUS LAYER GROUPS______________________________________________________________________________________________________________________________

////BEGIN NITROGEN LAYER GROUPS______________________________________________________________________________________________________________________________
//Catchments NITRO
var Catchments_tn = [
    {
        field: "ACCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.accl, 
        chartOutfields: [
            { attribute: "PNAME",  label: catchmentDefinitions.pname },
            { attribute: "ACCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.incl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname }, 
            { attribute: "INCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.accy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accy + ' all sources'}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.incy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "INCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incy + ' all sources'}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.daccl,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCL", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccl + ' all sources'}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.daccy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccy + ' all sources'}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.dincl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.dincy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincy + ' all sources'}
        ]
    }
]

var Group3_tn = [
    {
        field: "GP3_AL", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AL_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_AL_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_AL_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_AL_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_AL_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP3_DAL", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAL_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_DAL_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_DAL_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_DAL_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_DAL_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "GP3_AY", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_AY_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_AY_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_AY_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_AY_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_AY_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP3_DAY", 
        name: aggregateDefinitions.gp3 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP3", label: aggregateDefinitions.gp3 }, 
            { attribute: "GP3_DAY_S1", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP3_DAY_S2", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP3_DAY_S3", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP3_DAY_S4", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP3_DAY_S5", label: aggregateDefinitions.gp3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

//HUC8 Metric choices, Service Id 1
var Group2_tn = [
    {
        field: "GP2_AL", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AL_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_AL_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_AL_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_AL_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_AL_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP2_DAL", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAL_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_DAL_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_DAL_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_DAL_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_DAL_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "GP2_AY", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_AY_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_AY_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_AY_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_AY_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_AY_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP2_DAY", 
        name: aggregateDefinitions.gp2 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP2", label: aggregateDefinitions.gp2 }, 
            { attribute: "GP2_DAY_S1", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP2_DAY_S2", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP2_DAY_S3", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP2_DAY_S4", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP2_DAY_S5", label: aggregateDefinitions.gp2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

//independent watershed Metric choices, Service ID 2
var Group1_tn = [
    {
        field: "GP1_AL", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AL_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_AL_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_AL_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_AL_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_AL_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "GP1_DAL", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAL_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_DAL_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_DAL_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_DAL_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_DAL_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "GP1_AY", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_AY_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_AY_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_AY_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_AY_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_AY_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "GP1_DAY", 
        name: aggregateDefinitions.gp1 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "GP1", label: aggregateDefinitions.gp1 }, 
            { attribute: "GP1_DAY_S1", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "GP1_DAY_S2", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "GP1_DAY_S3", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "GP1_DAY_S4", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "GP1_DAY_S5", label: aggregateDefinitions.gp1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var ST_tn = [
    {
        field: "ST_AL", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AL_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_AL_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_AL_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_AL_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_AL_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "ST_DAL", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAL_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_DAL_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_DAL_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_DAL_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_DAL_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "ST_AY", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_AY_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_AY_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_AY_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_AY_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_AY_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "ST_DAY", 
        name: aggregateDefinitions.st + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "ST", label: aggregateDefinitions.st }, 
            { attribute: "ST_DAY_S1", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ST_DAY_S2", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ST_DAY_S3", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ST_DAY_S4", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ST_DAY_S5", label: aggregateDefinitions.st + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
    }
]

var Catchments_st_tn = [
    {
        field: "ACCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.accl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "ACCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "ACCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "ACCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "ACCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.accl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "INCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.incl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname }, 
            { attribute: "INCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "INCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "INCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "INCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "INCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.incl + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "ACCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.accy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "ACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.accy + ' all sources'}
        ]
    },
    {
        field: "INCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.incy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "INCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.incy + ' all sources'}
        ]
    },
    {
        field: "DACCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.daccl,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCL", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccl + ' all sources'}
        ]
    },
    {
        field: "DACCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.daccy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DACCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.daccy + ' all sources'}
        ]
    },
    {
        field: "DINCL", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.dincl, 
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCL_S1", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "DINCL_S2", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "DINCL_S3", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "DINCL_S4", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "DINCL_S5", label: catchmentDefinitions_tn.mrb_id + ' ' + catchmentDefinitions_tn.dincl + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "DINCY", 
        name: catchmentDefinitions_tn.mrb_id + " " + catchmentDefinitions_tn.dincy,
        chartOutfields: [
            { attribute: "PNAME", label: catchmentDefinitions.pname },
            { attribute: "DINCY", label: catchmentDefinitions.mrb_id + ' ' + catchmentDefinitions.dincy + ' all sources'}
        ]
    }
]

var Group3_st_tn = [
    {
        field: "SG3_AL", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AL_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_AL_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_AL_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_AL_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_AL_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG3_DAL", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAL_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_DAL_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_DAL_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_DAL_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_DAL_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}
        ] 
    },
    {
        field: "SG3_AY", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_AY_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_AY_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_AY_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_AY_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_AY_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG3_DAY", 
        name: aggregateDefinitions.sg3 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG3", label: aggregateDefinitions.sg3 }, 
            { attribute: "SG3_DAY_S1", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG3_DAY_S2", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG3_DAY_S3", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG3_DAY_S4", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG3_DAY_S5", label: aggregateDefinitions.sg3 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}
        ]
    }
]

var Group2_st_tn = [
   {
        field: "SG2_AL", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AL_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_AL_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_AL_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_AL_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_AL_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}
        ]
    },
    {
        field: "SG2_DAL", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAL_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_DAL_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_DAL_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_DAL_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_DAL_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "SG2_AY", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_AY_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_AY_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_AY_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_AY_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_AY_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5},        ]
    },
    {
        field: "SG2_DAY", 
        name: aggregateDefinitions.sg2 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG2", label: aggregateDefinitions.sg2 }, 
            { attribute: "SG2_DAY_S1", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG2_DAY_S2", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG2_DAY_S3", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG2_DAY_S4", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG2_DAY_S5", label: aggregateDefinitions.sg2 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
    }
]

var Group1_st_tn = [
    {
        field: "SG1_AL", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.al, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AL_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_AL_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_AL_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_AL_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_AL_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.al + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "SG1_DAL", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.dal, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAL_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_DAL_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_DAL_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_DAL_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_DAL_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.dal + ' ' + nitrogenSourceDefinitions.s5}        ] 
    },
    {
        field: "SG1_AY", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.ay, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_AY_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_AY_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_AY_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_AY_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_AY_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.ay + ' ' + nitrogenSourceDefinitions.s5}        ]
    },
    {
        field: "SG1_DAY", 
        name: aggregateDefinitions.sg1 + " " + mappedDefinitions.day, 
        chartOutfields: [
            { attribute: "SG1", label: aggregateDefinitions.sg1 }, 
            { attribute: "SG1_DAY_S1", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s1},
            { attribute: "SG1_DAY_S2", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s2},
            { attribute: "SG1_DAY_S3", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s3},
            { attribute: "SG1_DAY_S4", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s4},
            { attribute: "SG1_DAY_S5", label: aggregateDefinitions.sg1 + ' ' + mappedDefinitions.day + ' ' + nitrogenSourceDefinitions.s5}        ]
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
 