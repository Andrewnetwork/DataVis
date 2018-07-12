// counter.js
// Andrew Ribeiro
// July 2018
// Licence: MIT

function fact(n){
    var prod = 1;
    for(var i = 1; i <= n; i++){
        prod *= i;
    }

    return prod;
}

function range(start,end){
    var outArr = [];

    for(var i = start; i<end; i++){
        outArr.push(i);
    }

    return outArr;
}

function repeat(num,n){
    var out = [];
    for(var i = 0; i < n; i++){
        out.push(num);
    }
    return out;
}

function flatten(ls){
    const outLs = [];
    ls.map((x)=>x.map((z)=>outLs.push(z)));

    return outLs; 
}

// Expects a square array of arrays. 
// I.e. [[ 1,2,3],[4,5,6]] -> [[1,4],[2,5],[3,6]]
function transpose(x){
    const outMat = [];
    const nCol= x[0].length;

    for(var i = 0; i < nCol; i++){
        outMat.push(x.map((k)=>k[i]));
    }

    return outMat;
}

function countingMatrix(digits,base){
    const baseVector = range(0,base);
    const outMat = [];
    const nRows = base ** digits; 
    
    for(var i = 0; i<digits; i++){
        const moduloVect = flatten(baseVector.map((x)=>repeat(x,base ** i)));
        outMat.push(flatten(repeat(moduloVect,nRows/moduloVect.length)));
    }
    
    return transpose(outMat);
}

function goHandler(){
    const n = parseInt(d3.select("#n").property("value"));
    const k = parseInt(d3.select("#k").property("value"));

    renderFormula(n,k);

    d3.select("#countTable").selectAll("*").remove();
    d3.select("#countTable").append("div").attr("id","outBar");
    
    for(var i = 0; i <= n; i++){
        countTable(n,i);
    }
}
function resetHandler(){
    renderFormula(NaN,NaN);
}

function countTable(n,k){
    const table = d3.select("#countTable").append("table");

    if( !isNaN(n) && !isNaN(k) ){
        const cm = countingMatrix(n,2);
        table
        .selectAll("tr")
        .data(cm).enter()
        .append("tr")
        .style('background-color',(x)=> (x.reduce((t,x)=>t+x)) == k ? "#aefcc3" : "white")
        .selectAll("td")
        .data((x)=>x).enter()
        .append("td").text((x)=>x)

        table
        .insert("tr","tr")
        .append("th")
            .attr("colspan",n)
            .text(k);
    }

}

function renderFormula(n,k){
    var math = MathJax.Hub.getAllJax("MathDiv")[0];
    var templateStr = null;
    console.log(n);
    if( isNaN(n) || isNaN(k) ){
        templateStr = "\\LARGE\\text{n choose k} = \\binom{n}{k} = \\frac{n!}{k!(n - k)!} \\tag{Binomial coefficient}";
    }
    else{
        const res = Math.floor(fact(n)/(fact(k)*fact(n-k)));
        templateStr = "\\LARGE \\text{"+n+" choose "+k+"}= \\binom{"+n+"}{"+k+"} = \\frac{"+n+"!}{"+k+"!("+n+"-"+k+")!} = "+
            res+"\\tag{Binomial coefficient}";
    }
    
    MathJax.Hub.Queue(["Text",math,templateStr]);
}
