function quickSort(a){
    function divide(low, high){
        var pivot = a[low];
        do {
            while(low<high && a[high] >= pivot) --high;
            if (low<high) {a[low] = a[high]; ++low;}
            while(low<high && a[low] <= pivot) ++low;
            if (low<high) {a[high] = a[low]; --high;}
        } while (low != high);
        a[low] = pivot;
        return low;
    }
    
    function quickSort(low, high){
        if (low < high){
            var mid = divide(low, high);
            quickSort(low, mid-1);
            quickSort(mid+1, high);
        }
    }

    quickSort(0, a.length-1);
    return a;
}

document.getElementById('sortsubmit').addEventListener('click', function(){
    var input_str = document.getElementById('sortinput').value;
    input = input_str.split(',').map(Number)
    output = quickSort(input);
    document.getElementById('output').innerHTML = output;
});