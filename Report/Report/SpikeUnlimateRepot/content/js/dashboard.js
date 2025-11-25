/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.46351931330472, "KoPercent": 0.5364806866952789};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5262405554421075, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.31992084432717677, 500, 1500, "TC01-255"], "isController": false}, {"data": [0.4719551282051282, 500, 1500, "TC03_SelectFlight"], "isController": true}, {"data": [0.4737704918032787, 500, 1500, "TC03-273"], "isController": false}, {"data": [0.33247089262613194, 500, 1500, "TC01_Hompage"], "isController": true}, {"data": [0.6599462365591398, 500, 1500, "TC02_SearcjFlight"], "isController": true}, {"data": [0.7117346938775511, 500, 1500, "TC04-299"], "isController": false}, {"data": [0.6060126582278481, 500, 1500, "TC01-264"], "isController": false}, {"data": [0.8580357142857142, 500, 1500, "TC04_PurchaceAndConfrnation"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2796, 15, 0.5364806866952789, 1468.628040057227, 0, 111270, 771.0, 1915.3000000000002, 3760.0500000000025, 15785.240000000002, 17.880553299524845, 34.373518647159635, 8.932045523946256], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TC01-255", 758, 12, 1.5831134564643798, 2202.461741424802, 182, 102630, 1191.0, 2423.1000000000004, 4718.199999999904, 22971.23, 5.182020167492737, 11.64511808878824, 2.3706951803110576], "isController": false}, {"data": ["TC03_SelectFlight", 624, 0, 0.0, 1898.0112179487178, 0, 12795, 1189.5, 2815.0, 10893.75, 12437.25, 5.552144782852414, 13.592421605984573, 3.7420602216409082], "isController": true}, {"data": ["TC03-273", 610, 0, 0.0, 1174.3672131147553, 307, 3429, 1197.5, 1780.3999999999992, 2455.7499999999977, 3342.1299999999997, 5.42931652915365, 13.596776871779126, 3.7432592476391378], "isController": false}, {"data": ["TC01_Hompage", 773, 12, 1.5523932729624839, 2175.4514877102174, 0, 106685, 1171.0, 2418.8, 4616.299999999999, 22970.78, 5.138602672339294, 11.323470374509737, 2.3052146347138205], "isController": true}, {"data": ["TC02_SearcjFlight", 744, 1, 0.13440860215053763, 869.854838709677, 0, 111270, 591.0, 1317.5, 1515.0, 9111.549999999997, 4.799102103477414, 9.419640085484007, 2.6114506701165587], "isController": true}, {"data": ["TC04-299", 196, 0, 0.0, 607.8418367346936, 317, 2144, 520.0, 923.6000000000001, 1261.649999999996, 1839.4200000000003, 1.7452317774651398, 4.032318091865083, 1.4009575401136183], "isController": false}, {"data": ["TC01-264", 632, 1, 0.15822784810126583, 914.1392405063289, 294, 102618, 644.0, 1345.9000000000003, 1515.0, 1851.3799999999994, 4.317293767248682, 9.975663188324862, 2.7655995432514957], "isController": false}, {"data": ["TC04_PurchaceAndConfrnation", 560, 0, 0.0, 431.480357142857, 0, 4857, 0.0, 898.9000000000003, 4053.499999999999, 4318.329999999999, 4.987442332698028, 4.033179989891523, 1.401256991325413], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, 86.66666666666667, 0.46494992846924177], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException", 2, 13.333333333333334, 0.0715307582260372], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2796, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "Non HTTP response code: java.net.SocketException", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["TC01-255", 758, 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TC01_Hompage", 18, 1, "Non HTTP response code: java.net.SocketException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TC02_SearcjFlight", 120, 1, "Non HTTP response code: java.net.SocketException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["TC01-264", 632, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
