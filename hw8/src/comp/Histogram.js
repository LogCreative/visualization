class Histogram extends Subscriber {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
    }

    render() {

        var that = this;

        this._svg = d3.select('#age')
            .append('svg')
            .attr('width', that._width)
            .attr('height', that._height)
            .append('g')
            .attr('transform', `translate(${that._padding},${that._padding})`);

        this._hist_width = this._width - this._padding * 2;
        this._hist_height = this._height - this._padding * 2;

        this._xScale = d3.scaleLinear()
            .domain([0, 70])
            .range([0, that._hist_width]);
        this._svg.append('g')
            .attr('transform',
                `translate(0,${that._hist_height})`)
            .call(d3.axisBottom(that._xScale));
        this._yScale = d3.scaleLinear()
            .range([that._hist_height, 0]);
        this._yAxis = this._svg.append('g');
    }

    convertData(selected_data) {
        var hist_data = [];
        hist_data.push([selected_data['u20'], 0, 20]);
        hist_data.push([selected_data['20to35'], 20, 35]);
        hist_data.push([selected_data['35to55'], 35, 55]);
        hist_data.push([selected_data['m55'], 55, 70]);
        return hist_data;
    }

    update(indexs) {
        var selected_data = this.receiveAvg(indexs);
        var hist_data = this.convertData(selected_data);

        var that = this;

        this._yScale.domain([0, d3.max(hist_data.map((d) => { return d[0]; }))]);
        this._yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(that._yScale));

        this._svg.selectAll("rect")
            .data(hist_data)
            .join("rect")
            .transition()
            .duration(1000)
            .attr('x', function (d) {
                return that._xScale(d[1]);
            })
            .attr('y', function (d) {
                return that._yScale(d[0]);
            })
            .attr('width', function (d) {
                return that._xScale(d[2]) - that._xScale(d[1]);
            })
            .attr('height', function (d) {
                return that._hist_height - that._yScale(d[0]);
            })
            .style('fill', 'orange')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
    }

}