class Parallel extends Subscriber {
    constructor(width, height, padding, selector) {
        super(width, height, padding, selector);
        this._para_width = this._width - this._padding * 2;
        this._para_height = this._height - this._padding * 2;
        this._highlighting = null;
    }

    normalize(data, cols) {
        var newdata = [];
        data.forEach((d) => {
            newdata.push({});
        })
        cols.forEach(col => {
            var coldata = data.map((d) => { return d[col]; });
            var colmin = d3.min(coldata);
            var colmax = d3.max(coldata);
            data.forEach((d, i) => {
                newdata[i][col] = colmax == colmin ? 1 : (d[col] - colmin) / (colmax - colmin) * 0.7 + 0.3;
            });
        })
        return newdata;
    }

    complement(data) {
        this._factors = ['price', 'LoS', 'occupancy', 'conventions'];
        this._factor_data = this.datafilter(data, this._factors);
        this._color = d3.scaleOrdinal()
            .domain(this._factors).range(d3.schemeDark2);
        this._factor_data = this.normalize(this._factor_data, this._factors);
    }

    render() {
        var that = this;

        this._svg = d3.select(that._selector)
            .append('svg')
            .attr('width', that._width)
            .attr('height', that._height)
            .append('g')
            .attr('transform', `translate(${that._padding},${that._padding})`);

        this._x = d3.scalePoint().range([0, that._para_width]).domain(this._cols);

        this._lines = this._svg.append('g');

        this._axis = this._svg.append('g');

        this._y = {}
        this._yAxis = {}
        this._cols.forEach(col => {
            this._y[col] = d3.scaleLinear().range([that._para_height, 0])
                // .domain(d3.extent(data, (d) => { return +d[col]; }))
                .domain([0,100])
                ;
            this._yAxis[col] = this._axis.append('g')
                .attr('transform', `translate(${that._x(col)}, 0)`);
            this._yAxis[col].append('text')
                .style('text-anchor', 'middle')
                .attr('y', -9)
                .text(col)
                .style('fill', 'gray')
                .style('font-size', 10);
            this._yAxis[col] = this._yAxis[col].append('g')
                .call(d3.axisLeft(that._y[col]));
        });

    }

    genLines() {
        var that = this;

        function path(d, i) {
            return d3.line()(that._cols.map((col) => {
                return [that._x(col), that._y[col](d[col])];
            }))
        }

        this._lines.selectAll('path')
            .data(that._selected_data)
            .join('path').transition().duration(1000)
            .attr('d', path)
            .style('fill', 'none')
            .style('stroke' , function (d) {
                return that._highlighting ? 
                that._color(that._highlighting) :
                'gray'
            })
            .style('opacity', function (d, i) {
                return that._highlighting ? that._factor_data[i][that._highlighting] : 1.0
            })
    }

    update(indexs) {
        this._selected_data = this._data.slice(...indexs)
        this.genLines();
    }

    highlight(col) {
        if (this._factors.indexOf(col) != -1) {
            this._highlighting = col;
            this.genLines();
        } else this.undoHighlight();
    }

    undoHighlight() {
        this._highlighting = null;
        this.genLines();
    }

}