class PieChart extends Subscriber {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
    }

    complement(data) {
        if (this._cols.length == 1) {
            this._data.forEach((d, i) => {
                this._data[i][' '] = 100 - this._data[i][this._cols];
            });
            this._cols.push(' ');
        }
    }

    /**
     * 初始化结构
     */
    render() {
        d3.select(this._selector).selectAll('*').remove();
        var pie_width = this._width - this._padding * 2;
        var pie_height = this._height - this._padding * 2;
        this._pie_radius = Math.min(pie_width, pie_height) / 2;
        this._svg = d3.select(this._selector)
            .append('svg')
            .attr('width', pie_width)
            .attr('height', pie_height)
            .append('g')
            .attr('transform', `translate(${pie_width / 2},${pie_height / 2})`);
        this._pie_color = d3.scaleOrdinal()
            .domain(this._cols)
            .range(d3.schemeDark2);
    }

    update(indexs) {
        var pie_data = this.receiveAvg(indexs);

        var pie = d3.pie()
            .value(function (d) { return d[1]; });
        var data_ready = pie(Object.entries(pie_data));
        var arcGenerator = d3.arc().innerRadius(0).outerRadius(this._pie_radius);
        var pie_color = this._pie_color;

        this._svg.selectAll('path').data(data_ready)
            .join('path')
            .transition()
            .duration(1000)
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return pie_color(d.data[0]); })
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        this._svg.selectAll('text').data(data_ready)
            .join('text')
            .transition()
            .duration(1000)
            .text(function (d) { return d.data[0] })
            .attr("transform", function (d) {
                return `translate(${arcGenerator.centroid(d)})`
            })
            .style("text-anchor", "middle")
            .attr("font-size", 9);
    }
}