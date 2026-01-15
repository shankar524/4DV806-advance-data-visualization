// Key events during the Russia-Ukraine conflict (Feb 2022 - May 2023)
// These will be displayed as markers on the stream graph

const events = [
  { date: '2022-02-24', title: 'Russian Invasion Begins', description: 'Russia launches full-scale invasion of Ukraine', type: 'major' },
  { date: '2022-02-26', title: 'SWIFT Sanctions', description: 'Western nations agree to remove Russian banks from SWIFT', type: 'major' },
  { date: '2022-03-02', title: 'UN Resolution', description: 'UN General Assembly condemns Russian invasion (141-5)', type: 'political' },
  { date: '2022-03-16', title: 'Mariupol Theatre Bombing', description: 'Russian airstrike hits Mariupol Drama Theatre sheltering civilians', type: 'major' },
  { date: '2022-04-03', title: 'Bucha Massacre Revealed', description: 'Evidence of mass civilian killings in Bucha emerges', type: 'major' },
  { date: '2022-04-14', title: 'Moskva Sunk', description: 'Russian flagship cruiser Moskva sinks in Black Sea', type: 'military' },
  { date: '2022-05-09', title: 'Russia Victory Day', description: "Putin's Victory Day speech, no escalation declared", type: 'political' },
  { date: '2022-05-20', title: 'Mariupol Falls', description: 'Last Ukrainian defenders at Azovstal surrender', type: 'military' },
  { date: '2022-06-23', title: 'EU Candidate Status', description: 'Ukraine granted EU candidate status', type: 'political' },
  { date: '2022-08-24', title: 'Independence Day', description: 'Ukraine Independence Day amid ongoing conflict', type: 'political' },
  { date: '2022-09-21', title: 'Russian Mobilization', description: 'Putin announces partial military mobilization', type: 'major' },
  { date: '2022-09-30', title: 'Annexation Claims', description: 'Russia claims annexation of four Ukrainian regions', type: 'major' },
  { date: '2022-10-08', title: 'Crimean Bridge Attack', description: 'Explosion damages Kerch Bridge to Crimea', type: 'military' },
  { date: '2022-10-10', title: 'Massive Missile Strikes', description: 'Russia launches widespread strikes on Ukrainian infrastructure', type: 'military' },
  { date: '2022-11-11', title: 'Kherson Liberation', description: 'Ukrainian forces liberate Kherson city', type: 'major' },
  { date: '2022-12-21', title: 'Zelensky US Visit', description: 'Zelensky visits Washington, addresses Congress', type: 'political' },
  { date: '2023-01-25', title: 'Tank Pledges', description: 'Germany and US announce tank deliveries to Ukraine', type: 'military' },
  { date: '2023-02-24', title: 'One Year Anniversary', description: 'First anniversary of the full-scale invasion', type: 'major' },
  { date: '2023-03-17', title: 'ICC Warrant', description: 'ICC issues arrest warrant for Putin', type: 'political' },
  { date: '2023-05-06', title: 'Kremlin Drone Attack', description: 'Drone attack reported near Kremlin', type: 'military' }
];

export default events;
