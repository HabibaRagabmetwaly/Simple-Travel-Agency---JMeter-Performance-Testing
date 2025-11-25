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

    var data = {"OkPercent": 99.01768172888016, "KoPercent": 0.9823182711198428};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6036525172754196, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5776515151515151, 500, 1500, "TC01-255"], "isController": false}, {"data": [0.5967741935483871, 500, 1500, "TC03_SelectFlight"], "isController": true}, {"data": [0.5967741935483871, 500, 1500, "TC03-273"], "isController": false}, {"data": [0.5776515151515151, 500, 1500, "TC01_Hompage"], "isController": true}, {"data": [0.6159695817490495, 500, 1500, "TC02_SearcjFlight"], "isController": true}, {"data": [0.6260504201680672, 500, 1500, "TC04-299"], "isController": false}, {"data": [0.6159695817490495, 500, 1500, "TC01-264"], "isController": false}, {"data": [0.6260504201680672, 500, 1500, "TC04_PurchaceAndConfrnation"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1018, 10, 0.9823182711198428, 1128.6905697445968, 107, 163316, 652.5, 1370.3000000000002, 1685.3999999999996, 2836.369999999996, 2.999375375658507, 7.05174260891887, 1.9152570342055486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TC01-255", 264, 1, 0.3787878787878788, 1491.147727272727, 305, 159272, 653.0, 1505.0, 2319.75, 9010.950000000339, 0.7778547120611676, 1.7361114308180734, 0.3602112766835104], "isController": false}, {"data": ["TC03_SelectFlight", 248, 2, 0.8064516129032258, 851.5645161290319, 325, 10157, 663.5, 1427.2, 1771.2999999999988, 6036.229999999932, 0.7543955709679382, 1.8991487858946279, 0.5159258646650848], "isController": true}, {"data": ["TC03-273", 248, 2, 0.8064516129032258, 775.7903225806447, 292, 2225, 661.0, 1388.3999999999999, 1715.5499999999993, 2120.24, 0.7765531062124248, 1.9549291454001754, 0.5310792483404309], "isController": false}, {"data": ["TC01_Hompage", 264, 1, 0.3787878787878788, 1506.465909090909, 305, 163316, 653.0, 1505.0, 2319.75, 9010.950000000339, 0.7684806497154584, 1.7151892501855706, 0.3558703079744422], "isController": true}, {"data": ["TC02_SearcjFlight", 263, 0, 0.0, 772.3041825095056, 297, 3838, 669.0, 1282.8, 1555.3999999999999, 2516.9200000000073, 0.8038634349115138, 1.8636831339594093, 0.5157600358758443], "isController": true}, {"data": ["TC04-299", 238, 2, 0.8403361344537815, 709.7689075630251, 107, 1934, 617.0, 1227.1999999999998, 1470.25, 1835.2899999999986, 0.7555027902813137, 1.7581485380386133, 0.6013716899137204], "isController": false}, {"data": ["TC01-264", 263, 0, 0.0, 772.3041825095055, 297, 3838, 669.0, 1282.8, 1555.3999999999999, 2516.9200000000073, 0.8036939362362066, 1.8632901669345647, 0.5156512852609255], "isController": false}, {"data": ["TC04_PurchaceAndConfrnation", 238, 2, 0.8403361344537815, 739.9201680672268, 323, 4023, 623.0, 1259.4, 1511.4499999999998, 3019.1899999999737, 0.7470205493425905, 1.7384093131177436, 0.594619921908104], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, 40.0, 0.3929273084479371], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException", 5, 50.0, 0.4911591355599214], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, 10.0, 0.09823182711198428], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1018, 10, "Non HTTP response code: java.net.SocketException", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["TC01-255", 264, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TC03_SelectFlight", 2, 2, "Non HTTP response code: java.net.SocketException", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TC03-273", 248, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TC01_Hompage", 1, 1, "Non HTTP response code: java.net.SocketException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["TC04-299", 238, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["TC04_PurchaceAndConfrnation", 2, 2, "Non HTTP response code: java.net.SocketException", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
