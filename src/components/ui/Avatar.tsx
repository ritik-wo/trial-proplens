import * as React from 'react';
export function Avatar({ name }:{ name:string }){
  const initials = name.split(' ').map(s=>s[0]).join('').slice(0,1).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[--color-neutral-900] text-white flex items-center justify-center text-xs border" aria-label={`Avatar for ${name}`}>{initials}</div>
  );
}
