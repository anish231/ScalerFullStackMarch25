function outer() {
    var arrFn = [];
    for (var i = 0; i < 3; i++) {
        arrFn.push(function fn() {
            console.log(i);
        })
    }
    return arrFn;
}


var arrFn = outer();
arrFn[0]();
arrFn[1]();
arrFn[2]();