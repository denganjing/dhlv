require('./index.css')

const UNIQUE_NAME = 'curve_line';

export default function renderWave() {
  let
    svgWidth = 375,
    svgHeight = 100;
  let
    startX = 0,
    startY = svgHeight * .5,
    waveWidthMin = svgWidth * 0.1,
    waveWidthMax = svgWidth * 0.2,
    waveHeightMin = svgHeight * .3,
    waveHeightMax = svgHeight * .5,
    pathes = [],
    lineLength = svgWidth * 0, // 左右直线
    strokeWidth = 5,
    waveWidthList = [],
    startY1 = startY,
    startY2 = startY - 5,
    d1 = `M${startX},${startY1} L${lineLength},${startY1}`, // with left line
    d2 = `M${startX},${startY2 } L${lineLength},${startY2 }`; // with left line
    startX = lineLength;
  for(let j=0; true; j++){
    let waveWidth = waveWidthMin + Math.random() * (waveWidthMax - waveWidthMin);
    let waveHeight = waveHeightMin + Math.random() * (waveHeightMax - waveHeightMin);
    // 第一个cycle
    if(j === 0) {
      waveHeight /= 1; // 线与波浪交接处，波浪不要太高，看起来更平滑
    }
    // 最后一个cycle
    if(startX + waveWidth >= svgWidth - lineLength) {
      waveWidth = svgWidth - lineLength - startX; // 最后一个cycle跟线接起来
      waveHeight /= 1; // 线与波浪交接处，波浪不要太高，看起来更平滑
      if(waveWidth <= svgWidth * .02){
        waveHeight = 0;
      }
    }
    d1 += `C${startX+1/3*waveWidth},${(startY1+waveHeight)}
      ${startX+2/3*waveWidth},${(startY1-waveHeight)}
      ${startX+waveWidth},${startY1}`;
    d2 += `C${startX+1/3*waveWidth } ,${(startY2+waveHeight) }
      ${startX+2/3*waveWidth},${(startY2-waveHeight)}
      ${startX+waveWidth },${startY2}`;
    startX += waveWidth;
    if(startX >= svgWidth - lineLength) {
      break;
    }
  }
  d1 += `L${svgWidth},${startY1}`; // with right line
  d2 += `L${svgWidth},${startY2}`; // with right line
  pathes.push({d:d1});
  pathes.push({d:d2});
  pathes[1].stroke = "url(#waveDarkGradient)";
  pathes[0].stroke = "url(#waveGradient)";

  var str  = `<div class='curve'>
    <svg>
      <linearGradient id="waveGradient">
        <stop offset="0" stop-color="#00CBFF"/>
        <stop offset="0.25" stop-color="#1FB8F0"/>
        <stop offset="0.5" stop-color="#7C7DC2" />
        <stop offset="0.75" stop-color="#EC368A"/>
        <stop offset="1" stop-color="#FE297E"/>
      </linearGradient>
      <linearGradient id="waveDarkGradient">
        <stop offset="0" stop-color="#00CBFF" stop-opacity="0.2"/>
        <stop offset="0.25" stop-color="#1FB8F0" stop-opacity="0.2"/>
        <stop offset="0.5" stop-color="#7C7DC2" stop-opacity="0.3"/>
        <stop offset="0.75" stop-color="#EC368A" stop-opacity="0.2"/>
        <stop offset="1" stop-color="#FE297E" stop-opacity="0.2"/>
      </linearGradient>
      <linearGradient id="leftLine">
        <stop offset="0" stop-color="#00CBFF"/>
        <stop offset="1" stop-color="#1FB8F0"/>
      </linearGradient>
      <linearGradient id="rightLine">
        <stop offset="0" stop-color="#EC368A"/>
        <stop offset="1" stop-color="#FE297E"/>
      </linearGradient>`
  for(var i=0;i<pathes.length;i++){
    str = `${str}<path key=${i} id=${UNIQUE_NAME}_${i} 
    stroke=${pathes[i].stroke} fill=none stroke-width=${strokeWidth} d="${pathes[i].d}"/>`
  }
  str  = `${str}</svg></div>`
  return str
}
