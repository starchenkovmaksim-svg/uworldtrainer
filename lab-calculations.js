(() => {
  const round = n => Number(n.toFixed(1));
  function calculate(id, v, unit) {
    let result;
    if (id === 'gap') result = `${round(v.na-v.cl-v.hco)} ммоль/л`;
    if (id === 'winter') {
      const low=1.5*v.hco+6,high=1.5*v.hco+10;
      result=unit==='SI'?`${round(low*0.133322)}–${round(high*0.133322)} кПа`:`${round(low)}–${round(high)} мм рт. ст.`;
    }
    if (id === 'osm') result=`${round(2*v.na+(unit==='SI'?v.glucose+v.urea:v.glucose/18+v.urea/2.8))} мОсм/кг`;
    return result || 'Неизвестная формула';
  }
  if(typeof module!=='undefined')module.exports={calculate};
  else window.LabCalculations={calculate};
})();
