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
    const b = parseInt(d3.select("#b").property("value"));
    const visSel = d3.select("#visSel").property("value");

    renderFormula(n,k,b);

    d3.select("#countTable").selectAll("*").remove();
    d3.select("#countTable").append("div").attr("id","outBar");
    
    if(visSel == "ct"){
        setTimeout(()=>makeCountTables(n,b),0);
    }else if(visSel == "kbc"){
        setTimeout(()=>countInBase(n,k),0);
    }
}

function binomialCoef(n,k){
    return Math.floor(fact(n)/(fact(k)*fact(n-k)));
}

function createAxisTable(n,k,title){
    const axisTable = d3.select("#countTable")
                        .append("table");

    axisTable.selectAll("tr")
             .data(range(0,k**n))
             .enter()
             .append("tr")
             .append("td")
             .text((x)=>x);

    axisTable.insert("tr","tr").append("th").text(title);

    return axisTable;
}
function countInBase(n,k){
    createAxisTable(n,k,"k = ");
    const table = d3.select("#countTable").append("table");

    if( !isNaN(n) && !isNaN(k) ){
        const cm = countingMatrix(n,k);
        table
        .selectAll("tr")
        .data(cm).enter()
        .append("tr")
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
function makeCountTables(n,b){
    createAxisTable(n,b,"k = ");

    for(var i = 0; i <= n; i++){
        countTable(n,i,b);
    }
}
function resetHandler(){
    renderFormula(NaN,NaN);
}

function countTable(n,k,b){
    const table = d3.select("#countTable").append("table");

    if( !isNaN(n) && !isNaN(k) && !isNaN(b) ){
        const cm = countingMatrix(n,b);
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

function renderFormula(n,k,b){
    var math = MathJax.Hub.getAllJax("MathDiv")[0];
    var templateStr = null;
    console.log(n);
    if( isNaN(n) || isNaN(k) || isNaN(b)){
        templateStr = "\\LARGE\\text{n choose k} = \\binom{n}{k} = \\frac{n!}{k!(n - k)!} \\tag{Binomial coefficient}";
    }
    else{
        if(b <= 2){
            const res = binomialCoef(n,k);
            templateStr = "\\LARGE \\text{"+n+" choose "+k+"}= \\binom{"+n+"}{"+k+"} = \\frac{"+n+"!}{"+k+"!("+n+"-"+k+")!} = "+
                res+"\\tag{Binomial coefficient}";
        }else{
            // Multi choice problem. 
            const multiN = n+k-1
            const res = binomialCoef(multiN,k);
            
            templateStr = "\\LARGE \\text{"+n+" multichoose "+k+"}= \\left(\\binom{"+n+"+"+k+"-1}{"+k+"}\\right) = \\binom{"+multiN+"}{"+k+"}"
                + " = \\frac{"+multiN+"!}{"+k+"!("+multiN+"-"+k+")!} = "+res+"\\tag{Multichoose}";
        }
        
    }
    
    MathJax.Hub.Queue(["Text",math,templateStr]);
}
