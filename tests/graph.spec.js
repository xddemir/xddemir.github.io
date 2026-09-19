import { test, expect } from '@playwright/test';
import { makeGraph, graphView } from '../src/graph-data.js';

test('CV relationships: person, organization, project, technology',()=>{
 const {nodes,edges}=makeGraph();
 for(const e of edges){expect(nodes.some(n=>n.id===e.from)).toBeTruthy();expect(nodes.some(n=>n.id===e.to)).toBeTruthy();}
 const all=graphView(nodes,edges,'all','');expect(all.nodes.some(n=>n.kind==='skill')).toBeFalsy();
 expect(all.nodes.find(n=>n.id==='dogukan').position).toEqual([0,0,0]);
 for(const id of ['dfki','ntt','fraunhofer','campus','rush','dead-inside','rptu'])expect(all.edges).toContainEqual(expect.objectContaining({from:'dogukan',to:id}));
 expect(edges).toContainEqual(expect.objectContaining({from:'dfki',to:'master-xr'}));
 expect(edges).toContainEqual(expect.objectContaining({from:'fraunhofer',to:'agriculture',label:'Capstone collaboration'}));
 const ntt=graphView(nodes,edges,'experience','ntt');for(const title of ['NTT DATA','Enterprise CRM','TypeScript','React Native','Azure','Redis'])expect(ntt.nodes.map(n=>n.title)).toContain(title);
 expect(ntt.edges).toContainEqual(expect.objectContaining({from:'mobile',to:'tool-typescript'}));expect(ntt.edges.some(e=>e.from==='chatbot'&&e.kind==='tool')).toBeFalsy();
});

test('intro, centered graph, logos, detailed video, and back navigation',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('.dev-brand')).toContainText('Dogukan Demir');await expect(page.locator('.dev-summary-strip,.profile-current,.contact-link')).toHaveCount(0);await expect(page.locator('.hero-socials a')).toHaveCount(4);await expect(page.locator('.graph-node.skill')).toHaveCount(0);
 await expect(page.locator('.graph-node.person')).toHaveAccessibleName('Dogukan Demir');
 for(const img of await page.locator('.graph-node img').all())await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBeTruthy();
 await page.locator('.graph-node').filter({hasText:'Dead Inside'}).click();await expect(page.locator('#project-heading')).toHaveText('Dead Inside');await expect(page.locator('.graph-scene')).toHaveCount(1);expect((await page.locator('video').boundingBox()).width).toBeGreaterThan(900);
 await expect.poll(()=>page.locator('video').evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);await page.locator('video').evaluate(async v=>{v.muted=true;await v.play();});await expect.poll(()=>page.locator('video').evaluate(v=>v.currentTime)).toBeGreaterThan(.2);
 await page.locator('.project-connections').getByRole('button',{name:/Built with Unity/}).click();await expect(page.locator('#project-heading')).toHaveText('Unity');await page.goBack();await expect(page.locator('#project-heading')).toHaveText('Dead Inside');await page.getByRole('button',{name:'Back to graph'}).click();await expect(page.locator('.graph-scene')).toBeVisible();expect(errors).toEqual([]);
});

test('organization-specific technologies and keyboard navigation',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Work experience',exact:true}).click();await expect(page.locator('.graph-node')).toHaveCount(6);await expect(page.locator('.graph-node').filter({hasText:'MASTER XR'})).toBeVisible();
 await page.getByRole('group',{name:'Choose organization'}).getByRole('button',{name:'NTT DATA',exact:true}).click();await expect(page.locator('.graph-node').filter({hasText:'TypeScript'})).toBeVisible();await expect(page.locator('.graph-node').filter({hasText:'React Native'})).toBeVisible();
 await page.getByRole('button',{name:'List',exact:true}).click();await expect(page.locator('.dev-project-list>button')).toHaveCount(4);await page.locator('.dev-project-list>button').filter({hasText:'E-commerce apps'}).focus();await page.keyboard.press('Enter');await expect(page.locator('#project-heading')).toHaveText('E-commerce apps');await expect(page.locator('.project-copy')).toContainText('5 payment providers');await page.getByRole('button',{name:'Back to projects'}).click();await expect(page.locator('.dev-project-list>button')).toHaveCount(4);
 await page.goto('/#dfki');await expect(page.locator('#project-heading')).toHaveText('DFKI');await expect(page.locator('.project-copy')).toContainText('20 participants');
});

