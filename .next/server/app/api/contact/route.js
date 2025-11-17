"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},2361:e=>{e.exports=require("events")},7147:e=>{e.exports=require("fs")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},2037:e=>{e.exports=require("os")},1017:e=>{e.exports=require("path")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},3702:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>g,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>h,staticGenerationAsyncStorage:()=>u});var s={};t.r(s),t.d(s,{POST:()=>p});var o=t(9303),n=t(8716),a=t(670),i=t(7070),l=t(6119);async function p(e){try{let r=await e.json();if(!r.name||!r.email||!r.message)return i.NextResponse.json({success:!1,error:"Vul alle velden in"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email))return i.NextResponse.json({success:!1,error:"Ongeldig e-mailadres"},{status:400});if(!await (0,l.r)(r))return i.NextResponse.json({success:!1,error:"Er ging iets mis bij het versturen. Probeer het opnieuw."},{status:500});return i.NextResponse.json({success:!0,message:"Bericht succesvol verzonden!"})}catch(e){return console.error("Contact form error:",e),i.NextResponse.json({success:!1,error:"Server error"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"/Users/baskoerhuis/jelte3D/app/api/contact/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:u,serverHooks:h}=c,m="/api/contact/route";function g(){return(0,a.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:u})}},6119:(e,r,t)=>{t.d(r,{V:()=>n,r:()=>a});var s=t(5245);function o(){return s.createTransport({host:process.env.SMTP_HOST||"smtp.strato.com",port:parseInt(process.env.SMTP_PORT||"465"),secure:!0,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}})}async function n(e){try{let r=o(),t=process.env.ORDER_EMAIL||"jeltevveen@gmail.com",s={from:process.env.SMTP_USER,to:t,subject:`🎯 Nieuwe Bestelling van ${e.name}`,html:function(e){let{name:r,address:t,city:s,contactMethod:o,contactValue:n,products:a,dropoffLocation:i,comments:l}=e;return`
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #007AFF; border-bottom: 2px solid #007AFF; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 25px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; display: inline-block; width: 150px; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #007AFF; color: white; }
    .total { font-weight: bold; background-color: #f5f5f5; }
  </style>
</head>
<body>
  <h1>🎯 Nieuwe Bestelling - 3D Prints Baarn</h1>
  
  <h2>Klantgegevens</h2>
  <div class="info-row"><span class="label">Naam:</span> ${r}</div>
  <div class="info-row"><span class="label">Adres:</span> ${t}</div>
  <div class="info-row"><span class="label">Woonplaats:</span> ${s}</div>
  <div class="info-row"><span class="label">Contact via:</span> ${"email"===o?"E-mail":"Telefoon"}</div>
  <div class="info-row"><span class="label">${"email"===o?"E-mailadres":"Telefoonnummer"}:</span> ${n}</div>
  
  <h2>Bestelde Producten</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Aantal</th>
        <th>Prijs Type</th>
      </tr>
    </thead>
    <tbody>
      ${a.map(e=>`
        <tr>
          <td>${e.productName}</td>
          <td>${e.quantity}</td>
          <td>${"child"===e.priceType?"Kinderprijs":"Volwassen prijs"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  
  <h2>Bezorggegevens</h2>
  <div class="info-row"><span class="label">Aflevering:</span> ${i}</div>
  
  ${l?`
  <h2>Opmerkingen</h2>
  <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007AFF;">
    ${l.replace(/\n/g,"<br>")}
  </p>
  `:""}
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
  <p style="color: #666; font-size: 0.9em;">
    Deze e-mail is automatisch gegenereerd door het bestelsysteem van 3D Prints Baarn.
  </p>
</body>
</html>
`}(e)};return await r.sendMail(s),!0}catch(e){return console.error("Error sending email:",e),!1}}async function a(e){try{let r=o(),t=process.env.ORDER_EMAIL||"jeltevveen@gmail.com",s={from:process.env.SMTP_USER,to:t,subject:`💬 Nieuw Contactbericht van ${e.name}`,html:`
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #007AFF; }
    .info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007AFF; }
  </style>
</head>
<body>
  <h1>💬 Nieuw Contactbericht</h1>
  <p><strong>Van:</strong> ${e.name}</p>
  <p><strong>E-mail:</strong> ${e.email}</p>
  <h2>Bericht:</h2>
  <div class="info">
    ${e.message.replace(/\n/g,"<br>")}
  </div>
</body>
</html>
      `};return await r.sendMail(s),!0}catch(e){return console.error("Error sending contact email:",e),!1}}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[948,972,245],()=>t(3702));module.exports=s})();