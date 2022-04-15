class SeasonChart extends Subscriber {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
        this.highlighting = null;
    }

    render() {
        var that = this;
        this._svg = d3.select(that._selector)
            .append('svg')
            .attr('width', that._width)
            .attr('height', that._height)
            .append('g')
            .attr('transform', `translate(${that._padding},${that._padding})`);

        this._season_width = this._width - this._padding * 2;
        this._season_height = this._height - this._padding * 2;

        this._xScale = d3.scaleBand().range([0, that._season_width]);
        this._xAxis = this._svg.append("g")
            .attr("transform", `translate(0,${that._season_height})`);
        this._yScale = d3.scaleLinear().domain([0, 1]).range([that._season_height, 0]);  // normalized data with fixed domain
        this._yAxis = this._svg.append("g")
            .call(d3.axisLeft(that._yScale));

        this._color = d3.scaleOrdinal()
            .domain(that._cols).range(d3.schemeDark2);

        this._data_line = this._svg.append('g');
        this._data_dot = this._svg.append('g');

    }

    getColData(data) {
        var newdata = {};
        this._cols.forEach(col => {
            newdata[col] = data.map((d) => {
                return d[col];
            })
        })
        return newdata;
    }

    /**
     * 归一化数据
     * @param {[{String: Number}]} data
     */
    normalize(data) {
        this._cols.forEach(col => {
            var coldata = data.map((d) => { return d[col]; });
            var colmin = d3.min(coldata);
            var colmax = d3.max(coldata);
            data.forEach((d, i) => {
                data[i][col] = colmax == colmin ? 1 : (d[col] - colmin) / (colmax - colmin);
            });
        })
    }


    genSeasonData(indexs) {
        this._season_data = [];
        this._season_rows = [];
        var season_preset = {
            'Spring': [3, 5],
            'Summer': [6, 8],
            'Autumn': [9, 11],
            'Winter': [1, 12]
        }
        for (var season in season_preset) {
            if (indexs[0] <= season_preset[season][0]
                && indexs[1] >= season_preset[season][1]) {
                this._season_rows.push(season);
                this._season_data.push(
                    season == 'Winter' ?
                        this.dataAvg(this._data.slice(0, 2).concat(this._data.slice(11, 12))) :
                        this.receiveAvg(season_preset[season])
                );
            }
        }
    }

    genLines() {
        this.normalize(this._season_data);
        var that = this;
        this._xScale.domain(that._season_rows);
        this._xAxis.transition()
            .duration(1000)
            .call(d3.axisBottom(that._xScale));

        var coldata = Object.entries(this.getColData(this._season_data));

        this._data_line.selectAll('path').data(coldata)
            .join('path').transition().duration(500)
            .attr('stroke', function (d) { return that._color(d[0]) })
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('opacity', function (d) {
                return (!(that.highlighting) || d[0] == that.highlighting) ? 1.0 : 0.2;
            })
            .attr('d', function (d) {
                return d3.line()
                    .x(function (d, i) { return that._xScale(that._season_rows[i]) + that._xScale.bandwidth() / 2 })
                    .y(function (d) { return that._yScale(d) })
                    (d[1])
            })
            .attr('translate', `transform(${that._padding},${that._padding})`)
            ;

        this._data_dot.selectAll('g').data(coldata)
            .join('g')
            .style("fill", function (d) { return that._color(d[0]) })
            .attr('opacity', function (d) {
                return (!(that.highlighting) || d[0] == that.highlighting) ? 1.0 : 0.2;
            })
            .selectAll('circle').data(d => d[1])
            .join('circle').transition().duration(500)
            .attr("cx", function (d, i) {
                return that._xScale(that._season_rows[i]) + that._xScale.bandwidth() / 2;
            })
            .attr("cy", function (d) {
                return that._yScale(d);
            })
            .attr("r", 3)
            .attr('stroke', 'white');
    }

    update(indexs) {
        this.genSeasonData(indexs);
        this.genLines();
    }

    highlight(col) {
        this.highlighting = col;
        this.genLines();
    }

    undoHighlight() {
        this.highlighting = null;
        this.genLines();
    }

}