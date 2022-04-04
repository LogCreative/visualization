var data = [];

// 可视化数据

var selected_data;

// Pie Chart - reservation
var pie_cols = ['businessmen','tourists'];
var pie_width = 450, pie_height = 450, pie_margin = 40;
var pie_radius = Math.min(pie_width, pie_height) / 2 - pie_margin;
var pie_svg = d3.select('#reserv')
            .append('svg')
                .attr('width', pie_width)
                .attr('height', pie_height)
            .append('g')
                .attr('transform', 'translate(' + pie_width / 2 + ',' + pie_height / 2 + ')');
var pie_color = d3.scaleOrdinal()
                .domain(pie_cols)
                .range(d3.schemeDark2);

function piechart(pie_selected){
    var pie = d3.pie()
                .value(function(d) { return d[1]; });
    var data_ready = pie(Object.entries(pie_selected));
    var arcGenerator = d3.arc().innerRadius(0).outerRadius(pie_radius);

    pie_svg.selectAll('path').data(data_ready)
        .join('path')
        .transition()
        .duration(1000)
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return pie_color(d.data[0]); })
        .attr('stroke', 'white')
        .style('stroke-width', '2px');
    
    pie_svg.selectAll('text').data(data_ready)
        .join('text')
        .transition()
        .duration(1000)
        .text(function (d) { return d.data[0] })
        .attr("transform", function (d) {
            return `translate(${arcGenerator.centroid(d)})`
        })
        .style("text-anchor", "middle")
        .style("font-size", 17);
}


// Radar - Local
var radar_cols = ['local','USA','SA','EU','MEA','ASIA'];

var radar_width = 450, radar_height = 450, radar_margin = 20;
var radar_svg = d3.select('#geo')
                    .append('svg')
                        .attr('width', radar_width)
                        .attr('height', radar_height)
                    .append('g')
                        .attr('transform', 'translate(' + radar_width / 2 + ',' + radar_height / 2 + ')');

var radar_radius = Math.min(radar_width, radar_height) / 2 - radar_margin * 2;
var radar_x = d3.scaleBand().range([0, 2 * Math.PI]).align(0).domain(radar_cols);
var radar_y = d3.scaleLinear().range([0, radar_radius]).domain([0, 100]);

var radar_bg = radar_svg.append('g')

var portions = 5;
webs = []
for (var i = portions; i > 0; i--){
    web = '';
    for (let col of radar_cols){
        var angle = radar_x(col);
        var inner_radius = radar_radius * i / portions 
        var x = inner_radius * Math.sin(angle);
        var y = inner_radius * Math.cos(angle);
        web += x + ',' + y + ' ';
    }
    webs.push(web);
}
webPoints = webs[0].split(' ');
webPoints.pop();
radar_bg.selectAll('polygon').data(webs)
            .enter().append('polygon')
            .attr('points', function(d) {return d;})
            .style('fill','transparent')
            .attr('stroke', 'gray');
radar_bg.selectAll('line').data(webPoints)
            .enter().append('line')
            .attr('x1',0).attr('y1',0)
            .attr('x2', function(d) { return d.split(',')[0]; })
            .attr('y2', function(d) { return d.split(',')[1]; })
            .attr('stroke', 'gray');
radar_bg.selectAll('text').data(radar_cols)
            .enter().append('text')
            .text(function(d) {return d;})
            .attr('x', function(d){return (radar_radius + 20) * Math.sin(radar_x(d));})
            .attr('y', function(d){return (radar_radius + 20) * Math.cos(radar_x(d));})
            .style('text-anchor','middle');

var radar_data = radar_svg.append('g');

function radarchart(radar_selected){
    var data_area = '';
    for (let col of radar_cols){
        var data_radius = radar_y(radar_selected[col]);
        var x = data_radius * Math.sin(radar_x(col));
        var y = data_radius * Math.cos(radar_x(col));
        data_area += x + ',' + y + ' ';
    }
    radar_data.selectAll('polygon').data([data_area])
        .join('polygon').transition().duration(1000)
        .attr('points', function(d) { return d; })
        .attr('stroke', 'darkblue')
        .attr('stroke-width', 1.5)
        .style('fill', 'blue')
        .style('opacity', 0.75);
    data_points = data_area.split(' ');
    data_points.pop();
    radar_data.selectAll('circle').data(data_points)
        .join('circle').transition().duration(1000)
        .attr('cx', function(d) { return d.split(',')[0]; })
        .attr('cy', function(d) { return d.split(',')[1]; })
        .attr('r', 3)
        .attr('stroke', 'darkblue')
        .style('fill', 'white');
}

// Histogram - Age

var hist_width = 450, hist_height = 300, hist_margin = 20;

var hist_svg = d3.select('#age')
                .append('svg')
                    .attr('width', hist_width)
                    .attr('height', hist_height)
                .append('g')
                    .attr('transform', 'translate(' + hist_margin + ',' + hist_margin + ')');

hist_width = hist_width - hist_margin * 2;
hist_height = hist_height - hist_margin * 2;

var xScale = d3.scaleLinear()
            .domain([0,70])
            .range([0, hist_width]);
hist_svg.append('g')
        .attr('transform', `translate(0,${hist_height})`)
        .call(d3.axisBottom(xScale));
var yScale = d3.scaleLinear()
            .range([hist_height, 0]);
var yAxis = hist_svg.append('g');

function histchart(hist_selected){

    yScale.domain([0, d3.max(hist_selected.map((d)=>{return d[0];}))]);
    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    var u = hist_svg.selectAll("rect")
                    .data(hist_selected);
    u.join("rect")
        .transition()
        .duration(1000)
            .attr('x', function(d){
                return xScale(d[1]);
            })
            .attr('y', function(d){
                return yScale(d[0]);
            })
            .attr('width', function(d){
                return xScale(d[2]) - xScale(d[1]);
            })
            .attr('height', function(d){
                return hist_height - yScale(d[0]);
            })
            .style('fill','orange')
            .attr('stroke','white')
            .style('stroke-width','2px');
}

function update(){
    selected_data = data[d3.select('#month').property('value') - 1];

    var pie_selected = {};
    for (let pie_col of pie_cols)
        pie_selected[pie_col] = selected_data[pie_col];
    piechart(pie_selected)

    var radar_selected = {};
    for (let radar_col of radar_cols)
        radar_selected[radar_col] = selected_data[radar_col];
    radarchart(radar_selected);

    var hist_selected = [];
    hist_selected.push([selected_data['u20'], 0, 20]);
    hist_selected.push([selected_data['20to35'], 20, 35]);
    hist_selected.push([selected_data['35to55'], 35, 55]);
    hist_selected.push([selected_data['m55'], 55, 70]);
    histchart(hist_selected);
}

// 加载数据
d3.csv("hotel.csv",function (d) {
    data.push(d);
}).then(function(){
    d3.select('#month').attr('max', data.length).attr('value', 1);
    d3.select('#month').on('input',update);
    update();
});
