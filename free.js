var width = 600, height = 500, spacing = 120;
// 有多少种x的取值，有多少种t的取值
var num_x = 10, num_t = 10;
var data = [];
for (var i = 0; i < num_x; i++)
{
    for (var j = 0; j < num_t; j++)
    {
        data.push([i,j]);
    }
} 
// console.log(data["11"]);

//创建画布和xy轴
var svg = d3.select("#PI_vis").append("svg")
            .attr("width", width).attr("height", height)
            .style("background", "pink")
            .append("g")
            .attr("transform", "translate("+spacing/2 + "," +spacing/2 + ")")
var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d){return d[0];}) ]) 
                .range([0, width - spacing]);
var yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d){return d[1];}) ]) 
                .range([height-spacing, 0]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

svg.append("g").attr("transform","translate(0,"+ (height-spacing) + ")").call(xAxis);
svg.append("g").call(yAxis);


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
                    .attr("r", 5)
                    .style("fill", "red")


//拖拽动作
function dragstarted(event, d)  {
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
    d3.select(this).attr("cx", event.x)
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
            .attr("cy", height-spacing)
            .attr("r",7)
            .style("fill","black")
            .attr("id", "startPoint")
            .call(drag);

svg.append("circle")
            .attr("cx", width-spacing)
            .attr("cy", 0)
            .attr("r",7)
            .style("fill","black")
            .attr("id", "endPoint")
            .call(drag);


//每一刻的可被拖拽的点
for (var i = 1; i<num_t-1;i++){
    svg.append("circle")
            // .attr("cx", data[`${i}`][0]*(height/(num_t-1)))
            .attr("cx", width-spacing-i*(width-spacing)/(num_t-1))
            .attr("cy", height-spacing-i*(height-spacing)/(num_t-1))
            .attr("r",7)
            .style("fill","white")
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

//点击保存所有点的位置，并计算出PI
function calculate(){
    xs = []
    ts = []
    for (var i = 1; i<num_t-1;i++){
        xs.push(x_location(i));
        ts.push(y_location(i));
    }
    console.log(xs,ts);
    return xs, ts
}

// 连线

function makeline(){
    // 清除之前的line
    var line = d3.select("path");
    line.remove();

    // 读取连线的每个点的坐标
    var lineData = [];
    lineData.push([d3.select("#startPoint").attr("cx"), d3.select("#startPoint").attr("cy")])
    for (var i = 1; i<num_t-1;i++){
        lineData.push([x_location(i), y_location(i)]);
    } 
    lineData.push([d3.select("#endPoint").attr("cx"), d3.select("#endPoint").attr("cy")])
    // console.log(lineData);

    // 画线
    line = d3.line(d => d[0], d => d[1])
    svg.append("path")
    .data(lineData)
    .attr("d", line(lineData))
    .attr("stroke", "black")
    .attr("fill", "none")
}


makeline();


