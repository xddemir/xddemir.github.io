import { links } from './content.js';
import { details } from './project-details.js';
export const categories = {
  experience: { color: '#7caef4', label: 'Work experience' },
  research: { color: '#86c8a6', label: 'Research & XR' },
  backend: { color: '#7caef4', label: 'Backend & mobile' },
  games: { color: '#e8b37d', label: 'Games & simulation' },
  education: { color: '#b49de8', label: 'Education' },
};
export const scopes = {
  experience: ['dfki','ntt','fraunhofer','campus','rush'],
  research: ['dfki'], backend: ['rush','campus','ntt'],
  games: ['dead-inside','fraunhofer'], education: ['rptu'],
};
const orgs = [
  ['dfki','DFKI','Student Research Assistant','research','dfki.png',[-345,-100,-50],'master-xr'],
  ['ntt','NTT DATA','Software Engineer','backend','ntt.svg',[60,80,70],'ntt'],
  ['fraunhofer','Fraunhofer IESE','Capstone collaboration','games','fraunhofer.svg',[-345,140,20],'agriculture'],
  ['campus','Campus Games','Backend Developer','backend','campus.png',[40,-130,65],'campus'],
  ['rush','Rush Automated Systems','Software Team Lead','backend','rush.png',[365,-155,-35],'rush'],
  ['rptu','RPTU','M.Sc. Computer Science','education','rptu.svg',[0,0,0],'rptu'],
];
const projects = [
  ['master-xr','MASTER XR','VR manufacturing training','research',[-455,-265,75],'master-xr'],
  ['gtk','Gaze Interaction Toolkit','Open-source framework','research',[-240,-245,-80],null],
  ['dead-inside','Dead Inside','Independent · Steam release','games',[-20,-290,-50],'dead-inside'],
  ['agriculture','Farming simulator','Fraunhofer IESE × John Deere','games',[-320,300,-55],'agriculture'],
  ['crm','Enterprise CRM','Multi-tenant platform','backend',[-65,260,-25],null],
  ['mobile','E-commerce apps','3 production mobile apps','backend',[175,290,10],null],
  ['chatbot','Mercedes-Benz chatbot','Production conversational service','backend',[355,210,-65],null],
  ['voice','Edge / cloud voice','Local speech + cloud inference','backend',[465,0,90],null],
  ['kiosk','Kiosk & hardware backend','3 applications · MQTT · NFC','backend',[245,-20,-90],null],
  ['bsc','Düzce University','B.Sc. Computer Engineering','education',[-230,50,40],null],
  ['erasmus','UAB Barcelona','Erasmus+ · Jan–Jul 2026','education',[230,50,-40],null],
];
// Specific project-to-tool claims come from the CV, not the general skills list.
const toolUsage = {
 'master-xr':['Unity','C#','XR Interaction Toolkit'],
 gtk:['Unity','C#','XR Interaction Toolkit'],
 'dead-inside':['Unity','C#'],
 agriculture:['CARLA','Unreal Engine','Python','Pygame'],
 crm:['C# / .NET','Azure','Cosmos DB','Docker','Redis','Saga','Event Sourcing'],
 mobile:['React Native','TypeScript','SAP SDKs','Google Maps','Apple Maps','SSO'],
 chatbot:[],
 voice:['Go','Raspberry Pi 5','AWS Bedrock','Whisper','Piper'],
 kiosk:['Go','REST APIs','MQTT','NFC','AWS EC2','Docker Compose','nginx','Cloudflare','GitHub Actions'],
 campus:['Go','MongoDB','MySQL','Firebase OTP','Docker','SSO'],
};
const descriptions = {
 gtk: ['Co-developed a modular Unity framework for gaze interaction and passive attention monitoring.','Refactored dependency modules, separated responsibilities, and implemented reusable gaze selection, dragging, and hybrid gaze/controller components.'],
 crm: ['Contributed to 50+ services for a multi-tenant enterprise CRM platform at NTT DATA.','Implemented tenant-aware APIs and workflows supporting 2 enterprise tenants and 12 authorization tiers. Used Saga and Event Sourcing for distributed transactions, Redis caching, and Azure-based infrastructure.'],
 mobile: ['Delivered 3 production e-commerce applications for the Kuwait market at NTT DATA.','Built with React Native and TypeScript, integrating 5 payment providers, SAP SDKs, Google and Apple Maps, location-based filtering, and SSO.'],
 chatbot: ['Implemented a production chatbot service for Mercedes-Benz while working at NTT DATA.','Developed backend services for conversational interactions and integrated the chatbot into the enterprise service ecosystem. The CV does not specify a separate technology stack for this service.'],
 voice: ['Designed a hybrid edge/cloud voice pipeline at Rush Automated Systems after benchmarking a full-cloud approach.','Speech-to-text and text-to-speech run on a Raspberry Pi 5, while AWS Bedrock handles LLM inference. This reduced response latency and per-request cost.'],
 kiosk: ['Architected a Go backend for a customer kiosk, an admin panel, and content management at Rush Automated Systems.','Designed the API, data model, and service boundaries; integrated dispensing hardware over MQTT and returning-customer authentication over NFC. Deployed on EC2 with Docker Compose, nginx, Cloudflare, and GitHub Actions.'],
 bsc: ['B.Sc. Computer Engineering · Düzce University · Sep 2019–Jan 2023.','The undergraduate foundation for my software engineering work.'],
 erasmus: ['Erasmus+ exchange at Universitat Autònoma de Barcelona · Jan–Jul 2026.','Coursework included Cloud Computing and Smart Industry, as part of my master’s studies at RPTU.'],
};
export function makeGraph() {
  const nodes = orgs.map(([id,title,short,category,logo,position,detailKey])=>({id,title,short,category,logo:`/logos/${logo}`,position,detailKey,kind:'organization',body:details[detailKey].intro,facts:[],tags:details[detailKey].stack,role:short}));
  nodes.unshift({id:'dogukan',title:'Dogukan Demir',short:'Software Engineer',kind:'person',position:[0,0,0],body:'My work across software engineering, research, and independent projects.',tags:[],facts:[]});
  for(const [id,title,short,category,position,detailKey] of projects){ const description=descriptions[id]; nodes.push({id,title,short,category,position,detailKey,kind:'project',body:description?.[0] || details[detailKey]?.intro,facts:description ? [description[1]] : [],tags:toolUsage[id] || details[detailKey]?.stack || [],video:id==='dead-inside',href:id==='dead-inside'?links.steam:id==='gtk'?links.toolkit:undefined}); }
  const edges = [
    ['dfki','master-xr','Developed training scenarios'],['dfki','gtk','Co-developed toolkit'],
    ['ntt','crm','Enterprise backend'],['ntt','mobile','Mobile development'],['ntt','chatbot','Chatbot implementation'],
    ['fraunhofer','agriculture','Capstone collaboration'],
    ['rush','voice','Voice architecture'],['rush','kiosk','Backend & deployment'],
    ['rptu','campus','University platform'],['rptu','agriculture','Master’s capstone'],['rptu','bsc','Previous degree'],['rptu','erasmus','Exchange semester'],
  ].map(([from,to,label])=>({from,to,label,kind:'work'}));
  for (const [to,label] of [['dfki','Student Research Assistant'],['ntt','Software Engineer'],['rush','Software Team Lead'],['campus','Backend Developer'],['fraunhofer','Capstone collaboration'],['dead-inside','Solo developer'],['rptu','Master’s studies']]) edges.push({from:'dogukan',to,label,kind:'role'});
  for(const [id,tools] of Object.entries(toolUsage)) for(const title of tools){const toolId='tool-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-');if(!nodes.some(n=>n.id===toolId)) nodes.push({id:toolId,title,short:'Technology',kind:'skill',position:[0,0,0],body:`${title} in my work.`,tags:[],facts:[]}); edges.push({from:id,to:toolId,label:`Built with ${title}`,kind:'tool'});}
  for(const n of nodes.filter(n=>n.kind==='skill')){n.facts=edges.filter(e=>e.to===n.id).map(e=>`Used for ${nodes.find(x=>x.id===e.from).title}.`);}
  return {nodes,edges};
}
export function graphView(nodes,edges,filter,focus) {
  if(filter==='all'){
    const positions={dogukan:[0,0,0],dfki:[-265,-155,45],'master-xr':[-485,-295,-65],gtk:[-270,-355,65],rush:[270,-150,-45],voice:[505,-275,55],kiosk:[315,-365,-70],campus:[350,70,85],ntt:[150,230,-30],crm:[-5,420,45],mobile:[235,425,-70],chatbot:[465,310,55],fraunhofer:[-260,205,-65],agriculture:[-470,345,55],'dead-inside':[-415,5,80],rptu:[0,-275,-75]};
    const visible=nodes.filter(n=>positions[n.id]).map(n=>({...n,position:positions[n.id]}));const ids=new Set(visible.map(n=>n.id));return {nodes:visible,edges:edges.filter(e=>ids.has(e.from)&&ids.has(e.to))};
  }
  const root=focus || scopes[filter][0];
  const projectIds=edges.filter(e=>e.from===root&&e.kind==='work').map(e=>e.to);
  const primary=new Set([root,...projectIds]);
  const toolIds=edges.filter(e=>primary.has(e.from)&&e.kind==='tool').map(e=>e.to);
  const ids=new Set([...primary,...toolIds]);
  const visible=nodes.filter(n=>ids.has(n.id));
  const projectNodes=visible.filter(n=>n.id!==root&&n.kind!=='skill');
  const tech=visible.filter(n=>n.kind==='skill');
  // Stable, layered positions: organization, projects, then their tools.
  const positioned=visible.map(n=>{
    if(n.id===root) return {...n,position:[0,-190,80]};
    if(n.kind!=='skill'){const i=projectNodes.indexOf(n);return {...n,position:[(i-(projectNodes.length-1)/2)*270,-15,-55]};}
    const i=tech.indexOf(n),cols=Math.min(5,tech.length),row=Math.floor(i/cols),col=i%cols;
    const count=Math.min(cols,tech.length-row*cols);
    return {...n,position:[(col-(count-1)/2)*190,150+row*115,(i%2?95:-95)]};
  });
  return {nodes:positioned,edges:edges.filter(e=>ids.has(e.from)&&ids.has(e.to))};
}
