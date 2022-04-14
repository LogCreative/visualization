class StackedBar {
    constructor(selector, width, height, padding, legend_width) {
        this._selector = selector;
        this._width = width;
        this._height = height;
        this._padding = padding;
        this._legend_width = legend_width
        this._bar_width = width - padding * 2 - legend_width;
        this._bar_height = height - padding * 2;
    }

    data(data, categories) {
        if (!arguments.length) return this._data;
        this._data = data;
        console.log(data);
        this._categories = categories;
        return this;
    }

    render() {
        var that = this;

        this._maindom = d3.select(that._selector);

        this._buttondom = this._maindom.append('div');

        Object.entries(this._categories).forEach(cate => {
            this._buttondom.append('button').text(cate[0])
                .on('click', () => {
                    that.update(cate[0]);
                });
        })

        this._graphdom = this._maindom.append('svg')
            .attr('width', that._width)
            .attr('height', that._height)
            .append('g')
            .attr('transform', `translate(${that._padding},${that._padding})`);

        var that = this;

        // X Axis
        var months = this._data.map((d, i) => { return i + 1; });
        this._xScale = d3.scaleBand()
            .domain(months)
            .range([0, that._bar_width])
            .padding([0.2]);
        this._xAxis = this._graphdom.append('g')
            .attr("transform", `translate(0, ${that._bar_height})`)
            .call(d3.axisBottom(that._xScale).tickSizeOuter(0));

        // Y Axis
        this._yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([that._bar_height, 0]);
        this._yAxis = this._graphdom.append('g')
            .call(d3.axisLeft(that._yScale));

        // Bar Area
        this._bardom = this._graphdom.append('g');

        this._legenddom = this._graphdom.append('g')
                            .attr("transform", `translate(${this._bar_width},5)`);

    }

    update(category) {

        var cols = this._categories[category];

        var color = d3.scaleOrdinal().domain(cols).range(d3.schemeSet2);

        var that = this;

        var stackedData = d3.stack().keys(cols)(that._data)

        this._bardom
            .selectAll("g")
            .data(stackedData)
            .join('g')
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .join("rect")
                // .transition().duration(1000)
                .attr("x", function(d,i) { return that._xScale(i+1); })
                .attr("y", function(d) { return that._yScale(d[1]); })
                .attr("height", function(d) { return that._yScale(d[0]) - that._yScale(d[1]); })
                .attr("width",that._xScale.bandwidth())

        this._legenddom.selectAll("*").remove();


        var legend = this._legenddom.selectAll('.legend')
                    .data(cols).join('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                        return `translate(0, ${i * 20})`;
                    })

        legend.append('rect')
                    .attr('x', 0)
                    .attr('y', 8)
                    .attr('width', 40)
                    .attr('height', 10)
                    .style('fill', function (d) {
                        return color(d);
                    })
        
        legend.append('text')
                    .attr('x', 45)
                    .attr('y', 15)
                    .style('text-anchor', 'west')
                    .text(function(d){
                        return d;
                    })
                    .style('font-size', 10);
        
        

    }

    resize() {

    }
}