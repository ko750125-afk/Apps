fetch('http://localhost:3000').then(r => r.text()).then(t => { 
  console.log('empty src:', t.includes('src=\"\"')); 
  console.log('empty href:', t.includes('href=\"\"')); 
  console.log('apple-touch-icon:', t.includes('apple-touch-icon'));
})