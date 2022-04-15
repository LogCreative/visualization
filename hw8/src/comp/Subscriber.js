class Subscriber {
    constructor(width, height, padding, selector) {
        this._width = width;
        this._height = height;
        this._padding = padding;
        this._selector = selector;
    }

    /**
     * 初始化数据，留空获取数据，展示其中的数据列。
     * @param {[{string: number}]} data 
     * @param {[string]} cols 
     * @returns this
     */
    data(data, cols) {
        if (!arguments.length) return this._data;
        this._cols = cols;
        this._data = this.datafilter(data, cols);
        this.complement(data);
        return this;
    }

    datafilter(data, cols) {
        return data.map((d) => {
            var dict = {};
            for (let col of cols)
                dict[col] = Number(d[col]);
            return dict;
        });
    }

    /**
     * 补充数据，默认留空
     */
    complement(data) {}

    dataAvg(selectedData) {
        var avg_data = {}
        this._cols.forEach(c => {avg_data[c] = 0;})
        selectedData.forEach((d) => {
            this._cols.forEach(c => {
                avg_data[c] += d[c];
            })
        })
        var n = selectedData.length;
        this._cols.forEach(c => { avg_data[c] /= n;});
        return avg_data;
    }

    /**
     * 平均范围内的各项数据
     * @param {[Number, Number]} indexs 
     * @returns avg_data
     */
    receiveAvg(indexs) {
        var selectedData = this._data.slice(...indexs);
        return this.dataAvg(selectedData);
    }

    /**
     * 更新图形呈现
     * @param {[Number, Number]} indexs 
     */
    update(indexs) {}

    /**
     * 高亮某个因素
     * @param {string} col 
     */
    highlight(col) {}
    
    /**
     * 取消高亮
     */
    undoHighlight() {}

    

}
