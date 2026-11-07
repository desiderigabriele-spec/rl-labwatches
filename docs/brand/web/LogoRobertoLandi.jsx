import React, {useEffect, useRef} from 'react';
import {animateLogo, namespaceLogo} from './logo-animation.js';
// Copy the SVG to your public/assets directory. Fetch your own trusted SVG only.
export default function LogoRobertoLandi({src='/assets/RL-completo-metallo.svg', mode='intro', className}) {
  const host=useRef(null);
  useEffect(()=>{
    const abort=new AbortController(); let controller;
    fetch(src,{signal:abort.signal}).then(r=>{if(!r.ok) throw new Error('SVG '+r.status);return r.text();})
      .then(text=>{
        if(abort.signal.aborted) return;
        const doc=new DOMParser().parseFromString(text,'image/svg+xml');
        if(doc.querySelector('parsererror')) throw new Error('Invalid SVG');
        const svg=document.importNode(doc.documentElement,true);
        namespaceLogo(svg); svg.style.width='100%'; svg.style.height='auto'; svg.style.display='block';
        host.current.replaceChildren(svg); controller=animateLogo(svg,{mode});
      }).catch(e=>{if(e.name!=='AbortError') console.error('Logo:',e);});
    return ()=>{abort.abort();controller?.destroy();host.current?.replaceChildren();};
  },[src,mode]);
  return <div ref={host} className={className} role="img" aria-label="Roberto Landi Lab Watches"/>;
}
