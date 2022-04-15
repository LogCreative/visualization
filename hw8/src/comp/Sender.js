class Sender {
    constructor(width, height, padding, selector) {
        this._width = width;
        this._height = height;
        this._padding = padding;
        this._selector = selector;
        this.subs = [];
    }

    subscribe(sub) {
        this.subs.push(sub);
    }

    /**
     * 用于数组切片，首个索引，最后一个索引
     * 由于月份从 1 开始，所以需要首个减 1，
     * 最后一个索引之前原本要加 1，现在抵消
     * @param {[number]} range 
     * @returns indexs
     */
    getIndexRange(range) {
        return [range[0] - 1, range[1]];
    }

    /**
     * 向订阅者发送数组范围
     * 如果范围为空或无效，将不会触发更新
     * @param {[number]} indexs 
     */
    sendLimit(indexs) {
        if (indexs[0] >= indexs[1]) return ;
        this.subs.forEach(sub => {
            sub.update(indexs);
        })
    }

    /**
     * 高亮某一列
     * @param {String} col 
     */
    sendHighlight(col) {
        this.subs.forEach(sub => {
            sub.highlight(col);
        })
    }

    sendUndoHighlight(col) {
        this.subs.forEach(sub => {
            sub.undoHighlight();
        })
    }
}