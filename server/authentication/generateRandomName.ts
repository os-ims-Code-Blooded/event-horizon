export default function generateRandomName() {

  const adjective = [
    'Brave',
    'Clever',
    'Fierce',
    'Loyal',
    'Noble',
    'Bold',
    'Quick',
    'Steady',
    'Fearless',
    'Valiant',
    'Wise',
    'Resolute',
    'Stalwart',
    'Mighty',
    'Eager',
    'Cunning',
    'Daring',
    'Sharp',
    'Vigilant',
    'Gallant',
    'Serene',
    'Prudent',
    'Dynamic',
    'Resilient',
    'Intrepid',
    'Ambitious',
    'Honorable',
    'Persistent',
    'Steadfast',
    'Reliable'
  ];
  
  const name = [
    'Rookie',
    'Cadet',
    'Sergeant',
    'Captain',
    'Commodore',
    'Commandant',
    'General',
    'Liaison',
    'Scout',
    'Pathfinder',
    'Vanguard',
    'Overseer',
    'Strategist',
    'Guardian',
    'Executor',
    'Warden',
    'Envoy',
    'Champion',
    'Sentinel',
    'Pioneer',
    'Navigator',
    'Harbinger',
    'Arbiter',
    'Conqueror',
    'Ambassador',
    'Advisor',
    'Chancellor',
    'Provost',
    'Protector',
    'Sovereign',
    'Patron',
    'Moderator'
  ];

  let username = `${adjective[Math.floor(Math.random() * adjective.length)]}${name[Math.floor(Math.random() * name.length)]}#${Math.floor(Math.random() * 1000)}`

  return username;

}