test('orbit continues through interactions and only pauses explicitly',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');await page.locator('.dev-graph-stage').scrollIntoViewIfNeeded();
 const node=page.locator('[data-node-id="dead-inside"]');const stage=await page.locator('.dev-graph-stage').boundingBox();
 await page.mouse.move(stage.x+30,stage.y+70);let x=(await node.boundingBox()).x;
 await expect.poll(async()=>Math.abs((await node.boundingBox()).x-x)).toBeGreaterThan(.5);
 await page.mouse.down();x=(await node.boundingBox()).x;
 await expect.poll(async()=>Math.abs((await node.boundingBox()).x-x)).toBeGreaterThan(.5);await page.mouse.up();
 await page.getByRole('button',{name:'Work experience',exact:true}).click();await expect(page.getByRole('button',{name:'Pause rotation'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Reset view'}).click();await node.focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'Back to graph'}).click();
 await expect(page.getByRole('button',{name:'Pause rotation'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Pause rotation'}).click();await expect(page.getByRole('button',{name:'Rotate graph',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.waitForTimeout(100);x=(await node.boundingBox()).x;await page.waitForTimeout(250);expect((await node.boundingBox()).x).toBeCloseTo(x,1);
});

test('mobile details and focused graph fit viewport',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.dev-project-list')).toBeVisible();await page.locator('.dev-project-list>button').filter({hasText:'Dead Inside'}).click();await expect(page.locator('#project-heading')).toHaveText('Dead Inside');for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.getByRole('button',{name:'Back to projects'}).click();await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Research & XR',exact:true}).click();await page.getByRole('button',{name:'Graph',exact:true}).click();await expect(page.locator('.graph-node').filter({hasText:'MASTER XR'})).toBeVisible();expect(errors).toEqual([]);
});

test('Work navigation preserves autoplay and explicit Rotate works with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 await page.getByRole('link',{name:'Work',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pause rotation'})).toHaveAttribute('aria-pressed','true');
 const node=page.locator('[data-node-id="dead-inside"]');const x=(await node.boundingBox()).x;
 await expect.poll(async()=>Math.abs((await node.boundingBox()).x-x)).toBeGreaterThan(1);
 await page.locator('.graph-scene').dispatchEvent('pointermove',{movementX:0,movementY:0});
 await expect(page.getByRole('button',{name:'Pause rotation'})).toHaveAttribute('aria-pressed','true');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await page.getByRole('button',{name:'Rotate graph',exact:true}).click();
 const start=(await node.boundingBox()).x;
 await expect.poll(async()=>Math.abs((await node.boundingBox()).x-start)).toBeGreaterThan(1);
});




test('details stay below the same graph and can be closed independently',async({page})=>{
 await page.goto('/');
 await page.locator('.graph-scene').evaluate(el=>{window.originalGraph=el;});
 await page.locator('[data-node-id="dfki"]').click();
 await expect(page.locator('#project-heading')).toHaveText('DFKI');
 expect(await page.evaluate(()=>window.originalGraph===document.querySelector('.graph-scene'))).toBeTruthy();
 expect(await page.locator('#project-detail').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector('.explorer-view').getBoundingClientRect().bottom)).toBeTruthy();
 await page.getByRole('button',{name:'Back to graph'}).click();
 await expect(page.locator('#project-heading')).toHaveText('DFKI');
 await page.locator('[data-node-id="dfki"]').click();
 await expect(page.locator('#project-heading')).toBeFocused();
 await page.getByRole('link',{name:'Work',exact:true}).click();
 await expect(page.locator('#project-heading')).toHaveText('DFKI');
 await page.getByRole('button',{name:'Close details'}).click();
 await expect(page.locator('#project-detail')).toHaveCount(0);
 await expect(page.locator('#explorer-heading')).toBeFocused();
 await expect(page).toHaveURL(/#work$/);
 expect(await page.evaluate(()=>window.originalGraph===document.querySelector('.graph-scene'))).toBeTruthy();
 await page.goBack();await expect(page.locator('#project-heading')).toHaveText('DFKI');
 await page.goForward();await expect(page.locator('#project-detail')).toHaveCount(0);
});
