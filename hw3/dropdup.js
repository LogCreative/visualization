function dropdup(a){
    var arr = [];
    for(var i = 0; i < a.length; i++){
        if(!arr.includes(a[i])){
            arr.push(a[i]);
        }
    }
    return arr;
}

document.getElementById('dropbutton').addEventListener('click',function(){
    var input_str = document.getElementById('dropinput').value;
    input = input_str.split(',').map(Number);
    output = dropdup(input);
    document.getElementById('output').innerHTML = output;
});