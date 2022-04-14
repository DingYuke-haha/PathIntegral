var PIwidth = 700, PIheight = 700, spacing = 120;
var Vecwidth = 400, Vecheight = 350, Vecspacing = 60;
var xLabel = "空间坐标 x -->", yLabel = "时间 t ↑"
// 有多少种x的取值，有多少种t的取值
var num_x = 20, num_t = 20;
var data = [];
var xinterval=(PIwidth-spacing)/(num_x-1);//x间隔
for (var i = 0; i < num_x; i++)
{
    for (var j = 0; j < num_t; j++)
    {
        data.push([i,j]);
    }
} 
// console.log(data["11"]);

//创建PI画布和xy轴
var svg = d3.select("#PI_vis").append("svg")
            .attr("width", PIwidth).attr("height", PIheight)
            .append("g")
            .attr("transform", "translate("+spacing/2 + "," +spacing/2 + ")")

// 创建向量画布
var Vecsvg = d3.select("#Vector_vis").append("svg")
            .attr("width", Vecwidth).attr("height", Vecheight)
            .append("g")
            .attr("transform", "translate("+Vecspacing/2 + "," +Vecspacing/2 + ")")
            .attr("viewBox", [0, 0, Vecwidth, Vecheight]);


var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d){return d[0];}) ]) 
                .range([0, PIwidth - spacing]);
var yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d){return d[1];}) ]) 
                .range([PIheight-spacing, 0]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

svg.append("g").attr("transform","translate(0,"+ (PIheight-spacing) + ")")
    .call(xAxis)
    .call(g => g.append("text")
          .attr("x", PIwidth - spacing)
          .attr("y", 27)
          .attr("fill", "#ff7b00")
          .attr("text-anchor", "end")
          .text(xLabel));
svg.append("g")
    .call(yAxis)
    .call(g => g.append("text")
          .attr("x", -spacing/2.5)
          .attr("y", 10)
          .attr("fill", "#ff7b00")
          .attr("text-anchor", "start")
          .text(yLabel));


//画点格
var dots = svg.append("g")
                .selectAll("dot").data(data)

dots.enter().append("circle")
                    .attr("cx", function(d){
                        return xScale(d[0]);
                    })
                    .attr("cy", function(d){
                        return yScale(d[1]);
                    })
                    .attr("r", 7)
                    .style("fill", "white")


//拖拽动作
function dragstarted(event, d)  {
    d3.select(this).attr("stroke", "white").attr("stroke-width",3);
}

function dragged(event, d) {
    d3.select(this).attr("cx", event.x);
    makeline();
    // .attr("cy", d.y = event.y);
}

function dragended(event, d) {
    d3.select(this).attr("stroke", null);
    // alert(d3.select(this).attr('cx'));
}

var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);


//画起点和终点
svg.append("circle")
            .attr("cx", 0)
            .attr("cy", PIheight-spacing)
            .attr("r",10)
            .style("fill","black")
            .attr("id", "startPoint")
            .call(drag);

svg.append("circle")
            .attr("cx", PIwidth-spacing)
            .attr("cy", 0)
            .attr("r",10)
            .style("fill","black")
            .attr("id", "endPoint")
            .call(drag);


//每一刻的可被拖拽的点
for (var i = 1; i<num_t-1;i++){
    svg.append("circle")
            // .attr("cx", data[`${i}`][0]*(height/(num_t-1)))
            .attr("cx", i*(PIwidth-spacing)/(num_t-1))
            .attr("cy", PIheight-spacing-i*(PIheight-spacing)/(num_t-1))
            .attr("r",10)
            .attr("z-index", 2)
            .style("fill","#ff7b00")
            .attr("id", `dot${i}`)
            .call(drag);
}

function x_location(i){
    var x_locate = d3.select(`#dot${i}`).attr("cx");
    return x_locate;
}

function y_location(i){
    var y_locate = d3.select(`#dot${i}`).attr("cy");
    return y_locate;
}
var vector = [];
vector.push([0,0]);


//计算复数乘方的函数
function complex(n){
    if(n%8==0)
    return [1,0];
    if(n%8==1)
    return [1/2**0.5, -1/2**0.5];
    if(n%8==2)
    return [0,-1]
    if(n%8==3)
    return [-1/2**0.5, -1/2**0.5];
    if(n%8==4)
    return [-1,0];
    if(n%8==5)
    return [-1/2**0.5, 1/2**0.5];
    if(n%8==6)
    return [0,1];
    if(n%8==7)
    return [1/2**0.5, 1/2**0.5];
}

