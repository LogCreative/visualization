class RadarChart extends Subscriber {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
    }

    render() {
        var that = this;
        this._svg = d3.select(this._selector)
            .append('svg')
            .attr('width', that._width)
            .attr('height', that._height)
            .append('g')
            .attr('transform', `translate(${that._width / 2}, ${that._height / 2})`);

        this._radar_radius = Math.min(this._width, this._height) / 2 - this._padding;
        this._radar_x = d3.scaleBand().range([0, 2 * Math.PI]).align(0).domain(this._cols);
        this._radar_y = d3.scaleLinear().range([0, this._radar_radius]);

        this._radar_bg = this._svg.append('g')
        this._radar_data = this._svg.append('g');
    }

    renderBg(data_max) {
        var webs = []
        for (var i = 0; i <= data_max + 10; i = i + 10) {
            var web = '';
            for (let col of this._cols) {
                var angle = this._radar_x(col);
                var inner_radius = this._radar_y(i);
                var x = inner_radius * Math.sin(angle);
                var y = inner_radius * Math.cos(angle);
                web += x + ',' + y + ' ';
            }
            webs.push(web);
        }

        var that = this;

        var webPoints = webs[webs.length - 1].split(' ');
        webPoints.pop();
        this._radar_bg.selectAll('polygon').data(webs)
            .join('polygon').transition().duration(1000)
            .attr('points', function (d) { return d; })
            .style('fill', 'transparent')
            .attr('stroke', 'gray');
        this._radar_bg.selectAll('line').data(webPoints)
            .join('line').transition().duration(1000)
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', function (d) { return d.split(',')[0]; })
            .attr('y2', function (d) { return d.split(',')[1]; })
            .attr('stroke', 'gray');
        this._radar_bg.selectAll('text').data(that._cols)
            .join('text').transition().duration(1000)
            .text(function (d) { return d; })
            .attr('x', function (d) { return (that._radar_radius + 20) * Math.sin(that._radar_x(d)); })
            .attr('y', function (d) { return (that._radar_radius + 20) * Math.cos(that._radar_x(d)); })
            .style('text-anchor', 'middle');
    }

    update(indexs) {
        var radar_data = this._radar_data;
        var data_ready = this.receiveAvg(indexs);
        if (data_ready.length == 0) return ;
        var data_max = Math.max(...Object.keys(data_ready).map((d) => { return data_ready[d] }))
        this._radar_y.domain([0, data_max]);
        this.renderBg(data_max);

        var data_area = '';
        for (let col of this._cols) {
            var data_radius = this._radar_y(data_ready[col]);
            var x = data_radius * Math.sin(this._radar_x(col));
            var y = data_radius * Math.cos(this._radar_x(col));
            data_area += x + ',' + y + ' ';
        }
        radar_data.selectAll('polygon').data([data_area])
            .join('polygon').transition().duration(1000)
            .attr('points', function (d) { return d; })
            .attr('stroke', 'darkblue')
            .attr('stroke-width', 1.5)
            .style('fill', 'blue')
            .style('opacity', 0.75);
        var data_points = data_area.split(' ');
        data_points.pop();
        radar_data.selectAll('circle').data(data_points)
            .join('circle').transition().duration(1000)
            .attr('cx', function (d) { return d.split(',')[0]; })
            .attr('cy', function (d) { return d.split(',')[1]; })
            .attr('r', 3)
            .attr('stroke', 'darkblue')
            .style('fill', 'white');
    }
}
