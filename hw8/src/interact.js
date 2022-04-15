var data = [];

// 加载数据
d3.csv("hotel.csv", function (d) {
    data.push(d);
}).then(function () {
    // https://biaoyansu.com/29.23

    mb = new MonthBrush(600, 200, 30, '#brush')
        .data(data, 'occupancy');

    female = new PieChart(250, 250, 60, '#female')
        .data(data, ['female']);
    female.render();

    home = new RadarChart(200, 200, 40, '#home')
        .data(data, ["local", "USA", "SA", "EU", "MEA", "ASIA"]);
    home.render();

    busi = new PieChart(250, 250, 60, "#busi")
        .data(data, ["businessmen", "tourists"]);
    busi.render();

    reserv = new PieChart(250, 250, 60, "#reserv")
        .data(data, ["DR", "agency", "AC"]);
    reserv.render();

    age = new Histogram(250, 200, 30, "#age")
        .data(data, ['u20', '20to35', '35to55', 'm55']);
    age.render();

    para = new Parallel(1000, 250, 30, "#para")
        .data(data, [
                'female', 'local', 'USA', 'SA', 'EU', 'MEA', 'ASIA',
                'businessmen', 'tourists', 'DR', 'agency', 'AC',
                'u20', '20to35', '35to55', 'm55']);
    para.render();

    var cols = ['price', 'LoS', 'occupancy', 'conventions']
    // 'female', 'local', 'USA', 'SA', 'EU', 'MEA', 'ASIA',
    // 'businessmen', 'tourists', 'DR', 'agency', 'AC',
    // 'u20', '20to35', '35to55', 'm55'];

    season = new SeasonChart(400, 200, 30, '#season')
        .data(data, cols);
    season.render();

    legend = new Legend(200, 100, 30, '#legend')
        .cols(cols);
    legend.render();

    mb.subscribe(female);
    mb.subscribe(home);
    mb.subscribe(busi);
    mb.subscribe(reserv);
    mb.subscribe(age);
    mb.subscribe(para);
    mb.subscribe(season);
    legend.subscribe(para);
    legend.subscribe(season);
    mb.render();
});
