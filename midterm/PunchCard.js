class PunchCard {
    constructor(selector) {
        this._dom = document.querySelector(selector)
    }

    /**
     * 归一化数据，不应破坏原数据。
     * @param {[{String: Number}]} data
     */
    normalize(data) {
        var newdata = [];
        data.forEach((d) => {
            newdata.push({});
        })
        this._cols.forEach(col => {
            var coldata = data.map((d) => { return d[col]; });
            var colmin = d3.min(coldata);
            var colmax = d3.max(coldata);
            data.forEach((d, i) => {
                newdata[i][col] = colmax == colmin ? 1 : (d[col] - colmin) / (colmax - colmin);
            });
        })
        return newdata;
    }

    /**
     * 设定数据并归一化
     * @param {[{String: String}]} data 
     * @param {[String]} cols 有序的
     * @returns 
     */
    data(data, cols) {
        if (!arguments.length) return this._data;
        this._month = data.map((d, i) => { return i + 1; });
        this._cols = cols;
        data = this.normalize(data);
        this._data = []
        data.forEach((d, i) => {
            this._cols.forEach((col, j) => {
                this._data.push([i, j, d[col]]);
            })
        })
        return this;
    }

    render() {

        this._myChart = echarts.init(this._dom);

        this._option = {
            grid: {
                left: 100,
                bottom: 50,
                right: 20,
                containLabel: false
            },
            xAxis: {
                type: 'category',
                data: this._month,
                boundaryGap: false,
                splitLine: { show: true },
                axisLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: this._cols,
                axisLine: { show: false }
            },
            series: [
                {
                    name: 'Punch Card',
                    type: 'scatter',
                    data: this._data,
                    symbolSize: function (val) {
                        return val[2] * 15;
                    },
                    animationDelay: function (idx) {
                        return idx * 5;
                    }
                }
            ]
        }

        this._myChart.setOption(this._option);
    }

    resize() {
        this._myChart.resize();
    }
}