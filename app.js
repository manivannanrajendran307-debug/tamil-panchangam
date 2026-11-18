const LAT=62.472252,LON=6.15492,HEIGHT=10,OBS=new Astronomy.Observer(LAT,LON,HEIGHT);
const TZ='Europe/Oslo',START='2026-11-18',END='2037-12-31';
const PLANET_TA={Sun:'Surya',Moon:'Chandra',Mars:'Chevvai',Mercury:'Budhan',Jupiter:'Guru',Venus:'Sukra',Saturn:'Sani'};
const HORAI_ORDER=['Sun','Venus','Mercury','Moon','Saturn','Jupiter','Mars'];
const WEEK=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const GDAY=[
['Uthi','Amirtha','Rogam','Laabam','Dhanam','Sugam','Soram','Visham'],
['Amirtha','Visham','Rogam','Laabam','Dhanam','Sugam','Soram','Uthi'],
['Rogam','Laabam','Dhanam','Sugam','Soram','Uthi','Visham','Amirtha'],
['Laabam','Dhanam','Sugam','Soram','Visham','Uthi','Amirtha','Rogam'],
['Dhanam','Sugam','Soram','Uthi','Amirtha','Visham','Rogam','Laabam'],
['Sugam','Soram','Uthi','Visham','Amirtha','Rogam','Laabam','Dhanam'],
['Soram','Visham','Uthi','Amirtha','Rogam','Laabam','Dhanam','Sugam']];
const GNIGHT=[
['Dhanam','Sugam','Soram','Visham','Uthi','Amirtha','Rogam','Laabam'],
['Sugam','Soram','Uthi','Amirtha','Visham','Rogam','Laabam','Dhanam'],
['Soram','Uthi','Visham','Amirtha','Rogam','Laabam','Dhanam','Sugam'],
['Uthi','Amirtha','Rogam','Laabam','Dhanam','Sugam','Soram','Visham'],
['Amirtha','Visham','Rogam','Laabam','Dhanam','Sugam','Soram','Uthi'],
['Rogam','Laabam','Dhanam','Sugam','Soram','Uthi','Visham','Amirtha'],
['Laabam','Dhanam','Sugam','Soram','Uthi','Visham','Amirtha','Rogam']];
const GOOD=new Set(['Amirtha','Dhanam','Uthi','Laabam','Sugam']);
const TAMIL_MONTHS=['Chithirai','Vaikasi','Aani','Aadi','Avani','Purattasi','Aippasi','Karthigai','Margazhi','Thai','Maasi','Panguni'];
const RASI_NAMES=['Mesha','Rishabha','Mithuna','Kataka','Simha','Kanya','Tula','Vrischika','Dhanus','Makara','Kumbha','Meena'];
const TAMIL_YEARS=['Prabhava','Vibhava','Shukla','Pramodoota','Prajothpathi','Aangirasa','Srimukha','Bhava','Yuva','Dhathu','Eeswara','Vehudhanya','Pramathi','Vikrama','Vishu','Chitrabhanu','Subhanu','Tharana','Parthiva','Viyaya','Sarvajith','Sarvadhari','Virodhi','Vikruthi','Kara','Nandhana','Vijaya','Jaya','Manmatha','Dhurmukhi','Hevilambi','Vilambi','Vikari','Sarvari','Plava','Subhakrith','Sobhakrith','Krodhi','Viswavasu','Parabhava','Plavanga','Keelaka','Saumya','Sadharana','Virodhikrith','Paridhavi','Pramadhisa','Ananda','Rakshasa','Nala','Pingala','Kalayukthi','Siddharthi','Raudri','Durmathi','Dhundubhi','Rudhirodgari','Raktakshi','Krodhana','Akshaya'];
const TITHI=['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima','Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya'];
const NAK=['Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

function pad(n){return String(n).padStart(2,'0')}
function iso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function localNoon(s){return new Date(s+'T12:00:00')}
function fmt(d){return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:TZ})}
function fmtShort(d){return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:TZ})}
function ayanamsa(date){let y=date.getUTCFullYear(),start=Date.UTC(y,0,1),frac=(date.getTime()-start)/(365.2425*864e5);return 24.2203+0.01395*(y+frac-2026)}
function norm(x){x%=360;return x<0?x+360:x}
function siderealSun(date){return norm(Astronomy.SunPosition(date).elon-ayanamsa(date))}
function moonSidereal(date){return norm(Astronomy.EclipticGeoMoon(date).elon-ayanamsa(date))}
function elong(date){return Astronomy.PairLongitude(Astronomy.Body.Moon,Astronomy.Body.Sun,date)}
function sunriseSet(d){let noon=new Date(d);noon.setHours(12,0,0,0);let rise=Astronomy.SearchRiseSet(Astronomy.Body.Sun,OBS,-1,noon,1);let set=Astronomy.SearchRiseSet(Astronomy.Body.Sun,OBS,1,noon,1);return {rise:rise?rise.date:null,set:set?set.date:null}}
function nextDayRise(d){let n=new Date(d);n.setDate(n.getDate()+1);return sunriseSet(n).rise}
function segments(a,b,n){let out=[],step=(b.getTime()-a.getTime())/n;for(let i=0;i<n;i++)out.push([new Date(a.getTime()+i*step),new Date(a.getTime()+(i+1)*step)]);return out}
function gowri(d){let s=sunriseSet(d),n=nextDayRise(d);return {day:segments(s.rise,s.set,8).map((x,i)=>[x[0],x[1],GDAY[d.getDay()][i]]),night:segments(s.set,n,8).map((x,i)=>[x[0],x[1],GNIGHT[d.getDay()][i]])}}
function horai(d){let s=sunriseSet(d),n=nextDayRise(d),wd=d.getDay(),first=HORAI_ORDER.indexOf(WEEKDAY_PLANET[wd]);let seq=[];for(let i=0;i<24;i++)seq.push(HORAI_ORDER[(first+i)%7]);return {day:segments(s.rise,s.set,12).map((x,i)=>[x[0],x[1],seq[i]]),night:segments(s.set,n,12).map((x,i)=>[x[0],x[1],seq[i+12]])}}
const WEEKDAY_PLANET=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
function sun8(d){let s=sunriseSet(d);return segments(s.rise,s.set,8)}
function trikalam(d){let p=sun8(d),wd=d.getDay();let rahu=[7,1,6,4,5,2,3][wd],yama=[4,3,2,1,0,6,5][wd],gulika=[6,5,4,3,2,1,0][wd];return {rahu:p[rahu],yama:p[yama],gulika:p[gulika]}}
function binaryBoundary(start,kind){let fn=kind==='tithi'?x=>Math.floor(elong(x)/12):x=>Math.floor(moonSidereal(x)/(360/27));let a=start,b=new Date(start.getTime()+48*3600000),v=fn(a),last=a;for(let t=new Date(a.getTime()+30*60000);t<=b;t=new Date(t.getTime()+30*60000)){if(fn(t)!==v){let lo=last,hi=t;for(let i=0;i<30;i++){let mid=new Date((lo.getTime()+hi.getTime())/2);if(fn(mid)===v)lo=mid;else hi=mid}return hi}last=t}return null}
function panchang(d){let s=sunriseSet(d),t=elong(s.rise),ti=Math.floor(t/12),na=Math.floor(moonSidereal(s.rise)/(360/27));return {tithi:TITHI[ti],tithiNo:ti+1,tithiEnd:binaryBoundary(s.rise,'tithi'),nakshatra:NAK[na],nakNo:na+1,nakEnd:binaryBoundary(s.rise,'nak')}}
function sankrantiBefore(d){let target=0,best=null;let start=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0));for(let k=0;k<45;k++){let q=new Date(start.getTime()-(k+1)*86400000);let a=siderealSun(q),b=siderealSun(new Date(q.getTime()+86400000));let ia=Math.floor(a/30),ib=Math.floor(b/30);if(ia!==ib){target=(ib*30);let lo=q,hi=new Date(q.getTime()+86400000);for(let i=0;i<35;i++){let mid=new Date((lo.getTime()+hi.getTime())/2);let rel=norm(siderealSun(mid)-target);if(rel<180)hi=mid;else lo=mid}best=hi;break}}return best}
function tamilCalendar(d){let tr=sankrantiBefore(d),s=sunriseSet(d);if(!tr)return {month:'',day:'',year:''};let transitLocalDate=new Date(tr);let firstDay=new Date(transitLocalDate.getFullYear(),transitLocalDate.getMonth(),transitLocalDate.getDate(),12,0,0);let sameDayRise=sunriseSet(firstDay).rise;if(tr.getTime()>sameDayRise.getTime())firstDay.setDate(firstDay.getDate()+1);let days=Math.floor((new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())).getTime()-firstDay.getTime())/86400000)+1;let sunSid=siderealSun(s.rise),rasi=Math.floor(sunSid/30);let month=TAMIL_MONTHS[rasi];let gy=d.getFullYear()-(rasi===0&&d.getMonth()<3?1:0);let tamilStartYear=(d.getMonth()+1<4)?d.getFullYear()-1:d.getFullYear();let yi=((tamilStartYear-1987)%60+60)%60;return {month,day:days,year:TAMIL_YEARS[yi],transit:tr,rasi:RASI_NAMES[rasi]}}
function row(x,good=true){return '<tr><td>'+fmtShort(x[0])+'–'+fmtShort(x[1])+'</td><td>'+x[2]+'</td>'+(good?'<td class="'+(GOOD.has(x[2])?'good':'bad')+'">'+(GOOD.has(x[2])?'Good':'Avoid')+'</td>':'')+'</tr>'}
function render(sdate){let d=localNoon(sdate),s=sunriseSet(d),g=gowri(d),h=horai(d),p=panchang(d),tc=tamilCalendar(d),tri=trikalam(d);document.getElementById('date').value=sdate;
let hgood=x=>['Moon','Mercury','Jupiter','Venus'].includes(x[2]);
document.getElementById('app').innerHTML=
'<div class="card"><div class="dateRow"><div><div class="date">'+d.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})+'</div><div class="muted">'+WEEK[d.getDay()]+' • Ålesund, Norway</div></div><div class="muted">'+tc.month+' '+tc.day+'</div></div></div>'+
'<div class="card"><h3>Tamil Calendar</h3><div class="grid"><div class="item"><b>Tamil date</b><br>'+tc.month+' '+tc.day+'</div><div class="item"><b>Tamil year</b><br>'+tc.year+'</div><div class="item"><b>Rasi</b><br>'+tc.rasi+'</div><div class="item"><b>Sunrise</b><br>'+fmtShort(s.rise)+'</div><div class="item"><b>Sunset</b><br>'+fmtShort(s.set)+'</div><div class="item"><b>Tithi</b><br>'+p.tithi+'<br><span class="muted">ends '+(p.tithiEnd?fmt(p.tithiEnd):'—')+'</span></div><div class="item"><b>Nakshatra</b><br>'+p.nakshatra+'<br><span class="muted">ends '+(p.nakEnd?fmt(p.nakEnd):'—')+'</span></div></div></div>'+
'<div class="card"><h3>Gowri Panchangam — daytime</h3><table><tr><th>Ålesund time</th><th>Period</th><th>Status</th></tr>'+g.day.map(x=>row(x)).join('')+'</table></div>'+
'<div class="card"><h3>Gowri Panchangam — night</h3><table><tr><th>Ålesund time</th><th>Period</th><th>Status</th></tr>'+g.night.map(x=>row(x)).join('')+'</table></div>'+
'<div class="card"><h3>Horai — daytime</h3><table><tr><th>Ålesund time</th><th>Planet</th><th>Status</th></tr>'+h.day.map(x=>'<tr><td>'+fmtShort(x[0])+'–'+fmtShort(x[1])+'</td><td>'+PLANET_TA[x[2]]+' ('+x[2]+')</td><td class="'+(hgood(x)?'good':'bad')+'">'+(hgood(x)?'Favourable':'Less favourable')+'</td></tr>').join('')+'</table></div>'+
'<div class="card"><h3>Horai — night</h3><table><tr><th>Ålesund time</th><th>Planet</th><th>Status</th></tr>'+h.night.map(x=>'<tr><td>'+fmtShort(x[0])+'–'+fmtShort(x[1])+'</td><td>'+PLANET_TA[x[2]]+' ('+x[2]+')</td><td class="'+(hgood(x)?'good':'bad')+'">'+(hgood(x)?'Favourable':'Less favourable')+'</td></tr>').join('')+'</table></div>'+
'<div class="card"><h3>Rahu Kalam / Yamagandam / Kuligai</h3><div class="grid"><div class="item"><b>Rahu Kalam</b><br>'+fmtShort(tri.rahu[0])+'–'+fmtShort(tri.rahu[1])+'</div><div class="item"><b>Yamagandam</b><br>'+fmtShort(tri.yama[0])+'–'+fmtShort(tri.yama[1])+'</div><div class="item"><b>Kuligai</b><br>'+fmtShort(tri.gulika[0])+'–'+fmtShort(tri.gulika[1])+'</div></div></div>'+
'<div class="card note"><b>Calculation note</b><br>Solar times are calculated for Ålesund using Astronomy Engine and Europe/Oslo local time. Tamil month/year follows a sidereal Sun / Lahiri-style ayanamsa. Tithi and Nakshatra are calculated at local sunrise and their next boundary is shown. These are traditional panchangam calculations, not scientific predictions.</div>';
}
function go(n){let d=localNoon(document.getElementById('date').value);d.setDate(d.getDate()+n);let s=iso(d);if(s>=START&&s<=END)render(s)}
function showSelected(){let s=document.getElementById('date').value;if(s>=START&&s<=END)render(s)}
let now=new Date(),initial=iso(now);if(initial<START)initial=START;if(initial>END)initial=END;render(initial);if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');