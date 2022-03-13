var tableEl = $('#tableHotelData')

function headCell(cellData){
    // 表头单元格
    return $('<th><div class="cell">' + cellData + '</div></th>');
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
                row.append(headCell(dataTable[0][j]));
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