//点击保存所有点的位置，并计算出PI
function calculate(){
    xs = []
    ts = []
    var xad=[]
    // xad.push(Math.round(d3.select("#startPoint").attr("cx")/xinterval));
    xad.push(d3.select("#startPoint").attr("cx")/xinterval);
    for (var i = 1; i<num_t-1;i++){
        xs.push(x_location(i));
        ts.push(y_location(i));
        // xad.push(Math.round(xs[i-1]/xinterval)); //离它最近的整数点
        xad.push(xs[i-1]/xinterval); //离它最近的整数点
    }
    // xad.push(Math.round(d3.select("#endPoint").attr("cx")/xinterval));
    xad.push(d3.select("#endPoint").attr("cx")/xinterval);
    // console.log(xad);
    var a=complex(num_t-1); //系数部分
    var s=0; //指数部分
    var adjust=(num_x-1)**2/(num_t-1)/1.5;
    for(var i=0;i<num_t-1;i++){
        s+=((xad[i+1]-xad[i]))**2/adjust;
    }
    PI=[100* a[0] * Math.cos(s) -100* a[1] * Math.sin(s),100 * a[0] * Math.sin(s)+ 100* a[1] * Math.cos(s)];
    vector.push([PI[0]+vector[vector.length-1][0],PI[1]+vector[vector.length-1][1]]);


    // 在Vecsvg上画出向量
    // 清除上一次的向量
    vectors = d3.selectAll(".vectors");
    vectors.remove();
    // 画这一次的向量图
    var realmax = d3.max(vector, function(d){
                                        return d[0];})
    var realmin = d3.min(vector, function(d){
                                        return d[0];})
    var imgmax = d3.max(vector, function(d){
                                        return d[1];})
    var imgmin = d3.min(vector, function(d){
                                        return d[1];})
    // console.log(realmax, realmin, imgmax, imgmin);
    for (var i = 0; i<vector.length-1;i++){
        var line = Vecsvg.append("line")
        .attr("x1",(vector[i][0]-realmin)/(realmax-realmin)*(Vecwidth-Vecspacing))
        .attr("y1",(vector[i][1]-imgmin)/(imgmax - imgmin)*(Vecheight-Vecspacing))
        .attr("x2",(vector[i+1][0]-realmin)/(realmax-realmin)*(Vecwidth-Vecspacing))
        .attr("y2",((vector[i+1][1]-imgmin)/(imgmax - imgmin)*(Vecheight-Vecspacing)))
        .attr("stroke","red")
        .attr("stroke-width",5)
        .attr("opacity", 0.5)
        .attr("class", "vectors")
        // .attr("marker-start","url(#arrow)")
        .attr("marker-end","url(#arrow)")
    }
    return xs, ts, PI;
}

// 连线

function makeline(){
    // 清除之前的line
    d3.select("#PIpath").remove();
    // setTimeout(() => {
    //     d3.select("#PIpath").remove();
    // }, 100);
    // 读取连线的每个点的坐标
    var lineData = [];
    lineData.push([d3.select("#startPoint").attr("cx"), d3.select("#startPoint").attr("cy")])
    for (var i = 1; i<num_t-1;i++){
        lineData.push([x_location(i), y_location(i)]);
    } 
    lineData.push([d3.select("#endPoint").attr("cx"), d3.select("#endPoint").attr("cy")])
    // console.log(lineData);

    // 画线
    var line = d3.line(d => d[0], d => d[1])
    svg.append("path")
    .data(lineData)
    .attr("d", line(lineData))
    .attr("stroke", "#ff7b00")
    .attr("fill", "none")
    .attr("id", "PIpath")
    .attr("stroke-width",5)
    .attr("opacity", 0.5)
    .lower()



}


makeline();


// 使向量画布可zoom

//创建箭头

//添加defs标签
var defs = Vecsvg.append("defs");
//添加marker标签及其属性
var arrowMarker = defs.append("marker")
    .attr("id","arrow")
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth",6)
    .attr("markerHeight",6)
    .attr("viewBox","0 0 12 12")
    .attr("refX",6)
    .attr("refY",6)
    .attr("orient","auto")
//绘制直线箭头
var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
arrowMarker.append("path")
    .attr("d",arrow_path)
    .attr("fill","#000")



// 清除向量图
function clean(){
    vectors = d3.selectAll(".vectors");
    vectors.remove();
    vector.length = 1;
    console.log(vector);
}

// PI图回到初始位置
function reset(){
    d3.select("#startPoint").attr("cx", 0).attr("cy", PIheight-spacing);
    d3.select("endPoint").attr("cx", PIwidth-spacing).attr("cy", 0);
    for (var i = 1; i<num_t-1;i++){
        d3.select(`#dot${i}`)
        .attr("cx", i*(PIwidth-spacing)/(num_t-1));
    }
    makeline();
}


//尝试遍历x和y，画出向量图
function demo(){
    d3.select("#startPoint").attr("cx", 0).attr("cy", PIheight-spacing);
    d3.select("#endPoint").attr("cx", PIwidth-spacing).attr("cy", 0);
    for (var i = 1; i<num_t-1;i++){
        d3.select(`#dot${i}`)
        .attr("cx", PIwidth-spacing)
        .attr("cy", PIheight-spacing-i*(PIheight-spacing)/(num_t-1));
    }

    for (var i = 1; i<num_t-1;i++){
        for (var j = 1; j<i + 1;j++){
            x = x_location(j)- xinterval;
            d3.select(`#dot${j}`).attr("cx", x);
            makeline();
            calculate();
        }
    }
    for (var i = 1; i<num_t-1;i++){
        for (var j = i ; j<num_t -1;j++){
            x = x_location(j)- xinterval;
            d3.select(`#dot${j}`).attr("cx", x);
            makeline();
            calculate();
        }
    }
}

