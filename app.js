const DUMMY_DATA = [
  { id: 'd1', region: 'USA', value: 10 },
  { id: 'd2', region: 'India', value: 12 },
  { id: 'd3', region: 'China', value: 11 },
  { id: 'd4', region: 'Germany', value: 6 },
];

const MARGINS = {top:20,bottom:10}
const CHART_WIDTH =600;
const CHART_HEIGHT=400-MARGINS.top-MARGINS.bottom;



const chartContainer=d3.select('svg')
                      .attr('width',CHART_WIDTH)
                      .attr('height',CHART_HEIGHT+MARGINS.top+MARGINS.bottom);



const chart = chartContainer.append('g');

var selectedData = DUMMY_DATA;

function renderChart(){
  
  
  const x = d3.scaleBand()
  .rangeRound([0,CHART_WIDTH])
  .padding(0.1);
  const y = d3.scaleLinear()
  .range([CHART_HEIGHT,0]);

  x.domain(DUMMY_DATA.map(d => d.region));
  y.domain([0,d3.max(DUMMY_DATA,d => d.value)+3]);


  chart.append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .classed('axisClass',true)
    .attr('transform',`translate(0,${CHART_HEIGHT})`);

  chart.selectAll('.bar')
  .data(selectedData, data => data.id)
  .enter()
  .append('rect')
  .classed('bar',true)
  .attr('width',x.bandwidth())
  .attr('height',data => CHART_HEIGHT-y(data.value))
  .attr('x',(data)=>x(data.region))
  .attr('y',(data)=>y(data.value));

chart.selectAll('.bar').data(selectedData, data => data.id).exit().remove();

chart.selectAll('.label')
  .data(selectedData, data => data.id)
  .enter()
  .append('text')
  .text((data)=>data.value)
  .attr('x',data=>x(data.region)+x.bandwidth()/2)
  .attr('y',data=>y(data.value)-20)
  .attr('text-anchor','middle')
  .classed('label',true);

chart.selectAll('.label').data(selectedData, data => data.id).exit().remove();
}

let unselectedIds = [];
function renderCheckboxes(){
 
                      
  const listItems = d3.select('#data')
                      .select('ul')
                      .selectAll('li')
                      .data(DUMMY_DATA)
                      .enter()
                      .append('li');
  
  listItems.append('span')
          .text(data=>(data.region));
  
  listItems.append('input')
            .attr('type','checkbox')
            .attr('checked',true)
            .on('change',(data)=>{
              if (unselectedIds.indexOf(data.id)===-1) {
                unselectedIds.push(data.id);
              } else {
                unselectedIds = unselectedIds.filter(id=>id !== data.id);
              }
            selectedData = DUMMY_DATA
                .filter(d=>unselectedIds.indexOf(d.id)===-1);
            renderChart();
            });
  
}

renderChart();
renderCheckboxes();


setTimeout(function () {
  DUMMY_DATA.push({id:'d5',region:'Netherlands',value:5});
  selectedData = DUMMY_DATA
  .filter(d=>unselectedIds.indexOf(d.id)===-1);
  renderChart();
  chart.selectAll('.bar').remove();
  chart.selectAll('.label').remove();
  chart.selectAll('.axisClass').remove();

  renderChart();
  renderCheckboxes();
}, 2000);

