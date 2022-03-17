var tableEl = $('#tableHotelData');

var chart = echarts.init(document.getElementById('chart'));

var translation = {
    "DR": "direct reservations",
    "agency": "agency reservations",
    "AC": "air crews",
    "u20": "clients under 20 years",
    "20to35": "clients 20-35 years",
    "35to55": "clients 35-55 years",
    "m55": "clients more than 55 years",
    "price": "price of rooms",
    "LoS": "length of stay",
}

var selectedcolind = -1;

function visualize(){
    // 展示数据

    var allrows = tableEl.children();
    var header = $(allrows[0]).children().eq(selectedcolind).children('.cell')[0];
    var colname = $(header).text();
    colname = translation[colname] || colname;
    var rows = $(allrows[0]).siblings();
    
    var inddata = [];
    var coldata = [];
    for (let row of rows){
        inddata.push(parseInt($($(row).children().eq(0).children('.cell')[0]).text()));
        coldata.push(parseFloat($($(row).children().eq(selectedcolind).children('.cell')[0]).text()));
    }

    var option = {
        title: {
            text: colname
        },
        xAxis: {
            type: 'category',
            data: inddata,
        },
        yAxis: {
            type: 'value',
            splitline: {
                show: true,
            },
            axisline: {
                show: true,
            }
        },
        series: [
            {
                data: coldata,
                type: 'bar'
            },
            {
                data: coldata,
                type: 'line',
                color: 'darkblue',
            }
        ]
    };
    chart.setOption(option);
}

function headCell(cellData, selectable=false){
    // 表头单元格
    var texthead = $('<th><div class="cell">' + cellData + '</div></th>');
    if (selectable){
        texthead.addClass('cellColSelect');
        texthead.on("click", function(){
            tableEl.find('.cellColSelected').removeClass('cellColSelected');
            var colind = $(this).parent().children().index(this);
            var allrows = tableEl.children();
            for (let row of allrows)
                $($(row).children().eq(colind)).addClass('cellColSelected');

            selectedcolind = colind;
            visualize();
        });
    }
    return texthead;
}

function dataCell(cellData){
    // 返回可以修改数据的单元格
    var cell = $('<td></td>');
    
    var cellDis = $('<div class="cell dis">' + cellData + '</div>');
    cellDis.on("click", function(){
        $(this).siblings('.cellMod').show().select();
        $(this).hide();
    });
    cell.append(cellDis);

    var cellMod = $('<input type="text" class="cellMod">').val(cellData);
    cellMod.on("keydown", function(e){
        if (e.key == 'Enter'){
            $(this).siblings('.cell').text($(this).val()).show();
            $(this).hide();

            var pcell = $(this).parent();
            var colind = pcell.parent().children().index(pcell); 
            if (selectedcolind == colind // 该列是否被选中
                    || colind == 0 )    // 或本列为索引列
                {
                 // 刷新统计图
                 visualize();
            }
        }
    });
    cell.append(cellMod);
    
    return cell;
}

function deleteRowCell(){
    // 返回删除按钮。
    var deleteRowCell = $('<td>')
    var deleteLabel = $('<div class="cellDel">删除</div>')
    deleteLabel.on('click', function(){
        $(this).parent().parent().remove();
        visualize();
    });
    deleteRowCell.append(deleteLabel);
    return deleteRowCell;
}

function showData(dataTable){
    // 将 dataTable 的数据展示。
    tableEl.empty();
    for (var i in dataTable){
        var row = $("<tr></tr>");
        if (i == 0){
            row.append(headCell("month")); 
            for (var j in dataTable[0])
                row.append(headCell(dataTable[0][j],true));
            row.append(headCell("操作"));
        }
        else{
            row.append(dataCell(i));
            for (var j in dataTable[i])
                row.append(dataCell(dataTable[i][j]));
            row.append(deleteRowCell());
        }
        tableEl.append(row);
    }
}

function loadData(dataFile){
    // 获取数据。
    $.get(dataFile,function(data){
        var dataTable = [];
        dataLines = data.split(/\r?\n/);
        for (let line of dataLines)
            dataTable.push(line.split(','));
        showData(dataTable);
    });
}

function addRow(){
    // 添加行。
    var newRow = $("<tr></tr>");
    var colnum = tableEl.children()[0].children.length - 1;
    newRow.append(dataCell("*"));
    for (var j = 1; j < colnum; ++j)
        newRow.append(dataCell("*"));
    newRow.append(deleteRowCell());
    tableEl.append(newRow);
}

function saveData(){
    // 保存文件。
    output_csv = ""
    for (let row of tableEl.children()){
        var j = 0;
        for (let col of $(row).children()){
            for (let celldata of $(col).children(".cell")){
                if (j == 1)
                    output_csv += $(celldata).text();
                else if (j > 0)
                    output_csv += "," + $(celldata).text();
                ++j;
            }
        }
        output_csv += "\r\n";
    }
    let downLink = document.createElement('a')
    downLink.download = "hotel.csv"
    let blob = new Blob([output_csv])
    downLink.href = URL.createObjectURL(blob)
    document.body.appendChild(downLink)
    downLink.click()
    document.body.removeChild(downLink)
}

loadData('hotel.csv');