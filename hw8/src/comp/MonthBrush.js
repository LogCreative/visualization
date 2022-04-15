class MonthBrush extends Sender {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
        this._focusWidth = width - padding * 2;
        this._focusHeight = height - padding * 2;
    }

    data(data, column) {
        if (!arguments.length) return this._data;
        this._data = data.map((d) => { return d[column]; });
        return this;
    }

    render() {
        d3.select(this._selector).selectAll('*').remove();
        this._svg = d3.select(this._selector)
            .append("svg")
            .attr("width", this._width)
            .attr("height", this._height)
            .append("g")
            .attr('transform', `translate(${this._padding},${this._padding})`);

        var xScale = d3.scaleLinear()
            .domain([1, this._data.length])
            .range([0, this._focusWidth]);
        var xAxis = this._svg.append('g')
            .attr('transform', `translate(0,${this._focusHeight})`)
            .call(d3.axisBottom(xScale));
        var yScale = d3.scaleLinear()
            // .domain([0, d3.max(this._data)])
            .domain([0,100])
            .range([this._focusHeight, 0]);
        var yAxis = this._svg.append('g')
            .call(d3.axisLeft(yScale));

        var data = this._data;

        var avg = d3.mean(data);
        var sqrtvar = d3.deviation(data);

        this._svg.append('rect')
            .attr('x', xScale(1))
            .attr('y', yScale(avg + sqrtvar))
            .attr('width', xScale(data.length) - xScale(1))
            .attr('height', yScale(avg - sqrtvar) - yScale(avg + sqrtvar))
            .attr('fill', 'orange')
            .attr('opacity', 0.25);

        this._svg.append('line')
            .attr('x1', xScale(1))
            .attr('y1', yScale(avg))
            .attr('x2', xScale(data.length))
            .attr('y2', yScale(avg))
            .attr('stroke', 'red')
            .style('stroke-width', 2)
            .attr('opacity', 0.25);

        this._svg.append('path')
            .datum(data)
            .attr("fill", "steelblue")
            .attr("stroke", "steelblue")
            .style("stroke-width", 3)
            .attr("opacity", 0.5)
            .attr("d", d3.area()
                .x(function (d, i) { return xScale(i + 1); })
                .y0(function (d) { return yScale(0); })
                .y1(function (d) { return yScale(d); })
            );

        var selected = this._svg.append('path');

        function roundSelection(selection) {
            var range = selection.map(xScale.invert);
            return [Math.ceil(range[0]), Math.floor(range[1])];
        }

        var that = this;

        function brushed({ selection }) {
            if (selection) {
                var range = roundSelection(selection); // 从 1 开始的
                var indexs = that.getIndexRange(range);
                var selectedData = data.slice(...indexs);
                selected.datum(selectedData)
                    .attr("fill", "steelblue")
                    .attr("opacity", 0.75)
                    .attr("stroke", "steelblue")
                    .attr("stroke-linecap", "round")
                    .style("stroke-width", 3)
                    .attr("d", d3.area()
                        .x(function (d, i) { return xScale(range[0] + i) })
                        .y0(function (d) { return yScale(0) })
                        .y1(function (d) { return yScale(d) })
                    )
                // 订阅者更新
                that.sendLimit(indexs);
            }
        }

        function brushended({ selection }) {
            if (!selection) {
                gb.call(brush.move, defaultSelection);
            }
        }

        var brush = d3.brushX()
            .extent([
                [xScale(1), yScale(100)],
                [xScale(data.length), yScale(0)]])
            .on("brush", brushed)
            .on("end", brushended);

        const defaultSelection = [xScale(1), xScale(data.length)];
        const gb = this._svg.append('g')
            .call(brush).call(brush.move, defaultSelection);
    }
}
