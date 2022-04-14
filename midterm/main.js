var data = [];

/**
 * 转换字符串值为数值
 * @param {[{String: String}]} data 
 * @returns [{String: number}]
 */
function numberize(data, cols) {
    data.forEach((d, i) => {
        cols.forEach(col => {
            data[i][col] = Number(d[col]);
        })
    })
    return data;
}

// 加载数据
d3.csv("hotel.csv", function (d) {
    data.push(d);
}).then(function () {

    var cols = [
        'female', 'local', 'USA', 'SA', 'EU', 'MEA', 'ASIA',
        'businessmen', 'tourists', 'DR', 'agency', 'AC',
        'u20', '20to35', '35to55', 'm55',
        'price', 'LoS', 'occupancy', 'conventions'
    ];

    data = numberize(data, cols);

    var pc = new PunchCard('#left')
        .data(data, cols);
    pc.render();

    var categories = {
        "Area" : ["local", "USA", "SA", "EU", "MEA", "ASIA"],
        "Group": ["businessmen","tourists"],
        "Reservation": ["DR","agency","AC"],
        "Clients' age": ["u20", "20to35", "35to55", "m55"],
        "Gender": ["female"],
        "Occupancy": ["occupancy"]
    };

    var sb = new StackedBar('#right', 500, 300, 30, 90).data(data, categories);
    sb.render();

    window.addEventListener('resize', function () {
        pc.resize();
        sb.resize();
    })

});