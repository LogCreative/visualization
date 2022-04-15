class Legend extends Sender {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);

    }

    /**
     * 设定列数据
     * @param {[String]} cols 
     * @returns 
     */
    cols(cols) {
        if (!arguments.length) return this._cols;
        this._cols = cols;
        return this;
    }

    render() {
        var that = this;
        this._svg = d3.select(that._selector)
            .append('svg')
            .attr('width', that._width)
            .attr('height', that._height)

        this._color = d3.scaleOrdinal()
            .domain(that._cols).range(d3.schemeDark2);

        this._legend = this._svg
            .selectAll('.legend')
            .data(that._cols).join('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                return i >= 4 ? `translate(120, ${(i - 4) * 25})` : `translate(0, ${i * 25})`;
            });

        this._legend.append('rect')
            .attr('x', 0)
            .attr('y', 10)
            .attr('width', 40)
            .attr('height', 3)
            .style('fill', function (d) {
                return that._color(d);
            })
            .style('opacity', function(d, i) {
                return i >= 4 ? 0.5 : 1.0;
            });
        this._legend.append('text')
            .attr('x', 45)
            .attr('y', 15)
            .style('text-anchor', 'west')
            .text(function (d) { return d; })
            .style('font-size', 10);

        this._legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 120)
            .attr('height', 20)
            .attr('fill', 'transparent')
            .on('mouseover', function (d) {
                d3.select(this).attr('fill', 'lightblue')
                    .attr('opacity', 0.3);
                that.sendHighlight(d3.select(this.parentNode).datum());
            })
            .on('mouseleave', function (d) {
                d3.select(this).attr('fill', 'transparent');
                that.sendUndoHighlight();
            });

    }

}